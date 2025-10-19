const { getPlan } = require('../config/plans');
const { query } = require('../database/db');

class SubscriptionManager {
  /**
   * 处理新订阅购买
   * @param {string} email - 用户邮箱
   * @param {string} planId - 套餐ID
   * @param {Object} stripeSubscription - Stripe订阅对象
   * @param {Object} metadata - 元数据
   */
  static async handleNewSubscription(email, planId, stripeSubscription, metadata) {
    try {
      const newPlan = getPlan(planId);
      if (!newPlan) {
        throw new Error('无效的套餐ID');
      }

      console.log('🔄 开始处理新订阅:', {
        email,
        planId,
        planLevel: newPlan.level,
        planName: newPlan.name
      });

      // 获取用户当前所有活跃订阅
      const currentSubscriptions = await this.getUserActiveSubscriptions(email);
      
      // 获取当前最高等级订阅
      const highestLevelSubscription = this.getHighestLevelSubscription(currentSubscriptions);
      
      // 计算新的订阅状态
      const subscriptionResult = await this.calculateNewSubscriptionStatus(
        email,
        newPlan,
        currentSubscriptions,
        highestLevelSubscription,
        stripeSubscription,
        metadata
      );

      console.log('✅ 订阅处理完成:', subscriptionResult);
      return subscriptionResult;

    } catch (error) {
      console.error('❌ 处理订阅失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户所有活跃订阅
   */
  static async getUserActiveSubscriptions(email) {
    const result = await query(`
      SELECT s.*, p.level, p.name as plan_name, p.points, p.model_quota
      FROM subscriptions s
      LEFT JOIN (
        SELECT 
          CASE 
            WHEN plan_type = 'Basic' THEN 1
            WHEN plan_type = 'Pro' THEN 2
            WHEN plan_type = 'Business' THEN 3
            WHEN plan_type = 'Enterprise' THEN 4
            ELSE 0
          END as level,
          plan_type as name,
          points_awarded as points,
          model_quota_awarded as model_quota
        FROM subscriptions
      ) p ON s.plan_type = p.name
      WHERE s.email = $1 
        AND s.status = 'active' 
        AND s.end_date > NOW()
      ORDER BY s.end_date DESC
    `, [email]);

    return result.rows;
  }

  /**
   * 获取最高等级订阅
   */
  static getHighestLevelSubscription(subscriptions) {
    if (!subscriptions || subscriptions.length === 0) {
      return null;
    }

    return subscriptions.reduce((highest, current) => {
      const currentLevel = current.level || 0;
      const highestLevel = highest.level || 0;
      return currentLevel > highestLevel ? current : highest;
    });
  }

  /**
   * 计算新的订阅状态
   */
  static async calculateNewSubscriptionStatus(email, newPlan, currentSubscriptions, highestLevelSubscription, stripeSubscription, metadata) {
    const now = new Date();
    const newSubscriptionEndDate = new Date(stripeSubscription.current_period_end * 1000);

    // 如果用户没有活跃订阅，直接创建新订阅
    if (!currentSubscriptions || currentSubscriptions.length === 0) {
      return await this.createNewSubscription(email, newPlan, stripeSubscription, metadata);
    }

    // 获取当前最高等级
    const currentHighestLevel = highestLevelSubscription ? highestLevelSubscription.level : 0;
    const newPlanLevel = newPlan.level;

    console.log('🔍 订阅等级比较:', {
      currentHighestLevel,
      newPlanLevel,
      isUpgrade: newPlanLevel > currentHighestLevel,
      isDowngrade: newPlanLevel < currentHighestLevel,
      isSameLevel: newPlanLevel === currentHighestLevel
    });

    if (newPlanLevel > currentHighestLevel) {
      // 升级：更新到新等级，累加积分
      return await this.handleUpgrade(email, newPlan, currentSubscriptions, stripeSubscription, metadata);
    } else if (newPlanLevel < currentHighestLevel) {
      // 降级：保持高等级，只累加积分
      return await this.handleDowngrade(email, newPlan, currentSubscriptions, stripeSubscription, metadata);
    } else {
      // 同等级：累加积分和模型配额
      return await this.handleSameLevel(email, newPlan, currentSubscriptions, stripeSubscription, metadata);
    }
  }

  /**
   * 处理升级
   */
  static async handleUpgrade(email, newPlan, currentSubscriptions, stripeSubscription, metadata) {
    console.log('⬆️ 处理订阅升级');
    
    // 计算总积分和模型配额
    const totalPoints = currentSubscriptions.reduce((sum, sub) => sum + (sub.points || 0), 0) + newPlan.points;
    const totalModelQuota = newPlan.modelQuota; // 升级时使用新等级的模型配额

    // 更新用户订阅状态
    await this.updateUserSubscription(email, {
      status: 'active',
      expiry: new Date(stripeSubscription.current_period_end * 1000),
      points: totalPoints,
      modelQuota: totalModelQuota,
      planType: newPlan.name,
      planLevel: newPlan.level
    });

    // 创建新订阅记录
    await this.createSubscriptionRecord(email, newPlan, stripeSubscription, metadata);

    return {
      type: 'upgrade',
      newLevel: newPlan.level,
      totalPoints,
      totalModelQuota,
      message: `升级到 ${newPlan.name} 等级，获得 ${newPlan.points} 积分`
    };
  }

  /**
   * 处理降级（保持高等级，只累加积分）
   */
  static async handleDowngrade(email, newPlan, currentSubscriptions, highestLevelSubscription, stripeSubscription, metadata) {
    console.log('⬇️ 处理订阅降级（保持高等级）');
    
    // 保持最高等级的模型配额，只累加积分
    const totalPoints = currentSubscriptions.reduce((sum, sub) => sum + (sub.points || 0), 0) + newPlan.points;
    const highestModelQuota = highestLevelSubscription.model_quota || 0;

    // 更新用户订阅状态（保持高等级）
    await this.updateUserSubscription(email, {
      status: 'active',
      expiry: new Date(stripeSubscription.current_period_end * 1000),
      points: totalPoints,
      modelQuota: highestModelQuota,
      planType: highestLevelSubscription.plan_type,
      planLevel: highestLevelSubscription.level
    });

    // 创建新订阅记录（标记为积分购买）
    await this.createSubscriptionRecord(email, newPlan, stripeSubscription, metadata, 'points_only');

    return {
      type: 'downgrade_points',
      maintainedLevel: highestLevelSubscription.level,
      addedPoints: newPlan.points,
      totalPoints,
      message: `保持 ${highestLevelSubscription.plan_type} 等级，获得 ${newPlan.points} 积分`
    };
  }

  /**
   * 处理同等级
   */
  static async handleSameLevel(email, newPlan, currentSubscriptions, stripeSubscription, metadata) {
    console.log('🔄 处理同等级订阅');
    
    // 累加积分和模型配额
    const totalPoints = currentSubscriptions.reduce((sum, sub) => sum + (sub.points || 0), 0) + newPlan.points;
    const totalModelQuota = currentSubscriptions.reduce((sum, sub) => sum + (sub.model_quota || 0), 0) + newPlan.modelQuota;

    // 更新用户订阅状态
    await this.updateUserSubscription(email, {
      status: 'active',
      expiry: new Date(stripeSubscription.current_period_end * 1000),
      points: totalPoints,
      modelQuota: totalModelQuota,
      planType: newPlan.name,
      planLevel: newPlan.level
    });

    // 创建新订阅记录
    await this.createSubscriptionRecord(email, newPlan, stripeSubscription, metadata);

    return {
      type: 'same_level',
      level: newPlan.level,
      addedPoints: newPlan.points,
      addedModelQuota: newPlan.modelQuota,
      totalPoints,
      totalModelQuota,
      message: `同等级订阅，获得 ${newPlan.points} 积分和 ${newPlan.modelQuota} 模型配额`
    };
  }

  /**
   * 创建新订阅
   */
  static async createNewSubscription(email, newPlan, stripeSubscription, metadata) {
    console.log('🆕 创建新订阅');
    
    // 更新用户订阅状态
    await this.updateUserSubscription(email, {
      status: 'active',
      expiry: new Date(stripeSubscription.current_period_end * 1000),
      points: newPlan.points,
      modelQuota: newPlan.modelQuota,
      planType: newPlan.name,
      planLevel: newPlan.level
    });

    // 创建订阅记录
    await this.createSubscriptionRecord(email, newPlan, stripeSubscription, metadata);

    return {
      type: 'new',
      level: newPlan.level,
      points: newPlan.points,
      modelQuota: newPlan.modelQuota,
      message: `新用户订阅 ${newPlan.name} 等级`
    };
  }

  /**
   * 更新用户订阅状态
   */
  static async updateUserSubscription(email, subscriptionData) {
    await query(`
      UPDATE users 
      SET 
        subscription_status = $1,
        subscription_expiry = $2,
        points = $3,
        model_quota = $4,
        plan_type = $5,
        plan_level = $6,
        updated_at = NOW()
      WHERE email = $7
    `, [
      subscriptionData.status,
      subscriptionData.expiry,
      subscriptionData.points,
      subscriptionData.modelQuota,
      subscriptionData.planType,
      subscriptionData.planLevel,
      email
    ]);
  }

  /**
   * 创建订阅记录
   */
  static async createSubscriptionRecord(email, plan, stripeSubscription, metadata, recordType = 'normal') {
    const startDate = new Date(stripeSubscription.current_period_start * 1000);
    const endDate = new Date(stripeSubscription.current_period_end * 1000);

    await query(`
      INSERT INTO subscriptions (
        email, plan_type, billing_cycle, price, points_awarded, model_quota_awarded,
        start_date, end_date, stripe_subscription_id, status, record_type, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    `, [
      email,
      plan.name,
      plan.billingCycle,
      stripeSubscription.plan.amount / 100,
      plan.points,
      plan.modelQuota,
      startDate,
      endDate,
      stripeSubscription.id,
      'active',
      recordType
    ]);
  }

  /**
   * 检查并处理过期订阅
   */
  static async checkAndHandleExpiredSubscriptions(email) {
    try {
      // 获取所有活跃订阅
      const activeSubscriptions = await this.getUserActiveSubscriptions(email);
      
      if (activeSubscriptions.length === 0) {
        // 没有活跃订阅，清空用户权益
        await this.clearUserBenefits(email);
        return { type: 'no_active_subscriptions', message: '没有活跃订阅，已清空权益' };
      }

      // 获取当前最高等级订阅
      const highestLevelSubscription = this.getHighestLevelSubscription(activeSubscriptions);
      
      if (highestLevelSubscription) {
        // 更新用户到最高等级订阅
        await this.updateUserSubscription(email, {
          status: 'active',
          expiry: highestLevelSubscription.end_date,
          points: activeSubscriptions.reduce((sum, sub) => sum + (sub.points || 0), 0),
          modelQuota: highestLevelSubscription.model_quota,
          planType: highestLevelSubscription.plan_type,
          planLevel: highestLevelSubscription.level
        });

        return {
          type: 'downgrade_to_highest',
          newLevel: highestLevelSubscription.level,
          message: `已降级到最高等级订阅：${highestLevelSubscription.plan_type}`
        };
      }

    } catch (error) {
      console.error('❌ 检查过期订阅失败:', error);
      throw error;
    }
  }

  /**
   * 清空用户权益
   */
  static async clearUserBenefits(email) {
    await query(`
      UPDATE users 
      SET 
        subscription_status = 'inactive',
        subscription_expiry = NULL,
        points = 0,
        model_quota = 0,
        plan_type = NULL,
        plan_level = NULL,
        updated_at = NOW()
      WHERE email = $1
    `, [email]);
  }
}

module.exports = SubscriptionManager;

const cron = require('node-cron');
const SubscriptionManager = require('../services/subscriptionManager');
const { query } = require('../database/db');

class SubscriptionChecker {
  constructor() {
    this.isRunning = false;
  }

  /**
   * 启动订阅检查任务
   */
  start() {
    console.log('🕐 启动订阅检查任务');
    
    // 每天凌晨2点检查过期订阅
    cron.schedule('0 2 * * *', async () => {
      await this.checkExpiredSubscriptions();
    });

    // 每小时检查一次（可选，用于测试）
    cron.schedule('0 * * * *', async () => {
      await this.checkExpiredSubscriptions();
    });
  }

  /**
   * 检查过期订阅
   */
  async checkExpiredSubscriptions() {
    if (this.isRunning) {
      console.log('⏳ 订阅检查任务正在运行中，跳过本次检查');
      return;
    }

    this.isRunning = true;
    console.log('🔍 开始检查过期订阅...');

    try {
      // 获取所有有活跃订阅的用户
      const usersResult = await query(`
        SELECT DISTINCT email 
        FROM subscriptions 
        WHERE status = 'active' 
          AND end_date > NOW() - INTERVAL '1 day'
      `);

      console.log(`📊 找到 ${usersResult.rows.length} 个用户需要检查订阅状态`);

      for (const user of usersResult.rows) {
        try {
          await this.checkUserSubscriptionStatus(user.email);
        } catch (error) {
          console.error(`❌ 检查用户 ${user.email} 订阅状态失败:`, error);
        }
      }

      console.log('✅ 订阅检查任务完成');
    } catch (error) {
      console.error('❌ 订阅检查任务失败:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * 检查单个用户的订阅状态
   */
  async checkUserSubscriptionStatus(email) {
    try {
      console.log(`🔍 检查用户订阅状态: ${email}`);
      
      // 获取用户当前所有活跃订阅
      const activeSubscriptions = await SubscriptionManager.getUserActiveSubscriptions(email);
      
      if (activeSubscriptions.length === 0) {
        console.log(`⚠️ 用户 ${email} 没有活跃订阅，清空权益`);
        await SubscriptionManager.clearUserBenefits(email);
        return;
      }

      // 获取最高等级订阅
      const highestLevelSubscription = SubscriptionManager.getHighestLevelSubscription(activeSubscriptions);
      
      if (!highestLevelSubscription) {
        console.log(`⚠️ 用户 ${email} 没有有效的最高等级订阅`);
        await SubscriptionManager.clearUserBenefits(email);
        return;
      }

      // 检查是否需要降级
      const currentUserResult = await query(
        'SELECT plan_level, subscription_status FROM users WHERE email = $1',
        [email]
      );

      if (currentUserResult.rows.length > 0) {
        const currentUser = currentUserResult.rows[0];
        const currentLevel = currentUser.plan_level || 0;
        const highestLevel = highestLevelSubscription.level || 0;

        if (currentLevel > highestLevel) {
          console.log(`⬇️ 用户 ${email} 需要降级: ${currentLevel} -> ${highestLevel}`);
          await SubscriptionManager.checkAndHandleExpiredSubscriptions(email);
        }
      }

    } catch (error) {
      console.error(`❌ 检查用户 ${email} 订阅状态失败:`, error);
    }
  }

  /**
   * 手动触发订阅检查
   */
  async manualCheck() {
    console.log('🔧 手动触发订阅检查');
    await this.checkExpiredSubscriptions();
  }
}

module.exports = SubscriptionChecker;

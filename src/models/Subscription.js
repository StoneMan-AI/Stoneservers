const { query } = require('../database/db');

class Subscription {
  // 创建订阅记录
  static async create(subscriptionData) {
    const {
      email,
      planType,
      billingCycle,
      price,
      pointsAwarded,
      modelQuotaAwarded,
      startDate,
      endDate,
      stripeSubscriptionId
    } = subscriptionData;

    try {
      const result = await query(
        `INSERT INTO subscriptions 
         (email, plan_type, billing_cycle, price, points_awarded, 
          model_quota_awarded, start_date, end_date, status, stripe_subscription_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         RETURNING *`,
        [
          email,
          planType,
          billingCycle,
          price,
          pointsAwarded,
          modelQuotaAwarded,
          startDate,
          endDate,
          'active',
          stripeSubscriptionId
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('创建订阅记录失败:', error);
      throw error;
    }
  }

  // 获取用户当前活跃订阅
  static async getActiveSubscription(email) {
    try {
      const result = await query(
        `SELECT * FROM subscriptions 
         WHERE email = $1 AND status = 'active' 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('查询活跃订阅失败:', error);
      throw error;
    }
  }

  // 获取用户所有订阅记录
  static async getAllSubscriptions(email) {
    try {
      const result = await query(
        `SELECT * FROM subscriptions 
         WHERE email = $1 
         ORDER BY created_at DESC`,
        [email]
      );
      return result.rows;
    } catch (error) {
      console.error('查询订阅记录失败:', error);
      throw error;
    }
  }

  // 更新订阅状态
  static async updateStatus(id, status) {
    try {
      const result = await query(
        `UPDATE subscriptions 
         SET status = $1 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('更新订阅状态失败:', error);
      throw error;
    }
  }

  // 根据 Stripe 订阅 ID 查询订阅
  static async findByStripeId(stripeSubscriptionId) {
    try {
      const result = await query(
        `SELECT * FROM subscriptions 
         WHERE stripe_subscription_id = $1 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [stripeSubscriptionId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('根据 Stripe ID 查询订阅失败:', error);
      throw error;
    }
  }

  // 取消订阅
  static async cancel(email) {
    try {
      const result = await query(
        `UPDATE subscriptions 
         SET status = 'cancelled' 
         WHERE email = $1 AND status = 'active' 
         RETURNING *`,
        [email]
      );
      return result.rows;
    } catch (error) {
      console.error('取消订阅失败:', error);
      throw error;
    }
  }

  // 标记订阅为过期
  static async markExpired(email) {
    try {
      const result = await query(
        `UPDATE subscriptions 
         SET status = 'expired' 
         WHERE email = $1 AND status = 'active' AND end_date < NOW() 
         RETURNING *`,
        [email]
      );
      return result.rows;
    } catch (error) {
      console.error('标记订阅过期失败:', error);
      throw error;
    }
  }
}

module.exports = Subscription;


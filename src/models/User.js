const { query, transaction } = require('../database/db');

class User {
  // 创建或获取用户
  static async findOrCreate(email) {
    try {
      // 先查询用户是否存在
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      // 用户不存在，创建新用户
      const newUser = await query(
        `INSERT INTO users (email, subscription_status, points, model_quota) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [email, 'none', 0, 0]
      );

      return newUser.rows[0];
    } catch (error) {
      console.error('创建/查询用户失败:', error);
      throw error;
    }
  }

  // 根据邮箱获取用户
  static async findByEmail(email) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('查询用户失败:', error);
      throw error;
    }
  }

  // 更新用户订阅状态
  static async updateSubscription(email, subscriptionData) {
    const {
      status,
      expiry,
      points,
      modelQuota
    } = subscriptionData;

    try {
      const result = await query(
        `UPDATE users 
         SET subscription_status = $1, 
             subscription_expiry = $2, 
             points = $3, 
             model_quota = $4,
             updated_at = NOW()
         WHERE email = $5
         RETURNING *`,
        [status, expiry, points, modelQuota, email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('更新用户订阅失败:', error);
      throw error;
    }
  }

  // 消耗积分
  static async consumePoints(email, pointsToConsume) {
    try {
      const result = await query(
        `UPDATE users 
         SET points = points - $1,
             updated_at = NOW()
         WHERE email = $2 AND points >= $1
         RETURNING *`,
        [pointsToConsume, email]
      );

      if (result.rows.length === 0) {
        throw new Error('积分不足');
      }

      return result.rows[0];
    } catch (error) {
      console.error('消耗积分失败:', error);
      throw error;
    }
  }

  // 消耗模型配额
  static async consumeModelQuota(email, quotaToConsume = 1) {
    try {
      const result = await query(
        `UPDATE users 
         SET model_quota = model_quota - $1,
             updated_at = NOW()
         WHERE email = $2 AND model_quota >= $1
         RETURNING *`,
        [quotaToConsume, email]
      );

      if (result.rows.length === 0) {
        throw new Error('模型配额不足');
      }

      return result.rows[0];
    } catch (error) {
      console.error('消耗模型配额失败:', error);
      throw error;
    }
  }

  // 增加积分
  static async addPoints(email, pointsToAdd) {
    try {
      const result = await query(
        `UPDATE users 
         SET points = points + $1,
             updated_at = NOW()
         WHERE email = $2
         RETURNING *`,
        [pointsToAdd, email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('增加积分失败:', error);
      throw error;
    }
  }

  // 设置模型配额
  static async setModelQuota(email, quota) {
    try {
      const result = await query(
        `UPDATE users 
         SET model_quota = $1,
             updated_at = NOW()
         WHERE email = $2
         RETURNING *`,
        [quota, email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('设置模型配额失败:', error);
      throw error;
    }
  }

  // 清空用户权益（取消订阅或过期时使用）
  static async clearBenefits(email) {
    try {
      const result = await query(
        `UPDATE users 
         SET subscription_status = 'none',
             subscription_expiry = NULL,
             points = 0,
             model_quota = 0,
             updated_at = NOW()
         WHERE email = $1
         RETURNING *`,
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('清空用户权益失败:', error);
      throw error;
    }
  }

  // 获取用户余额信息
  static async getBalance(email) {
    try {
      const result = await query(
        'SELECT email, points, model_quota, subscription_status, subscription_expiry FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('查询用户余额失败:', error);
      throw error;
    }
  }
}

module.exports = User;


const { query } = require('../database/db');

class StripeTransaction {
  // 创建交易记录
  static async create(transactionData) {
    const {
      email,
      stripeSessionId,
      eventType,
      amount,
      currency = 'usd'
    } = transactionData;

    try {
      const result = await query(
        `INSERT INTO stripe_transactions 
         (email, stripe_session_id, event_type, amount, currency) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [email, stripeSessionId, eventType, amount, currency]
      );
      return result.rows[0];
    } catch (error) {
      console.error('创建交易记录失败:', error);
      throw error;
    }
  }

  // 检查交易是否已处理（幂等性检查）
  static async isProcessed(stripeSessionId, eventType) {
    try {
      const result = await query(
        `SELECT * FROM stripe_transactions 
         WHERE stripe_session_id = $1 AND event_type = $2`,
        [stripeSessionId, eventType]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('检查交易状态失败:', error);
      throw error;
    }
  }

  // 获取用户所有交易记录
  static async getByEmail(email) {
    try {
      const result = await query(
        `SELECT * FROM stripe_transactions 
         WHERE email = $1 
         ORDER BY created_at DESC`,
        [email]
      );
      return result.rows;
    } catch (error) {
      console.error('查询交易记录失败:', error);
      throw error;
    }
  }
}

module.exports = StripeTransaction;


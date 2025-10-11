const cron = require('node-cron');
const { query } = require('../database/db');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// 检查并处理过期订阅
async function checkExpiredSubscriptions() {
  console.log('⏰ 开始检查过期订阅...');
  
  try {
    // 查找所有已过期但状态仍为 active 的用户
    const result = await query(
      `SELECT email FROM users 
       WHERE subscription_status = 'active' 
       AND subscription_expiry < NOW()`,
      []
    );

    if (result.rows.length === 0) {
      console.log('✅ 没有过期订阅');
      return;
    }

    console.log(`📋 发现 ${result.rows.length} 个过期订阅`);

    // 处理每个过期用户
    for (const row of result.rows) {
      const { email } = row;
      
      try {
        // 清空用户权益
        await User.clearBenefits(email);
        
        // 标记订阅为过期
        await Subscription.markExpired(email);
        
        console.log(`✅ 已处理过期订阅: ${email}`);
      } catch (error) {
        console.error(`❌ 处理过期订阅失败 (${email}):`, error);
      }
    }

    console.log('✅ 过期订阅检查完成');
  } catch (error) {
    console.error('❌ 检查过期订阅失败:', error);
  }
}

// 启动定时任务
function startCronJobs() {
  // 每小时检查一次过期订阅
  cron.schedule('0 * * * *', () => {
    checkExpiredSubscriptions();
  });

  console.log('⏰ 定时任务已启动');
  console.log('   - 过期订阅检查: 每小时执行一次');
  
  // 立即执行一次
  checkExpiredSubscriptions();
}

module.exports = {
  startCronJobs,
  checkExpiredSubscriptions,
};


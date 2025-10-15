const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  try {
    console.log('🚀 开始初始化数据库...');
    
    // 读取 SQL 脚本
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // 执行 SQL 脚本
    await pool.query(schema);
    
    console.log('✅ 数据库初始化成功！');
    console.log('📊 已创建以下表：');
    console.log('  - users (用户表)');
    console.log('  - subscriptions (订阅表)');
    console.log('  - stripe_transactions (交易流水表)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();


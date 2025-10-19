-- 更新用户表，添加订阅等级字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS plan_level INTEGER DEFAULT 0;

-- 更新订阅表，添加记录类型字段
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS record_type VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS plan_level INTEGER DEFAULT 0;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_plan_level ON users(plan_level);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_level ON subscriptions(plan_level);
CREATE INDEX IF NOT EXISTS idx_subscriptions_record_type ON subscriptions(record_type);

-- 更新现有订阅记录的等级
UPDATE subscriptions 
SET plan_level = CASE 
  WHEN plan_type = 'Basic' THEN 1
  WHEN plan_type = 'Pro' THEN 2
  WHEN plan_type = 'Business' THEN 3
  WHEN plan_type = 'Enterprise' THEN 4
  ELSE 0
END
WHERE plan_level IS NULL OR plan_level = 0;

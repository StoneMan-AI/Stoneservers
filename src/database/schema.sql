-- 用户表
CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) PRIMARY KEY,  -- Gmail 邮箱，唯一标识
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'none', -- active / expired / cancelled / none
    subscription_expiry TIMESTAMP, -- 当前订阅到期时间
    points INT NOT NULL DEFAULT 0, -- 当前剩余积分
    model_quota INT NOT NULL DEFAULT 0, -- 当前剩余模型数量
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 订阅表（记录每次订阅的详情）
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL, -- Basic / Pro / Business / Enterprise
    billing_cycle VARCHAR(20) NOT NULL, -- monthly / yearly
    price INT NOT NULL, -- 单位：美元
    points_awarded INT NOT NULL, -- 一次性发放积分
    model_quota_awarded INT NOT NULL, -- 每月发放模型数
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active / cancelled / expired
    stripe_subscription_id VARCHAR(255), -- Stripe 订阅 ID
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Stripe 交易流水表（保存 Webhook 事件）
CREATE TABLE IF NOT EXISTS stripe_transactions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    stripe_session_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- checkout.completed / invoice.paid / subscription.updated / etc.
    amount INT NOT NULL, -- 金额（单位：美分）
    currency VARCHAR(10) NOT NULL DEFAULT 'usd',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 为常用字段加索引，提高查询效率
CREATE INDEX IF NOT EXISTS idx_users_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_stripe_transactions_email ON stripe_transactions(email);
CREATE INDEX IF NOT EXISTS idx_stripe_transactions_session_id ON stripe_transactions(stripe_session_id);


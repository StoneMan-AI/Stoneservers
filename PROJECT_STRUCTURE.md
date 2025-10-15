# 📁 项目结构说明

## 目录结构

```
Stoneservers/
├── src/                        # 源代码目录
│   ├── config/                 # 配置文件
│   │   ├── passport.js         # Google OAuth 认证配置
│   │   └── plans.js            # 订阅套餐配置
│   │
│   ├── database/               # 数据库相关
│   │   ├── db.js               # 数据库连接池
│   │   ├── init.js             # 数据库初始化脚本
│   │   └── schema.sql          # 数据库表结构
│   │
│   ├── models/                 # 数据模型
│   │   ├── User.js             # 用户模型
│   │   ├── Subscription.js     # 订阅模型
│   │   └── StripeTransaction.js # 交易流水模型
│   │
│   ├── routes/                 # 路由
│   │   ├── auth.js             # 认证路由
│   │   ├── subscription.js     # 订阅路由
│   │   ├── usage.js            # 使用/消耗路由
│   │   └── plans.js            # 套餐路由
│   │
│   ├── services/               # 业务逻辑服务
│   │   └── stripeService.js    # Stripe 支付服务
│   │
│   ├── tasks/                  # 定时任务
│   │   └── cron.js             # 订阅过期检查任务
│   │
│   └── server.js               # 主服务器文件
│
├── public/                     # 前端静态文件
│   ├── index.html              # 首页/登录页
│   ├── pricing.html            # 订阅套餐页
│   ├── dashboard.html          # 用户控制面板
│   └── success.html            # 支付成功页
│
├── docs/                       # 文档
│   ├── README.md               # 项目说明
│   ├── QUICKSTART.md           # 快速开始指南
│   ├── API.md                  # API 文档
│   ├── DEPLOYMENT.md           # 部署指南
│   └── PROJECT_STRUCTURE.md    # 本文件
│
├── .gitignore                  # Git 忽略文件
├── .dockerignore               # Docker 忽略文件
├── Dockerfile                  # Docker 镜像配置
├── docker-compose.yml          # Docker Compose 配置
├── ecosystem.config.js         # PM2 配置
├── env.example                 # 环境变量模板
└── package.json                # NPM 依赖配置
```

---

## 核心模块说明

### 🔐 认证模块（src/config/passport.js）

**功能**：
- Gmail OAuth 登录
- Session 管理
- 用户认证中间件

**流程**：
1. 用户点击 "Gmail 登录"
2. 重定向到 Google OAuth
3. 用户授权
4. 回调到应用
5. 创建/查找用户
6. 建立 Session

---

### 💾 数据库模块（src/database/）

**db.js - 连接池管理**：
- PostgreSQL 连接池
- 查询封装
- 事务处理

**schema.sql - 数据表结构**：
- `users` - 用户表
- `subscriptions` - 订阅记录表
- `stripe_transactions` - 交易流水表

**init.js - 数据库初始化**：
- 自动创建表
- 执行 SQL 脚本

---

### 📊 数据模型（src/models/）

#### User.js - 用户模型
- `findOrCreate()` - 创建或获取用户
- `findByEmail()` - 查找用户
- `updateSubscription()` - 更新订阅
- `consumePoints()` - 消耗积分
- `consumeModelQuota()` - 消耗模型配额
- `clearBenefits()` - 清空权益

#### Subscription.js - 订阅模型
- `create()` - 创建订阅记录
- `getActiveSubscription()` - 获取活跃订阅
- `updateStatus()` - 更新订阅状态
- `cancel()` - 取消订阅

#### StripeTransaction.js - 交易模型
- `create()` - 创建交易记录
- `isProcessed()` - 幂等性检查

---

### 🛣️ 路由模块（src/routes/）

#### auth.js - 认证路由
- `GET /auth/google` - Gmail 登录
- `GET /auth/google/callback` - OAuth 回调
- `GET /auth/user` - 获取用户信息
- `GET /auth/logout` - 登出

#### subscription.js - 订阅路由
- `POST /api/subscription/create-checkout` - 创建支付会话
- `POST /api/subscription/webhook` - Stripe Webhook
- `GET /api/subscription/status` - 获取订阅状态
- `POST /api/subscription/cancel` - 取消订阅

#### usage.js - 使用路由
- `POST /api/usage/consume` - 消耗积分和配额
- `GET /api/usage/balance` - 查询余额

#### plans.js - 套餐路由
- `GET /api/plans` - 获取所有套餐

---

### 💳 Stripe 服务（src/services/stripeService.js）

**核心功能**：

1. **createCheckoutSession()** - 创建支付会话
2. **handleSubscriptionCreated()** - 处理首次订阅
   - 发放积分（一次性）
   - 设置模型配额
3. **handleSubscriptionRenewed()** - 处理订阅续费
   - 只刷新模型配额
   - 不发放积分
4. **handleSubscriptionUpdated()** - 处理升级/降级
   - 积分累加
   - 配额替换
5. **handleSubscriptionCancelled()** - 处理取消
   - 清空所有权益

---

### ⏰ 定时任务（src/tasks/cron.js）

**功能**：
- 每小时检查一次过期订阅
- 自动清空过期用户的权益
- 更新订阅状态为 `expired`

**执行时间**：
```
0 * * * * （每小时整点执行）
```

---

### 🎨 前端页面（public/）

#### index.html - 首页
- 产品介绍
- Gmail 登录按钮
- 功能特性展示

#### pricing.html - 订阅套餐
- 套餐列表展示
- 月付/年付切换
- 立即订阅功能

#### dashboard.html - 控制面板
- 积分和配额显示
- 订阅信息
- 测试消耗功能
- 取消订阅

#### success.html - 支付成功
- 支付成功提示
- 返回控制面板

---

## 数据流程图

### 1️⃣ 用户注册/登录流程

```
用户点击登录
    ↓
重定向到 Google OAuth
    ↓
用户授权
    ↓
回调到 /auth/google/callback
    ↓
Passport 验证
    ↓
User.findOrCreate(email)
    ↓
创建 Session
    ↓
重定向到首页
```

### 2️⃣ 订阅购买流程

```
用户选择套餐
    ↓
POST /api/subscription/create-checkout
    ↓
创建 Stripe Checkout Session
    ↓
重定向到 Stripe 支付页
    ↓
用户完成支付
    ↓
Stripe 发送 Webhook
    ↓
POST /api/subscription/webhook
    ↓
验证签名 + 幂等性检查
    ↓
处理订阅逻辑
    ↓
更新数据库
    ↓
返回 200 OK
```

### 3️⃣ 积分消耗流程

```
用户调用功能
    ↓
POST /api/usage/consume
    ↓
检查积分余额 (>= 10)
    ↓
检查模型配额 (>= 1)
    ↓
扣减积分 (-10)
    ↓
扣减配额 (-1)
    ↓
返回新余额
```

### 4️⃣ 订阅续费流程

```
Stripe 自动扣款
    ↓
invoice.paid Webhook
    ↓
检查是否续费
    ↓
重置模型配额
    ↓
更新到期时间
    ↓
积分保持不变
```

### 5️⃣ 订阅取消流程

```
用户点击取消
    ↓
POST /api/subscription/cancel
    ↓
调用 Stripe API 取消
    ↓
customer.subscription.deleted Webhook
    ↓
清空积分和配额
    ↓
更新订阅状态为 cancelled
```

---

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `PORT` | 服务端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` / `production` |
| `DB_HOST` | 数据库主机 | `localhost` |
| `DB_PORT` | 数据库端口 | `5432` |
| `DB_NAME` | 数据库名称 | `stoneservers` |
| `DB_USER` | 数据库用户 | `postgres` |
| `DB_PASSWORD` | 数据库密码 | `your_password` |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 密钥 | `GOCSPX-xxx` |
| `GOOGLE_CALLBACK_URL` | OAuth 回调地址 | `http://localhost:3000/auth/google/callback` |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | `sk_test_xxx` / `sk_live_xxx` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe 公钥 | `pk_test_xxx` / `pk_live_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Webhook 签名密钥 | `whsec_xxx` |
| `SESSION_SECRET` | Session 加密密钥 | 随机字符串 |
| `FRONTEND_URL` | 前端地址 | `http://localhost:3000` |

---

## 技术栈

### 后端
- **Node.js** - 运行时环境
- **Express** - Web 框架
- **PostgreSQL** - 关系数据库
- **Passport.js** - 认证中间件
- **Stripe** - 支付系统

### 前端
- **HTML5/CSS3** - 页面结构和样式
- **JavaScript (ES6+)** - 交互逻辑
- **Fetch API** - HTTP 请求

### DevOps
- **Docker** - 容器化
- **PM2** - 进程管理
- **Nginx** - 反向代理（可选）

### 安全
- **Helmet** - HTTP 安全头
- **CORS** - 跨域资源共享
- **express-session** - Session 管理

---

## 订阅套餐配置

套餐配置在 `src/config/plans.js`：

| 套餐 | 月付 | 年付 | 积分 | 模型/月 |
|------|------|------|------|---------|
| Basic | $19 | $99 | 50 | 1 |
| Pro | $49 | $349 | 1000 | 3 |
| Business | $99 | $599 | 3000 | 10 |
| Enterprise | $199 | $1199 | 10000 | 50 |

---

## 数据库设计

### users 表
```sql
email (PK)              -- Gmail 邮箱
subscription_status     -- active/expired/cancelled/none
subscription_expiry     -- 订阅到期时间
points                  -- 当前积分
model_quota             -- 当前模型配额
created_at             -- 创建时间
updated_at             -- 更新时间
```

### subscriptions 表
```sql
id (PK)                    -- 订阅 ID
email (FK)                 -- 用户邮箱
plan_type                  -- 套餐类型
billing_cycle              -- monthly/yearly
price                      -- 价格
points_awarded             -- 发放的积分
model_quota_awarded        -- 发放的配额
start_date                 -- 开始日期
end_date                   -- 结束日期
status                     -- 状态
stripe_subscription_id     -- Stripe 订阅 ID
created_at                 -- 创建时间
```

### stripe_transactions 表
```sql
id (PK)               -- 交易 ID
email (FK)            -- 用户邮箱
stripe_session_id     -- Stripe 会话 ID
event_type            -- 事件类型
amount                -- 金额（美分）
currency              -- 货币
created_at            -- 创建时间
```

---

## 安全特性

✅ **幂等性保证**：Webhook 事件去重  
✅ **签名验证**：Stripe Webhook 签名检查  
✅ **Session 安全**：HttpOnly Cookie  
✅ **SQL 注入防护**：参数化查询  
✅ **HTTPS**：生产环境强制  
✅ **CORS**：跨域请求控制  
✅ **Helmet**：HTTP 安全头  

---

## 性能优化

🚀 **数据库连接池**：复用连接，提高性能  
🚀 **索引优化**：关键字段加索引  
🚀 **事务处理**：保证数据一致性  
🚀 **静态文件**：Express 静态服务  
🚀 **集群模式**：PM2 多进程  

---

## 监控和日志

📊 **应用监控**：PM2 状态监控  
📊 **数据库监控**：连接池状态  
📊 **日志记录**：console.log（生产环境建议使用 Winston）  
📊 **错误追踪**：try-catch 错误处理  

---

## 扩展建议

### 功能扩展
- [ ] 添加邮件通知（订阅成功、即将过期）
- [ ] 增加管理后台（查看用户、订阅统计）
- [ ] 实现积分充值功能
- [ ] 添加推荐奖励机制
- [ ] 支持多种支付方式

### 技术优化
- [ ] 使用 Redis 缓存
- [ ] 添加 API 限流
- [ ] 实现日志系统（Winston/Morgan）
- [ ] 添加单元测试
- [ ] 使用 TypeScript 重写

---

## 联系和支持

如有问题，请查看：
- 📖 [快速开始](./QUICKSTART.md)
- 📚 [API 文档](./API.md)
- 🚀 [部署指南](./DEPLOYMENT.md)


# 🎯 Stoneservers 订阅平台

> 基于 Gmail 登录与 Stripe 支付的现代化订阅制平台

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ 功能特性

- 🔐 **Gmail OAuth 登录** - 使用 Google 账号快速登录，无需注册
- 💳 **Stripe 支付集成** - 安全可靠的国际支付系统
- 📦 **灵活订阅套餐** - 月付/年付多种选择
- ⭐ **积分系统** - 订阅获得积分，按需消费
- 🚀 **模型配额管理** - 每月自动刷新，灵活使用
- 🔄 **订阅管理** - 支持升级、降级、取消
- ⏰ **自动过期处理** - 定时任务自动处理过期订阅
- 🎨 **现代化 UI** - 简洁美观的用户界面

---

## 🚀 快速开始

### 前置要求

- Node.js 16 或更高版本
- PostgreSQL 12 或更高版本
- Google Cloud 账号（用于 OAuth）
- Stripe 账号（用于支付）

### 安装步骤

```bash
# 1. 安装依赖
npm install

# 2. 创建数据库
createdb stoneservers

# 3. 配置环境变量
cp env.example .env
# 编辑 .env 文件，填写相关配置

# 4. 初始化数据库
npm run init-db

# 5. 启动服务
npm run dev
```

**详细步骤请查看**: [📖 快速开始指南](./QUICKSTART.md)

---

## 📊 订阅套餐

| 套餐 | 月付 | 年付 | 一次性积分 | 每月模型数 |
|------|------|------|------------|-----------|
| 💎 Basic | $19 | $99 | 50 | 1 |
| 🚀 Pro | $49 | $349 | 1,000 | 3 |
| 💼 Business | $99 | $599 | 3,000 | 10 |
| 🏢 Enterprise | $199 | $1,199 | 10,000 | 50 |

**使用规则**：
- 每次任务消耗 **10 积分** + **1 模型配额**
- 积分一次性发放，永久有效
- 模型配额每月自动刷新

---

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **PostgreSQL** - 关系型数据库
- **Passport.js** - 认证中间件
- **Stripe** - 支付处理

### 前端
- **HTML5/CSS3** - 现代化网页技术
- **Vanilla JavaScript** - 原生 JS，无框架依赖

### DevOps
- **Docker** - 容器化部署
- **PM2** - Node.js 进程管理
- **Nginx** - 反向代理（可选）

---

## 📁 项目结构

```
Stoneservers/
├── src/                    # 源代码
│   ├── config/            # 配置文件
│   ├── database/          # 数据库相关
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── services/          # 业务逻辑
│   ├── tasks/             # 定时任务
│   └── server.js          # 主服务器
├── public/                # 前端静态文件
├── API.md                 # API 文档
├── DEPLOYMENT.md          # 部署指南
├── QUICKSTART.md          # 快速开始
├── PROJECT_STRUCTURE.md   # 项目结构详解
├── env.example            # 环境变量模板
└── package.json           # 依赖配置
```

**详细说明**: [📁 项目结构文档](./PROJECT_STRUCTURE.md)

---

## 🔌 API 端点

### 认证
- `GET /auth/google` - Gmail 登录
- `GET /auth/google/callback` - OAuth 回调
- `GET /auth/user` - 获取用户信息
- `GET /auth/logout` - 登出

### 订阅
- `GET /api/plans` - 获取套餐列表
- `POST /api/subscription/create-checkout` - 创建支付会话
- `POST /api/subscription/webhook` - Stripe Webhook
- `GET /api/subscription/status` - 获取订阅状态
- `POST /api/subscription/cancel` - 取消订阅

### 使用
- `POST /api/usage/consume` - 消耗积分和配额
- `GET /api/usage/balance` - 查询余额

**完整文档**: [📚 API 文档](./API.md)

---

## 💾 数据库设计

### 核心表

#### `users` - 用户表
- 存储用户邮箱、订阅状态、积分和配额

#### `subscriptions` - 订阅记录表
- 记录所有订阅操作历史

#### `stripe_transactions` - 交易流水表
- 保存 Stripe Webhook 事件，实现幂等性

**详细设计**: 查看 [src/database/schema.sql](./src/database/schema.sql)

---

## 🔐 安全特性

- ✅ **幂等性保证** - Webhook 事件去重处理
- ✅ **签名验证** - Stripe Webhook 签名校验
- ✅ **Session 安全** - HttpOnly Cookie
- ✅ **SQL 注入防护** - 参数化查询
- ✅ **HTTPS** - 生产环境强制使用
- ✅ **CORS 控制** - 跨域请求限制
- ✅ **最小数据收集** - 仅存储邮箱

---

## 🚀 部署

### Docker 部署

```bash
# 使用 Docker Compose
docker-compose up -d
```

### PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status
```

### 手动部署

请查看详细的 [🚀 部署指南](./DEPLOYMENT.md)

---

## 📖 文档

- [📖 快速开始指南](./QUICKSTART.md) - 5 分钟快速上手
- [📚 API 文档](./API.md) - 完整的 API 接口文档
- [🚀 部署指南](./DEPLOYMENT.md) - 生产环境部署说明
- [📁 项目结构](./PROJECT_STRUCTURE.md) - 详细的项目架构说明

---

## 🧪 测试

### Stripe 测试卡号

在测试环境使用以下卡号：

- **卡号**: `4242 4242 4242 4242`
- **过期日期**: 任意未来日期（如 12/25）
- **CVC**: 任意 3 位数字（如 123）
- **邮编**: 任意有效邮编

---

## 📝 环境变量

主要环境变量配置：

```env
# 数据库
DB_HOST=localhost
DB_NAME=stoneservers
DB_USER=postgres
DB_PASSWORD=your_password

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Session
SESSION_SECRET=random_secret_key
```

**完整配置**: 参考 [env.example](./env.example)

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出新功能建议！

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🌟 特色

### 业务逻辑

✨ **首次订阅**: 发放积分 + 模型配额  
✨ **订阅续费**: 只刷新模型配额，积分保留  
✨ **订阅升级**: 积分累加，配额替换  
✨ **订阅降级**: 积分累加，配额替换  
✨ **订阅取消**: 立即清空所有权益  
✨ **订阅过期**: 自动清空所有权益  

### 技术亮点

🚀 **高性能**: 数据库连接池 + 索引优化  
🚀 **高可用**: 支持集群部署（PM2）  
🚀 **易扩展**: 模块化设计，易于维护  
🚀 **自动化**: 定时任务自动处理过期订阅  
🚀 **容器化**: Docker 一键部署  

---

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/stoneservers/issues)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给它一个 Star！⭐**

Made with ❤️ by Your Name

</div>


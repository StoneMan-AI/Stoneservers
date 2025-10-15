# 🚀 快速开始指南

## 前置要求

- Node.js 16+ 
- PostgreSQL 12+
- Google Cloud 账号（用于 OAuth）
- Stripe 账号（用于支付）

## 5 分钟快速启动

### 1️⃣ 克隆项目并安装依赖

```bash
# 安装依赖
npm install
```

### 2️⃣ 配置数据库

```bash
# 确保 PostgreSQL 正在运行
# 创建数据库
createdb stoneservers
```

### 3️⃣ 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑 .env 文件，填写以下最基本的配置
```

**最小配置（用于本地开发测试）：**

```env
# 数据库
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stoneservers
DB_USER=postgres
DB_PASSWORD=你的数据库密码

# Session（生成随机字符串）
SESSION_SECRET=随机生成一个长字符串

# Google OAuth（暂时用测试值，登录会失败但不影响其他功能测试）
GOOGLE_CLIENT_ID=test
GOOGLE_CLIENT_SECRET=test
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Stripe（暂时用测试值，支付会失败但不影响其他功能测试）
STRIPE_SECRET_KEY=test
STRIPE_PUBLISHABLE_KEY=test
STRIPE_WEBHOOK_SECRET=test

# 前端
FRONTEND_URL=http://localhost:3000
```

### 4️⃣ 初始化数据库

```bash
npm run init-db
```

看到 `✅ 数据库初始化成功！` 表示成功。

### 5️⃣ 启动服务

```bash
# 开发模式（推荐）
npm run dev

# 或普通启动
npm start
```

看到以下信息表示启动成功：

```
🚀 服务器启动成功！
📡 监听端口: 3000
🌍 环境: development
🔗 API: http://localhost:3000
⏰ 定时任务已启动
```

### 6️⃣ 访问应用

打开浏览器访问：

- **首页**: http://localhost:3000
- **订阅套餐**: http://localhost:3000/pricing.html
- **控制面板**: http://localhost:3000/dashboard.html
- **健康检查**: http://localhost:3000/health

---

## 完整配置（生产环境）

### 配置 Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目
3. 启用 **Google+ API**
4. 创建 **OAuth 2.0 客户端 ID**
5. 配置授权重定向 URI：
   ```
   http://localhost:3000/auth/google/callback
   ```
6. 复制客户端 ID 和密钥到 `.env`：
   ```env
   GOOGLE_CLIENT_ID=你的客户端ID
   GOOGLE_CLIENT_SECRET=你的客户端密钥
   ```

### 配置 Stripe

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 获取 **API 密钥**（开发者 → API 密钥）
3. 复制到 `.env`：
   ```env
   STRIPE_SECRET_KEY=sk_test_xxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
   ```
4. 配置 **Webhook**（开发者 → Webhooks）：
   - 端点 URL: `http://localhost:3000/api/subscription/webhook`
   - 监听事件：
     - ✓ `checkout.session.completed`
     - ✓ `invoice.paid`
     - ✓ `customer.subscription.updated`
     - ✓ `customer.subscription.deleted`
5. 复制 Webhook 签名密钥到 `.env`：
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxx
   ```

### 重启服务

```bash
# 如果使用 nodemon（npm run dev），会自动重启
# 否则手动重启
npm start
```

---

## 测试功能

### 1. 测试登录

1. 访问 http://localhost:3000
2. 点击 **"使用 Gmail 登录"**
3. 完成 Google 授权
4. 自动跳转到首页

### 2. 测试订阅

1. 点击 **"查看订阅套餐"**
2. 选择任意套餐，点击 **"立即订阅"**
3. 进入 Stripe 支付页面
4. 使用测试卡号：`4242 4242 4242 4242`
   - 过期日期：任意未来日期
   - CVC：任意 3 位数字
5. 完成支付后自动跳转

### 3. 测试积分消耗

1. 访问 http://localhost:3000/dashboard.html
2. 查看积分和模型配额
3. 点击 **"测试消耗"** 按钮
4. 每次消耗 10 积分和 1 模型配额

### 4. 测试 API

```bash
# 健康检查
curl http://localhost:3000/health

# 获取套餐列表
curl http://localhost:3000/api/plans

# 查询余额（需要先登录）
curl http://localhost:3000/api/usage/balance \
  -H "Cookie: connect.sid=你的session"
```

---

## 常见问题

### Q: 数据库连接失败？

**A**: 检查：
- PostgreSQL 是否运行：`psql --version`
- 数据库是否存在：`psql -U postgres -l | grep stoneservers`
- 用户名密码是否正确

### Q: OAuth 登录失败？

**A**: 检查：
- Google OAuth 凭据是否正确
- 回调 URL 是否完全匹配（包括协议和端口）
- 是否启用了 Google+ API

### Q: Stripe 支付失败？

**A**: 检查：
- 是否使用了正确的 Stripe 密钥
- 测试卡号：`4242 4242 4242 4242`
- Webhook 是否配置正确

### Q: 端口被占用？

**A**: 修改 `.env` 中的 `PORT`：
```env
PORT=3001
```

### Q: Session 过期太快？

**A**: 修改 `src/server.js` 中的 `maxAge`：
```javascript
cookie: {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
}
```

---

## 下一步

- 📖 查看 [API 文档](./API.md)
- 🚀 查看 [部署指南](./DEPLOYMENT.md)
- 💡 阅读 [README](./README.md)

---

## 获取帮助

如果遇到问题：

1. 检查控制台日志
2. 查看 [部署指南](./DEPLOYMENT.md) 的故障排除部分
3. 确保所有环境变量配置正确

---

## 开发模式 vs 生产模式

| 功能 | 开发模式 | 生产模式 |
|------|---------|---------|
| 端口 | 3000 | 3000 或自定义 |
| 数据库 | 本地 | 远程/RDS |
| HTTPS | 不需要 | 必需 |
| Session | 不安全 | 安全（secure: true）|
| Stripe | 测试模式 | 生产模式 |
| 日志 | 详细 | 精简 |
| 错误信息 | 显示详情 | 隐藏详情 |

---

祝您使用愉快！🎉


# 🧪 测试指南

## 快速测试步骤

### 1️⃣ 重启服务器

```bash
# 停止当前服务（如果正在运行）
# 按 Ctrl+C

# 重新启动
npm run dev
```

等待看到以下信息：
```
🚀 服务器启动成功！
📡 监听端口: 3000
🌍 环境: development
🔗 API: http://localhost:3000
⏰ 定时任务已启动
```

---

### 2️⃣ 测试订阅套餐页面

#### 打开页面
1. 访问：http://localhost:3000/pricing.html
2. 按 `Ctrl + F5` 强制刷新（清除缓存）

#### 预期结果 ✅
- ✅ 页面正常加载，没有控制台错误
- ✅ 看到 4 个订阅套餐卡片（Basic, Pro, Business, Enterprise）
- ✅ 可以看到两个切换按钮："按月付费" 和 "按年付费 💰 更优惠"
- ✅ 每个套餐显示价格、积分、模型数量等信息

#### 测试交互
1. **切换付费周期**：
   - 点击 "按年付费 💰 更优惠" 按钮
   - 套餐价格应该改变（年付价格）
   - 再点击 "按月付费" 按钮
   - 套餐价格恢复为月付价格

2. **查看控制台**：
   - 按 `F12` 打开开发者工具
   - 切换到 "Console" 标签
   - 应该**没有**红色错误信息
   - 应该看到类似 "加载中..." 的日志

---

### 3️⃣ 测试其他页面

#### 首页
- 访问：http://localhost:3000
- ✅ 页面正常显示
- ✅ 看到 "使用 Gmail 登录" 按钮
- ✅ 看到 4 个功能特性卡片

#### 控制面板
- 访问：http://localhost:3000/dashboard.html
- ✅ 如果未登录，会重定向到首页
- ✅ 如果已登录，显示用户积分和配额信息

#### 成功页面
- 访问：http://localhost:3000/success.html
- ✅ 显示支付成功信息
- ✅ 看到 "进入控制面板" 按钮

---

### 4️⃣ 测试 API 端点

#### 健康检查
```bash
curl http://localhost:3000/health
```

**预期响应**：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 获取套餐列表
```bash
curl http://localhost:3000/api/plans
```

**预期响应**：
```json
{
  "plans": [
    {
      "id": "basic_monthly",
      "name": "Basic",
      "displayName": "Basic 月付",
      "billingCycle": "monthly",
      "price": 19,
      "points": 50,
      "modelQuota": 1,
      "features": [...]
    },
    ...
  ]
}
```

---

## 🐛 常见问题排查

### 问题 1: 页面仍然显示 CSP 错误

**症状**：
```
Refused to execute inline script...
```

**解决方法**：
1. 确保已保存 `src/server.js` 文件
2. 完全停止服务器（Ctrl+C）
3. 重新启动：`npm run dev`
4. 清除浏览器缓存（Ctrl + Shift + Delete）
5. 强制刷新页面（Ctrl + F5）

---

### 问题 2: 套餐列表不显示

**症状**：
- 页面显示 "加载中..."
- 控制台显示网络错误

**解决方法**：
1. 检查服务器是否正在运行
2. 检查控制台的网络请求：
   - 打开开发者工具（F12）
   - 切换到 "Network" 标签
   - 刷新页面
   - 查看 `/api/plans` 请求是否成功（状态码 200）

**调试命令**：
```bash
# 测试 API 是否正常
curl http://localhost:3000/api/plans
```

---

### 问题 3: 点击"立即订阅"无反应

**症状**：
- 点击按钮没有任何反应
- 控制台可能有 JavaScript 错误

**原因**：
- 未登录状态

**解决方法**：
1. 先登录：访问 http://localhost:3000 → 点击 "使用 Gmail 登录"
2. 登录成功后再访问 pricing.html
3. 点击"立即订阅"应该会跳转到 Stripe 支付页面

---

### 问题 4: 数据库连接错误

**症状**：
```
❌ 数据库连接错误
```

**解决方法**：
1. 确保 PostgreSQL 正在运行：
   ```bash
   # Windows
   pg_ctl status
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. 检查数据库是否存在：
   ```bash
   psql -U postgres -l | grep stoneservers
   ```

3. 如果不存在，创建数据库：
   ```bash
   createdb stoneservers
   npm run init-db
   ```

---

## 📊 功能测试清单

### 基础功能
- [ ] 首页加载正常
- [ ] 订阅套餐页面加载正常
- [ ] 控制面板页面加载正常
- [ ] 成功页面加载正常

### API 测试
- [ ] `/health` 返回正常
- [ ] `/api/plans` 返回套餐列表
- [ ] `/auth/check` 返回认证状态

### 交互测试
- [ ] 切换月付/年付功能正常
- [ ] 套餐价格正确显示
- [ ] 点击"立即订阅"有响应（需要登录）

### 浏览器兼容性
- [ ] Chrome/Edge (推荐)
- [ ] Firefox
- [ ] Safari

---

## 🎯 完整测试流程

### 步骤 1: 启动服务
```bash
npm run dev
```

### 步骤 2: 测试首页
1. 访问 http://localhost:3000
2. 检查页面是否正常显示
3. F12 查看控制台，确保无错误

### 步骤 3: 测试套餐页
1. 访问 http://localhost:3000/pricing.html
2. 确认页面加载正常
3. 测试月付/年付切换
4. 检查控制台无 CSP 错误

### 步骤 4: 测试 API
```bash
# 测试健康检查
curl http://localhost:3000/health

# 测试套餐 API
curl http://localhost:3000/api/plans
```

### 步骤 5: 测试登录（可选）
1. 确保配置了 Google OAuth（需要真实凭据）
2. 点击 "使用 Gmail 登录"
3. 完成 Google 授权
4. 检查是否成功登录

### 步骤 6: 测试订阅（可选）
1. 确保配置了 Stripe（可使用测试密钥）
2. 登录后访问 pricing.html
3. 点击"立即订阅"
4. 应该跳转到 Stripe 支付页面（测试模式）

---

## 🔍 调试技巧

### 查看实时日志
```bash
# 服务器日志会实时显示在终端
# 观察以下信息：
- ✅ 数据库连接成功
- 📨 API 请求日志
- ⚠️ 错误信息
```

### 浏览器开发者工具
1. **Console 标签**：查看 JavaScript 错误
2. **Network 标签**：查看网络请求
3. **Application 标签**：查看 Cookie 和 Session

### 数据库查询
```bash
# 连接到数据库
psql -U postgres -d stoneservers

# 查看用户表
SELECT * FROM users;

# 查看订阅表
SELECT * FROM subscriptions;

# 退出
\q
```

---

## ✅ 测试成功标志

如果看到以下所有内容，说明系统运行正常：

1. ✅ 服务器启动无错误
2. ✅ 所有页面正常加载
3. ✅ 控制台无 CSP 错误
4. ✅ API 返回正确数据
5. ✅ 可以切换月付/年付
6. ✅ 健康检查返回 OK

---

## 🎉 下一步

测试通过后，您可以：

1. **配置真实凭据**：
   - 获取 Google OAuth 凭据
   - 获取 Stripe API 密钥
   - 更新 `.env` 文件

2. **测试完整流程**：
   - Gmail 登录
   - 选择套餐
   - 完成支付（使用测试卡）
   - 查看控制面板

3. **准备部署**：
   - 参考 [DEPLOYMENT.md](./DEPLOYMENT.md)
   - 配置生产环境
   - 部署到服务器

---

## 📞 需要帮助？

如果测试遇到问题：

1. 检查 [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南
2. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南的故障排除部分
3. 检查 [SECURITY.md](./SECURITY.md) - 安全配置说明

---

祝测试顺利！🚀


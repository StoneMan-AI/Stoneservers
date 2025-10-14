# 🚀 Git 部署指南

## 📋 本次更新内容

### ✅ 已完成的功能更新

1. **网页背景颜色优化**
   - 将背景色从纯黑色 `#000` 更改为 `#111`
   - 提升视觉体验，减少眼部疲劳

2. **照片包扩展**
   - 新增5个照片包：LinkedIn、Business、Fashion、Travel、Fitness
   - 总计9个照片包，覆盖更多使用场景

3. **谷歌登录功能集成**
   - 接入Stoneservers项目的真实谷歌登录功能
   - 支持用户状态检查和显示
   - 登录后显示用户信息和订阅状态

4. **Stripe支付功能集成**
   - 接入真实的Stripe支付接口
   - 支持4个套餐的月付/年付订阅
   - 完整的支付流程和错误处理

5. **项目文档清理**
   - 删除6个与项目不相关的md文件
   - 保留核心项目文档

---

## 🔧 部署到GitHub

### 1. 初始化Git仓库（如果尚未初始化）

```bash
# 在项目根目录执行
git init
```

### 2. 添加远程仓库

```bash
# 添加GitHub远程仓库
git remote add origin https://github.com/你的用户名/Stoneservers.git

# 或者如果已存在，更新URL
git remote set-url origin https://github.com/你的用户名/Stoneservers.git
```

### 3. 配置Git用户信息

```bash
git config user.name "你的姓名"
git config user.email "你的邮箱@example.com"
```

### 4. 添加文件到暂存区

```bash
# 添加所有修改的文件
git add .

# 或者选择性添加
git add pages/index.js
git add GIT_DEPLOYMENT_GUIDE.md
```

### 5. 提交更改

```bash
git commit -m "feat: 集成谷歌登录和Stripe支付功能

- 新增5个照片包（LinkedIn、Business、Fashion、Travel、Fitness）
- 集成Stoneservers项目的谷歌登录功能
- 接入Stripe支付接口，支持4个套餐订阅
- 优化网页背景色为#111
- 清理不相关的项目文档
- 完善用户状态管理和支付流程"
```

### 6. 推送到GitHub

```bash
# 首次推送
git push -u origin main

# 后续推送
git push origin main
```

---

## 🌐 部署到正式环境

### 1. 服务器环境准备

确保服务器已安装：
- Node.js 16+
- PostgreSQL 12+
- PM2（进程管理）
- Nginx（反向代理）

### 2. 环境变量配置

创建 `.env` 文件：

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stoneservers
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Google OAuth配置
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://yourdomain.com/auth/google/callback

# Stripe配置
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# 会话配置
SESSION_SECRET=your_very_secure_session_secret

# 生产环境配置
NODE_ENV=production
PORT=3000
FRONTEND_URL=http://yourdomain.com
```

### 3. 部署步骤

#### 方法一：使用PM2部署

```bash
# 1. 克隆代码到服务器
git clone https://github.com/你的用户名/Stoneservers.git
cd Stoneservers

# 2. 安装依赖
npm install

# 3. 构建Next.js应用
npm run build

# 4. 启动服务
pm2 start ecosystem.config.js

# 5. 设置开机自启
pm2 startup
pm2 save
```

#### 方法二：使用Docker部署

```bash
# 1. 构建Docker镜像
docker build -t stoneservers .

# 2. 运行容器
docker run -d \
  --name stoneservers \
  -p 3000:3000 \
  --env-file .env \
  stoneservers

# 3. 使用docker-compose（推荐）
docker-compose up -d
```

### 4. Nginx配置

创建 `/etc/nginx/sites-available/stoneservers`：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/stoneservers /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL证书配置（推荐）

```bash
# 使用Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔍 部署后验证

### 1. 功能测试清单

- [ ] 首页正常加载
- [ ] 谷歌登录功能正常
- [ ] 用户状态显示正确
- [ ] 套餐订阅功能正常
- [ ] Stripe支付流程完整
- [ ] 照片包展示正常
- [ ] 响应式设计适配

### 2. 性能检查

```bash
# 检查服务状态
pm2 status

# 查看日志
pm2 logs stoneservers

# 监控资源使用
pm2 monit
```

### 3. 数据库连接测试

```bash
# 测试数据库连接
node -e "
const db = require('./src/database/db');
db.query('SELECT NOW()', (err, result) => {
  if (err) console.error('数据库连接失败:', err);
  else console.log('数据库连接成功:', result.rows[0]);
  process.exit();
});
"
```

---

## 🚨 故障排除

### 常见问题

1. **谷歌登录失败**
   - 检查GOOGLE_CLIENT_ID和GOOGLE_CLIENT_SECRET
   - 确认回调URL配置正确

2. **Stripe支付失败**
   - 检查STRIPE_SECRET_KEY是否正确
   - 确认Webhook URL配置

3. **数据库连接失败**
   - 检查数据库服务是否运行
   - 验证连接参数

4. **静态资源加载失败**
   - 检查Nginx配置
   - 确认文件权限

### 日志查看

```bash
# PM2日志
pm2 logs stoneservers --lines 100

# Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 系统日志
sudo journalctl -u nginx -f
```

---

## 📞 技术支持

如遇到部署问题，请检查：

1. 环境变量配置是否正确
2. 数据库连接是否正常
3. 第三方服务（Google、Stripe）配置是否有效
4. 服务器资源是否充足
5. 网络连接是否正常

---

## 📝 更新记录

- **2025-01-XX**: 初始版本，集成谷歌登录和Stripe支付功能
- **2025-01-XX**: 优化背景色，新增照片包，清理项目文档

---

*最后更新：2025年1月*

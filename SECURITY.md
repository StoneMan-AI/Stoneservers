# 🔐 安全配置说明

## Content Security Policy (CSP)

### 当前配置

项目使用 Helmet 中间件提供安全防护，当前 CSP 配置如下：

```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],           // 默认只允许同源资源
      styleSrc: ["'self'", "'unsafe-inline'"],  // 允许内联样式
      scriptSrc: ["'self'", "'unsafe-inline'"], // 允许内联脚本
      imgSrc: ["'self'", 'data:', 'https:'],    // 允许图片
    },
  },
})
```

### 为什么允许 'unsafe-inline'？

当前项目的前端页面使用了内联 JavaScript 和 CSS，为了简化开发和部署：
- 所有 HTML 页面是自包含的
- 不需要额外的 JavaScript 文件管理
- 适合小型项目快速开发

### 安全性考虑

#### 当前风险
- ⚠️ **XSS 风险稍高** - 允许内联脚本可能增加 XSS 攻击风险
- ✅ **限制资源来源** - 仍然限制了外部资源加载
- ✅ **HTTPS 传输** - 生产环境强制使用 HTTPS

#### 缓解措施
1. **输入验证** - 所有用户输入经过验证
2. **参数化查询** - 防止 SQL 注入
3. **Session 安全** - HttpOnly Cookie
4. **CORS 限制** - 限制跨域请求

---

## 🚀 生产环境安全建议

### 选项 1: 提取内联脚本（推荐用于大型项目）

**优点**：
- ✅ 更高的安全性
- ✅ 可以使用 nonce 或 hash
- ✅ 更好的缓存控制

**实现步骤**：

1. 创建外部 JavaScript 文件：
```bash
# 创建 JS 目录
mkdir -p public/js

# 提取脚本到外部文件
# public/js/pricing.js
# public/js/dashboard.js
```

2. 更新 HTML 引用：
```html
<!-- 替换内联脚本 -->
<script src="/js/pricing.js"></script>
```

3. 更新 CSP 配置：
```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],  // 移除 unsafe-inline
      scriptSrc: ["'self'"],  // 移除 unsafe-inline
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
})
```

### 选项 2: 使用 Nonce（推荐用于中型项目）

**优点**：
- ✅ 保留内联脚本的便利性
- ✅ 提高安全性
- ✅ 每次请求生成新的 nonce

**实现步骤**：

1. 安装依赖：
```bash
npm install uuid
```

2. 修改服务器配置：
```javascript
const { v4: uuidv4 } = require('uuid');

app.use((req, res, next) => {
  res.locals.nonce = uuidv4();
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
```

3. 在 HTML 中添加 nonce：
```html
<script nonce="<%= nonce %>">
  // your script
</script>
```

### 选项 3: 使用 Hash（适合静态内容）

**优点**：
- ✅ 不需要动态生成
- ✅ 适合静态页面

**实现步骤**：

1. 计算脚本 hash：
```bash
echo -n "your script content" | openssl dgst -sha256 -binary | openssl base64
```

2. 在 CSP 中添加 hash：
```javascript
scriptSrc: ["'self'", "'sha256-YOUR_HASH_HERE'"]
```

---

## 🔒 其他安全建议

### 1. HTTPS 配置

**开发环境**：
- 可以使用 HTTP（已配置）

**生产环境**：
- ✅ **必须使用 HTTPS**
- ✅ 使用 Let's Encrypt 免费 SSL 证书
- ✅ 启用 HSTS（HTTP Strict Transport Security）

配置示例：
```javascript
// 生产环境强制 HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }));
}
```

### 2. Session 安全

**当前配置**：
```javascript
session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
    httpOnly: true,                                  // 防止 XSS
    maxAge: 24 * 60 * 60 * 1000,                    // 24 hours
  },
})
```

**生产环境增强**：
```javascript
cookie: {
  secure: true,              // 只通过 HTTPS 传输
  httpOnly: true,            // 防止 JavaScript 访问
  sameSite: 'strict',        // 防止 CSRF
  maxAge: 24 * 60 * 60 * 1000,
}
```

### 3. Rate Limiting

**安装**：
```bash
npm install express-rate-limit
```

**配置**：
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. 防止暴力破解

**安装**：
```bash
npm install express-brute
```

**配置**：
```javascript
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

// 保护登录路由
app.post('/auth/login', bruteforce.prevent, (req, res) => {
  // login logic
});
```

### 5. 输入验证

**安装**：
```bash
npm install express-validator
```

**使用**：
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/usage/consume',
  body('email').isEmail(),
  body('amount').isInt({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // process request
  }
);
```

---

## 📋 安全检查清单

### 开发环境
- [x] Helmet 基础配置
- [x] CORS 配置
- [x] Session 安全
- [x] SQL 注入防护
- [x] 环境变量管理

### 生产环境
- [ ] HTTPS 配置
- [ ] 移除 'unsafe-inline' (可选)
- [ ] 启用 HSTS
- [ ] 配置 Rate Limiting
- [ ] 日志监控
- [ ] 定期安全更新
- [ ] 数据库备份
- [ ] 防火墙规则

---

## 🔍 安全测试

### 手动测试

1. **XSS 测试**：
```javascript
// 尝试注入脚本
<script>alert('XSS')</script>
```

2. **SQL 注入测试**：
```sql
'; DROP TABLE users; --
```

3. **CSRF 测试**：
```html
<!-- 从其他域提交表单 -->
<form action="http://yoursite.com/api/..." method="POST">
```

### 自动化工具

1. **OWASP ZAP** - 安全扫描
2. **npm audit** - 依赖漏洞检查
3. **Snyk** - 持续安全监控

---

## 📚 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 💡 总结

**当前配置（开发环境）**：
- ✅ 适合快速开发
- ✅ 基础安全防护
- ⚠️ 允许内联脚本

**建议升级（生产环境）**：
- 🔒 提取内联脚本到外部文件
- 🔒 启用 HTTPS 和 HSTS
- 🔒 添加 Rate Limiting
- 🔒 定期安全审计

根据项目规模和安全要求选择合适的方案。对于当前的订阅平台，**当前配置已经提供了基础的安全保护**，可以安全地用于开发和小规模部署。


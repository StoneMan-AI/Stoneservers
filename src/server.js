const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();

// 导入路由
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const usageRoutes = require('./routes/usage');

// 导入订阅检查任务
const SubscriptionChecker = require('./tasks/subscriptionChecker');
const plansRoutes = require('./routes/plans');

// 导入定时任务
const { startCronJobs } = require('./tasks/cron');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],  // 允许内联事件处理器（onclick 等）
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.stripe.com'], // 允许 Stripe API 请求
      },
    },
    // 生产环境启用 HSTS
    hsts: process.env.NODE_ENV === 'production' ? {
      maxAge: 31536000, // 1 年
      includeSubDomains: true,
      preload: true,
    } : false,
  })
);

// CORS 配置
app.use(cors({
  origin: function(origin, callback) {
    console.log('🌐 CORS 检查 origin:', origin);
    
    // 允许无 origin 的请求（如 Postman、同源请求）
    if (!origin) {
      console.log('✅ 允许无 origin 请求');
      return callback(null, true);
    }
    
    // 开发环境允许所有 localhost
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.log('✅ 开发环境允许:', origin);
        return callback(null, true);
      }
    }
    
    // 生产环境检查配置的域名
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://www.adddesigngroup.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ].filter(Boolean);
    
    console.log('📋 允许的域名:', allowedOrigins);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ 允许的域名:', origin);
      callback(null, true);
    } else {
      console.log('❌ 拒绝的域名:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Webhook 路由需要原始 body，所以要在 bodyParser 之前定义
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));

// Body 解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static('public'));

// Session 配置 - 使用数据库存储
app.use(
  session({
    store: new pgSession({
      conString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      tableName: 'user_sessions'
    }),
    name: 'stoneservers.sid', // 自定义 session cookie 名称
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true, // 允许保存未初始化的 session，确保 Passport 数据被保存
    rolling: false, // 禁用 rolling 模式，避免每次请求都创建新 session
    cookie: {
      secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
      httpOnly: true,
      sameSite: 'lax', // 使用 lax 以支持跨域请求
      // 移除 domain 限制，让 cookie 在子域名间共享
      maxAge: 24 * 60 * 60 * 1000, // 24 小时
      path: '/', // 确保 cookie 在整个站点可用
    },
  })
);

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport 调试中间件
app.use((req, res, next) => {
  if (req.session && req.session.passport) {
    console.log('🔐 Passport Session 数据:', {
      passport: req.session.passport,
      user: req.session.passport.user
    });
  } else {
    console.log('❌ Passport Session 数据缺失');
    console.log('🔍 Session 调试详情:', {
      hasSession: !!req.session,
      sessionKeys: req.session ? Object.keys(req.session) : '无 session',
      sessionContent: req.session ? req.session : null
    });
  }
  next();
});

// Session 调试中间件
app.use((req, res, next) => {
  console.log('🍪 Session 调试:', {
    sessionID: req.sessionID,
    isAuthenticated: req.isAuthenticated(),
    hasUser: !!req.user,
    userEmail: req.user ? req.user.email : null,
    cookies: req.headers.cookie ? '已设置' : '未设置',
    sessionData: req.session ? Object.keys(req.session) : '无 session',
    sessionContent: req.session ? req.session : null,
    cookieHeader: req.headers.cookie,
    sessionStore: req.sessionStore ? '已连接' : '未连接'
  });
  next();
});

// 注册路由
app.use('/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/plans', plansRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 欢迎页面
app.get('/', (req, res) => {
  res.json({
    message: 'Stoneservers 订阅平台 API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      subscription: '/api/subscription',
      usage: '/api/usage',
      plans: '/api/plans',
    },
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '路由不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 启动订阅检查任务
const subscriptionChecker = new SubscriptionChecker();
subscriptionChecker.start();

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 服务器启动成功！');
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📅 订阅检查任务已启动`);
  
  // 根据环境显示不同的 URL
  if (process.env.NODE_ENV === 'production') {
    console.log(`🔗 域名: ${process.env.FRONTEND_URL || 'https://www.adddesigngroup.com'}`);
  } else {
    console.log(`🔗 API: http://localhost:${PORT}`);
  }
  
  // 启动定时任务
  startCronJobs();
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，准备关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，准备关闭服务器...');
  process.exit(0);
});


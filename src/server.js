const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

// 导入路由
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const usageRoutes = require('./routes/usage');
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
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// CORS 配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Webhook 路由需要原始 body，所以要在 bodyParser 之前定义
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));

// Body 解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static('public'));

// Session 配置
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 小时
    },
  })
);

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

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

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 服务器启动成功！');
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  
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


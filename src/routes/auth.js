const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

// Google OAuth 登录
router.get(
  '/google',
  (req, res, next) => {
    console.log('🔐 开始 Google OAuth 登录流程');
    console.log('📋 配置信息:', {
      clientID: process.env.GOOGLE_CLIENT_ID ? '已设置' : '未设置',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '已设置' : '未设置',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.FRONTEND_URL}/auth/google/callback`,
    });
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    // 确保使用 Google 官方登录页面
    accessType: 'offline',
    prompt: 'consent',
  })
);

// OAuth 回调
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  async (req, res) => {
    try {
      console.log('🔐 Google 登录回调开始，用户:', req.user ? req.user.email : '无用户信息');
      
      console.log('✅ 用户登录成功，用户:', req.user.email);
      
      // 确保 session 被标记为已修改，强制保存 Passport 数据
      req.session.touch();
      console.log('🔧 强制标记 session 为已修改');
      
      // 等待 session 保存完成
      await new Promise((resolve) => {
        req.session.save((err) => {
          if (err) {
            console.error('❌ Session 保存失败:', err);
          } else {
            console.log('✅ Session 保存成功，Passport 数据已保存');
            console.log('🔍 当前 Session 内容:', {
              sessionID: req.sessionID,
              passport: req.session.passport,
              sessionKeys: Object.keys(req.session)
            });
          }
          resolve();
        });
      });
      
      // 检查用户订阅状态
      const { query } = require('../database/db');
      const userResult = await query(
        'SELECT email, subscription_status, subscription_expiry FROM users WHERE email = $1',
        [req.user.email]
      );
      
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        console.log('🔍 数据库查询结果:', {
          user: user,
          hasEmail: !!user.email,
          emailValue: user.email
        });
        
        const hasActiveSubscription = user.subscription_status === 'active' && 
          (user.subscription_expiry === null || new Date(user.subscription_expiry) > new Date());
        
        console.log('🔍 用户订阅状态检查:', {
          email: user.email,
          subscription_status: user.subscription_status,
          subscription_expiry: user.subscription_expiry,
          hasActiveSubscription: hasActiveSubscription,
          currentTime: new Date().toISOString()
        });
        
        if (hasActiveSubscription) {
          // 用户已订阅，跳转到 AI 生图页面
          console.log('✅ 用户已订阅，跳转到 AI 生图页面');
          console.log('🔗 执行重定向到: /ai-generator');
          // 直接重定向到前端，携带认证状态
          res.redirect(`${process.env.FRONTEND_URL}/ai-generator?auth=success`);
        } else {
          // 用户未订阅，跳转到首页并定位到 Pricing 模块
          console.log('❌ 用户未订阅，跳转到首页 Pricing 模块');
          console.log('🔗 执行重定向到: /#pricing');
          res.redirect(`${process.env.FRONTEND_URL}/#pricing`);
        }
      } else {
        // 用户不存在，跳转到首页并定位到 Pricing 模块
        console.log('❌ 用户不存在，跳转到首页 Pricing 模块');
        res.redirect('/#pricing');
      }
    } catch (error) {
      console.error('❌ 检查订阅状态失败:', error);
      res.redirect('/#pricing');
    }
  }
);

// 登出
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: '登出失败' });
    }
    res.redirect(process.env.FRONTEND_URL || '/');
  });
});

// 获取当前用户信息
router.get('/user', (req, res) => {
  console.log('🔍 检查用户认证状态:', {
    isAuthenticated: req.isAuthenticated(),
    sessionID: req.sessionID,
    hasUser: !!req.user,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  });
  
  // 加强认证检查
  if (!req.isAuthenticated() || !req.user) {
    console.log('❌ 认证失败 - 用户未登录或用户信息缺失');
    return res.status(401).json({ 
      error: '未登录',
      authenticated: false,
    });
  }
  
  // 检查用户信息完整性
  if (!req.user.email) {
    console.log('❌ 认证失败 - 用户邮箱信息缺失');
    return res.status(401).json({ 
      error: '用户信息不完整',
      authenticated: false,
    });
  }
  
  res.json({
    authenticated: true,
    email: req.user.email,
    subscriptionStatus: req.user.subscription_status,
    subscriptionExpiry: req.user.subscription_expiry,
    points: req.user.points,
    modelQuota: req.user.model_quota,
  });
});

// 检查认证状态
router.get('/check', (req, res) => {
  const isAuth = req.isAuthenticated();
  console.log('🔍 认证检查:', {
    authenticated: isAuth,
    sessionID: req.sessionID,
    userEmail: req.user ? req.user.email : null,
  });
  
  res.json({
    authenticated: isAuth,
    user: isAuth ? {
      email: req.user.email,
      subscriptionStatus: req.user.subscription_status,
    } : null,
  });
});

// 检查用户认证状态（用于前端页面）
router.get('/check', (req, res) => {
  console.log('🔍 认证状态检查:', {
    isAuthenticated: req.isAuthenticated(),
    hasUser: !!req.user,
    userEmail: req.user ? req.user.email : null,
    sessionID: req.sessionID,
    sessionData: req.session ? Object.keys(req.session) : '无 session'
  });
  
  if (req.isAuthenticated() && req.user) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        email: req.user.email
      }
    });
  } else {
    res.json({
      success: false,
      authenticated: false,
      message: '用户未登录'
    });
  }
});


module.exports = router;


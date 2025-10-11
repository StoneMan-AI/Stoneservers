const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

// Gmail 登录
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// OAuth 回调
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    // 登录成功后，先保存 session，然后重定向
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session 保存失败:', err);
        return res.redirect('/');
      }
      console.log('✅ Session 保存成功，用户:', req.user.email);
      // 重定向到控制面板
      res.redirect('/dashboard.html');
    });
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
  });
  
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      error: '未登录',
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

module.exports = router;


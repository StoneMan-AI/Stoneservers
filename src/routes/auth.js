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
    failureRedirect: '/login',
  }),
  (req, res) => {
    // 登录成功，重定向到首页
    res.redirect(process.env.FRONTEND_URL || '/dashboard');
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
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: '未登录' });
  }
  
  res.json({
    email: req.user.email,
    subscriptionStatus: req.user.subscription_status,
    subscriptionExpiry: req.user.subscription_expiry,
    points: req.user.points,
    modelQuota: req.user.model_quota,
  });
});

// 检查认证状态
router.get('/check', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
  });
});

module.exports = router;


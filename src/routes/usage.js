const express = require('express');
const User = require('../models/User');
const router = express.Router();

// 中间件：检查用户是否登录
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: '请先登录' });
  }
  next();
};

// 消耗积分和模型配额
router.post('/consume', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const pointsToConsume = 10; // 固定消耗 10 积分
    const quotaToConsume = 1; // 消耗 1 个模型配额

    // 检查用户当前余额
    const balance = await User.getBalance(email);
    
    if (!balance) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查积分是否足够
    if (balance.points < pointsToConsume) {
      return res.status(400).json({ 
        error: '积分不足，请充值',
        currentPoints: balance.points,
        required: pointsToConsume,
      });
    }

    // 检查模型配额是否足够
    if (balance.model_quota < quotaToConsume) {
      return res.status(400).json({ 
        error: '模型配额不足',
        currentQuota: balance.model_quota,
        required: quotaToConsume,
      });
    }

    // 消耗积分
    await User.consumePoints(email, pointsToConsume);
    
    // 消耗模型配额
    await User.consumeModelQuota(email, quotaToConsume);

    // 获取更新后的余额
    const updatedBalance = await User.getBalance(email);

    res.json({
      message: '消耗成功',
      consumed: {
        points: pointsToConsume,
        modelQuota: quotaToConsume,
      },
      balance: {
        points: updatedBalance.points,
        modelQuota: updatedBalance.model_quota,
      },
    });
  } catch (error) {
    console.error('消耗失败:', error);
    res.status(500).json({ error: error.message || '消耗失败' });
  }
});

// 查询余额
router.get('/balance', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const balance = await User.getBalance(email);
    
    if (!balance) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      email: balance.email,
      points: balance.points,
      modelQuota: balance.model_quota,
      subscriptionStatus: balance.subscription_status,
      subscriptionExpiry: balance.subscription_expiry,
    });
  } catch (error) {
    console.error('查询余额失败:', error);
    res.status(500).json({ error: '查询余额失败' });
  }
});

module.exports = router;


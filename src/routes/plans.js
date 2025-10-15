const express = require('express');
const { getAllPlans } = require('../config/plans');
const router = express.Router();

// 获取所有订阅套餐
router.get('/', (req, res) => {
  try {
    const plans = getAllPlans();
    
    // 格式化套餐数据
    const formattedPlans = Object.entries(plans).map(([id, plan]) => ({
      id,
      name: plan.name,
      displayName: plan.displayName,
      billingCycle: plan.billingCycle,
      price: plan.price,
      points: plan.points,
      modelQuota: plan.modelQuota,
      features: [
        `${plan.points} 积分（一次性）`,
        `${plan.modelQuota} 模型/月`,
        `每次任务消耗 10 积分`,
        plan.billingCycle === 'yearly' ? '年付优惠' : '按月付费',
      ],
    }));

    res.json({
      plans: formattedPlans,
    });
  } catch (error) {
    console.error('获取套餐列表失败:', error);
    res.status(500).json({ error: '获取套餐列表失败' });
  }
});

module.exports = router;


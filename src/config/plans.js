// 订阅套餐配置
const PLANS = {
  // 月付套餐
  basic_monthly: {
    name: 'Basic',
    billingCycle: 'monthly',
    price: 19,
    points: 50,
    modelQuota: 1,
    displayName: 'Basic 月付'
  },
  pro_monthly: {
    name: 'Pro',
    billingCycle: 'monthly',
    price: 49,
    points: 1000,
    modelQuota: 3,
    displayName: 'Pro 月付'
  },
  business_monthly: {
    name: 'Business',
    billingCycle: 'monthly',
    price: 99,
    points: 3000,
    modelQuota: 10,
    displayName: 'Business 月付'
  },
  enterprise_monthly: {
    name: 'Enterprise',
    billingCycle: 'monthly',
    price: 199,
    points: 10000,
    modelQuota: 50,
    displayName: 'Enterprise 月付'
  },
  
  // 年付套餐
  basic_yearly: {
    name: 'Basic',
    billingCycle: 'yearly',
    price: 99,
    points: 50,
    modelQuota: 1,
    displayName: 'Basic 年付'
  },
  pro_yearly: {
    name: 'Pro',
    billingCycle: 'yearly',
    price: 349,
    points: 1000,
    modelQuota: 3,
    displayName: 'Pro 年付'
  },
  business_yearly: {
    name: 'Business',
    billingCycle: 'yearly',
    price: 599,
    points: 3000,
    modelQuota: 10,
    displayName: 'Business 年付'
  },
  enterprise_yearly: {
    name: 'Enterprise',
    billingCycle: 'yearly',
    price: 1199,
    points: 10000,
    modelQuota: 50,
    displayName: 'Enterprise 年付'
  }
};

// 根据套餐 ID 获取套餐信息
function getPlan(planId) {
  return PLANS[planId];
}

// 获取所有套餐
function getAllPlans() {
  return PLANS;
}

module.exports = {
  PLANS,
  getPlan,
  getAllPlans
};


import React, { useState } from 'react';

const PricingAI = ({ user, onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'basic_monthly',
      name: 'Basic',
      price: 19,
      billing: 'month',
      points: 50,
      modelQuota: 1,
      features: ['50 积分', '1 模型/月', '基础支持'],
      popular: false
    },
    {
      id: 'pro_monthly',
      name: 'Pro',
      price: 49,
      billing: 'month',
      points: 1000,
      modelQuota: 3,
      features: ['1000 积分', '3 模型/月', '优先支持'],
      popular: true
    },
    {
      id: 'business_monthly',
      name: 'Business',
      price: 99,
      billing: 'month',
      points: 3000,
      modelQuota: 10,
      features: ['3000 积分', '10 模型/月', '企业支持'],
      popular: false
    },
    {
      id: 'enterprise_monthly',
      name: 'Enterprise',
      price: 199,
      billing: 'month',
      points: 10000,
      modelQuota: 50,
      features: ['10000 积分', '50 模型/月', '专属支持'],
      popular: false
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!user) {
      // 用户未登录，跳转到 Google 登录
      window.location.href = '/auth/google';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建支付会话失败');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('订阅失败:', error);
      alert('订阅失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            升级您的 AI 生图体验
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            选择适合您的套餐，解锁更多 AI 生图功能
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:max-w-none">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 bg-gray-800 border-2 rounded-2xl shadow-sm flex flex-col ${
                plan.popular
                  ? 'border-blue-500'
                  : 'border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex px-4 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-300">
                  <span className="text-5xl font-extrabold tracking-tight text-white">
                    ${plan.price}
                  </span>
                  <span className="text-xl font-semibold">/{plan.billing}</span>
                </p>
                <p className="mt-6 text-gray-300">
                  {plan.points} 积分 + {plan.modelQuota} 模型/月
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg
                        className="flex-shrink-0 w-6 h-6 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 border border-transparent rounded-md text-center text-sm font-medium text-white transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? '处理中...' : '立即订阅'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            所有套餐都包含 24/7 客户支持和 30 天退款保证
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingAI;

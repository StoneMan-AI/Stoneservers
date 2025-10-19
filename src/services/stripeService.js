const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getPlan } = require('../config/plans');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const StripeTransaction = require('../models/StripeTransaction');
const SubscriptionManager = require('./subscriptionManager');

class StripeService {
  // 创建支付会话
  static async createCheckoutSession(email, planId) {
    try {
      const plan = getPlan(planId);
      if (!plan) {
        throw new Error('无效的套餐 ID');
      }

      // 创建 Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan.displayName,
                description: `${plan.points}积分 + ${plan.modelQuota}模型/月`,
              },
              unit_amount: plan.price * 100, // 转换为美分
              recurring: {
                interval: plan.billingCycle === 'yearly' ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/ai-generator?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/#pricing`,
        metadata: {
          email,
          planId,
          planType: plan.name,
          billingCycle: plan.billingCycle,
          points: plan.points.toString(),
          modelQuota: plan.modelQuota.toString(),
        },
      });

      return session;
    } catch (error) {
      console.error('创建支付会话失败:', error);
      throw error;
    }
  }

  // 处理订阅成功（使用智能订阅管理器）
  static async handleSubscriptionCreated(stripeSubscription, metadata) {
    const { email, planId } = metadata;
    
    try {
      console.log('🔄 开始处理订阅创建:', { email, planId });
      
      // 使用智能订阅管理器处理订阅
      const result = await SubscriptionManager.handleNewSubscription(
        email,
        planId,
        stripeSubscription,
        metadata
      );

      console.log('✅ 订阅处理完成:', result);
      return result;
    } catch (error) {
      console.error('❌ 处理订阅创建失败:', error);
      throw error;
    }
  }

  // 处理订阅续费
  static async handleSubscriptionRenewed(stripeSubscription) {
    try {
      // 根据 Stripe 订阅 ID 查找订阅记录
      const subscription = await Subscription.findByStripeId(stripeSubscription.id);
      
      if (!subscription) {
        console.error('❌ 找不到订阅记录:', stripeSubscription.id);
        return false;
      }

      const { email, model_quota_awarded } = subscription;
      
      // 续费：只发放模型配额，不发放积分
      const user = await User.findByEmail(email);
      
      // 更新订阅到期时间和模型配额（替换，不累加）
      const endDate = new Date(stripeSubscription.current_period_end * 1000);
      await User.updateSubscription(email, {
        status: 'active',
        expiry: endDate,
        points: user.points, // 保持不变
        modelQuota: model_quota_awarded, // 重置为套餐数量
      });

      console.log('✅ 订阅续费成功:', email);
      return true;
    } catch (error) {
      console.error('❌ 处理订阅续费失败:', error);
      throw error;
    }
  }

  // 处理订阅升级/降级
  static async handleSubscriptionUpdated(stripeSubscription, metadata) {
    const { email, planType, billingCycle, points, modelQuota } = metadata;
    
    try {
      const user = await User.findByEmail(email);
      const oldSubscription = await Subscription.getActiveSubscription(email);

      if (!oldSubscription) {
        // 如果没有旧订阅，当作新订阅处理
        return await this.handleSubscriptionCreated(stripeSubscription, metadata);
      }

      // 升级/降级逻辑
      const endDate = new Date(stripeSubscription.current_period_end * 1000);
      
      // 积分：累加新套餐的积分
      const newPoints = user.points + parseInt(points);
      
      // 模型配额：替换为新套餐的配额（不累加）
      const newModelQuota = parseInt(modelQuota);

      // 更新用户
      await User.updateSubscription(email, {
        status: 'active',
        expiry: endDate,
        points: newPoints,
        modelQuota: newModelQuota,
      });

      // 标记旧订阅为取消
      await Subscription.updateStatus(oldSubscription.id, 'cancelled');

      // 创建新订阅记录
      const startDate = new Date(stripeSubscription.current_period_start * 1000);
      await Subscription.create({
        email,
        planType,
        billingCycle,
        price: stripeSubscription.plan.amount / 100,
        pointsAwarded: parseInt(points),
        modelQuotaAwarded: parseInt(modelQuota),
        startDate,
        endDate,
        stripeSubscriptionId: stripeSubscription.id,
      });

      console.log('✅ 订阅更新成功:', email, planType);
      return true;
    } catch (error) {
      console.error('❌ 处理订阅更新失败:', error);
      throw error;
    }
  }

  // 处理订阅取消
  static async handleSubscriptionCancelled(stripeSubscription) {
    try {
      const subscription = await Subscription.findByStripeId(stripeSubscription.id);
      
      if (!subscription) {
        console.error('❌ 找不到订阅记录:', stripeSubscription.id);
        return false;
      }

      const { email } = subscription;

      // 取消订阅：清空所有权益
      await User.clearBenefits(email);
      await Subscription.cancel(email);

      console.log('✅ 订阅已取消:', email);
      return true;
    } catch (error) {
      console.error('❌ 处理订阅取消失败:', error);
      throw error;
    }
  }

  // 取消 Stripe 订阅
  static async cancelSubscription(stripeSubscriptionId) {
    try {
      const subscription = await stripe.subscriptions.cancel(stripeSubscriptionId);
      return subscription;
    } catch (error) {
      console.error('❌ 取消 Stripe 订阅失败:', error);
      throw error;
    }
  }
}

module.exports = StripeService;


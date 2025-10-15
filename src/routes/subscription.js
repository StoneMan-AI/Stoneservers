const express = require('express');
const StripeService = require('../services/stripeService');
const Subscription = require('../models/Subscription');
const StripeTransaction = require('../models/StripeTransaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// 中间件：检查用户是否登录
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: '请先登录' });
  }
  next();
};

// 创建支付会话
router.post('/create-checkout', requireAuth, async (req, res) => {
  try {
    const { planId } = req.body;
    const email = req.user.email;

    if (!planId) {
      return res.status(400).json({ error: '请选择订阅套餐' });
    }

    const session = await StripeService.createCheckoutSession(email, planId);
    
    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('创建支付会话失败:', error);
    res.status(500).json({ error: '创建支付会话失败' });
  }
});

// Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // 验证 Webhook 签名
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook 签名验证失败:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📨 收到 Webhook 事件:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // 支付成功
        const session = event.data.object;
        const { email, planType, billingCycle, points, modelQuota } = session.metadata;

        // 检查幂等性
        const isProcessed = await StripeTransaction.isProcessed(session.id, event.type);
        if (isProcessed) {
          console.log('⚠️ 事件已处理，跳过:', session.id);
          return res.json({ received: true });
        }

        // 获取订阅信息
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        // 处理订阅创建
        await StripeService.handleSubscriptionCreated(subscription, session.metadata);

        // 记录交易流水
        await StripeTransaction.create({
          email,
          stripeSessionId: session.id,
          eventType: event.type,
          amount: session.amount_total,
          currency: session.currency,
        });

        console.log('✅ Checkout 完成:', email);
        break;
      }

      case 'invoice.paid': {
        // 订阅续费
        const invoice = event.data.object;
        
        if (invoice.billing_reason === 'subscription_cycle') {
          // 这是续费
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          await StripeService.handleSubscriptionRenewed(subscription);
          console.log('✅ 订阅续费完成');
        }
        break;
      }

      case 'customer.subscription.updated': {
        // 订阅更新（升级/降级）
        const subscription = event.data.object;
        
        // 检查是否有 metadata（升级/降级时会有）
        if (subscription.metadata && subscription.metadata.email) {
          await StripeService.handleSubscriptionUpdated(subscription, subscription.metadata);
          console.log('✅ 订阅更新完成');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // 订阅取消
        const subscription = event.data.object;
        await StripeService.handleSubscriptionCancelled(subscription);
        console.log('✅ 订阅取消完成');
        break;
      }

      default:
        console.log(`⚠️ 未处理的事件类型: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook 处理失败:', error);
    res.status(500).json({ error: 'Webhook 处理失败' });
  }
});

// 获取订阅状态
router.get('/status', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const subscription = await Subscription.getActiveSubscription(email);
    
    res.json({
      hasSubscription: !!subscription,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('获取订阅状态失败:', error);
    res.status(500).json({ error: '获取订阅状态失败' });
  }
});

// 获取订阅历史
router.get('/history', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const subscriptions = await Subscription.getAllSubscriptions(email);
    
    res.json({
      subscriptions,
    });
  } catch (error) {
    console.error('获取订阅历史失败:', error);
    res.status(500).json({ error: '获取订阅历史失败' });
  }
});

// 取消订阅
router.post('/cancel', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const subscription = await Subscription.getActiveSubscription(email);
    
    if (!subscription) {
      return res.status(404).json({ error: '没有活跃的订阅' });
    }

    // 取消 Stripe 订阅
    await StripeService.cancelSubscription(subscription.stripe_subscription_id);
    
    res.json({
      message: '订阅已取消',
    });
  } catch (error) {
    console.error('取消订阅失败:', error);
    res.status(500).json({ error: '取消订阅失败' });
  }
});

module.exports = router;


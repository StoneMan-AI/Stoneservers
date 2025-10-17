// 调试认证问题的脚本
// 在浏览器控制台中运行

async function debugAuth() {
  console.log('🔍 开始调试认证问题...');
  
  try {
    // 1. 检查登录状态
    console.log('📋 步骤 1: 检查登录状态');
    const authResponse = await fetch('/auth/user', {
      credentials: 'include'
    });
    
    console.log('登录状态响应:', {
      status: authResponse.status,
      ok: authResponse.ok,
      statusText: authResponse.statusText
    });
    
    if (authResponse.ok) {
      const userData = await authResponse.json();
      console.log('✅ 用户已登录:', userData);
      
      // 2. 测试支付会话创建
      console.log('📋 步骤 2: 测试支付会话创建');
      const paymentResponse = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: 'basic_monthly' }),
        credentials: 'include'
      });
      
      console.log('支付会话响应:', {
        status: paymentResponse.status,
        ok: paymentResponse.ok,
        statusText: paymentResponse.statusText
      });
      
      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        console.log('✅ 支付会话创建成功:', paymentData);
      } else {
        const errorData = await paymentResponse.json();
        console.log('❌ 支付会话创建失败:', errorData);
      }
    } else {
      const errorData = await authResponse.json();
      console.log('❌ 用户未登录:', errorData);
    }
    
  } catch (error) {
    console.error('❌ 调试过程中出错:', error);
  }
}

// 运行调试
debugAuth();

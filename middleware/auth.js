// 认证中间件 - 保护需要登录的页面
export function requireAuth(handler) {
  return async (req, res) => {
    try {
      // 检查用户是否已登录
      const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/auth/user`, {
        headers: {
          cookie: req.headers.cookie
        }
      })
      
      if (!response.ok) {
        // 用户未登录，重定向到首页
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
      
      const user = await response.json()
      
      // 检查订阅状态
      const hasActiveSubscription = user.subscription_status === 'active' && 
        (user.subscription_expiry === null || new Date(user.subscription_expiry) > new Date())
      
      if (!hasActiveSubscription) {
        // 用户未订阅，重定向到首页并定位到 Pricing 模块
        return {
          redirect: {
            destination: '/#pricing',
            permanent: false
          }
        }
      }
      
      // 用户已登录且已订阅，继续处理请求
      return handler(req, res)
    } catch (error) {
      console.error('认证检查失败:', error)
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
  }
}

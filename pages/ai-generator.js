import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AIGenerator() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 处理订阅函数
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
  }

  useEffect(() => {
    // 检查 URL 参数，看是否是支付成功后的跳转
    const { payment, session_id } = router.query
    
    if (payment === 'success' && session_id) {
      setShowSuccessMessage(true)
      // 3秒后隐藏成功消息
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }

    // 检查用户登录状态和订阅状态
    const checkAuthAndSubscription = async () => {
      try {
        const response = await fetch('/auth/user', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          // 用户未登录，跳转到首页
          router.push('/')
          return
        }
        
        const userData = await response.json()
        setUser(userData)
        
        console.log('🔍 AI Generator 页面 - 用户信息:', {
          email: userData.email,
          subscriptionStatus: userData.subscriptionStatus,
          subscriptionExpiry: userData.subscriptionExpiry,
          points: userData.points,
          modelQuota: userData.modelQuota
        })
        
        // 检查订阅状态
        const hasActiveSubscription = userData.subscriptionStatus === 'active' && 
          (userData.subscriptionExpiry === null || new Date(userData.subscriptionExpiry) > new Date())
        
        console.log('🔍 AI Generator 页面 - 订阅状态检查:', {
          hasActiveSubscription: hasActiveSubscription,
          subscriptionStatus: userData.subscriptionStatus,
          subscriptionExpiry: userData.subscriptionExpiry,
          currentTime: new Date().toISOString()
        })
        
        // 用户已登录，显示页面（不管是否订阅）
        setIsChecking(false)
      } catch (error) {
        console.error('检查认证状态失败:', error)
        // 出错时跳转到首页
        router.push('/')
      }
    }

    checkAuthAndSubscription()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#111'}}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>检查访问权限...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>AI 生图 - PHOTO AI™</title>
        <meta name="description" content="AI 生图工具" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen text-white" style={{backgroundColor: '#111'}}>
        <header className="p-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI 生图工具</h1>
            <button 
              onClick={() => window.location.href = '/auth/logout'}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* 支付成功提示 */}
            {showSuccessMessage && (
              <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">支付成功！欢迎使用 AI 生图工具</span>
                </div>
              </div>
            )}
            
            <h2 className="text-3xl font-bold mb-8">AI 生图模板页面</h2>
            <p className="text-gray-300 mb-8">
              欢迎使用 AI 生图工具！这里将是您的 AI 生图功能页面。
            </p>
            
            {/* AI 生图功能区域 */}
            <div className="bg-gray-800 rounded-lg p-8 text-center mb-12">
              <h3 className="text-xl font-semibold mb-4">AI 生图功能</h3>
              <p className="text-gray-400 mb-6">
                此页面正在开发中，将包含完整的 AI 生图功能。
              </p>
              
              {/* 用户订阅信息 */}
              {user && (
                <div className="bg-gray-700 rounded-lg p-6 mb-8">
                  <h4 className="text-lg font-semibold mb-4">您的订阅信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">邮箱:</span>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">积分:</span>
                      <p className="text-white">{user.points || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">模型配额:</span>
                      <p className="text-white">{user.modelQuota || 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing 组件 - 完整代码 */}
            <div className="py-16 bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    {user && user.subscriptionStatus === 'active' ? '升级您的 AI 生图体验' : '选择您的 AI 生图套餐'}
                  </h2>
                  <p className="mt-4 text-xl text-gray-300">
                    {user && user.subscriptionStatus === 'active' 
                      ? '升级到更高级别的套餐，获得更多积分和功能' 
                      : '选择适合您的套餐，解锁更多 AI 生图功能'
                    }
                  </p>
                </div>

                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:max-w-none">
                  {/* Basic 套餐 */}
                  <div className="relative p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-sm flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">Basic</h3>
                      <p className="mt-4 flex items-baseline text-gray-300">
                        <span className="text-5xl font-extrabold tracking-tight text-white">
                          $19
                        </span>
                        <span className="text-xl font-semibold">/month</span>
                      </p>
                      <p className="mt-6 text-gray-300">
                        50 积分 + 1 模型/月
                      </p>

                      <ul className="mt-6 space-y-4">
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">50 积分</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">1 模型/月</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">基础支持</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => handleSubscribe('basic_monthly')}
                        disabled={isLoading}
                        className={`w-full py-3 px-6 border border-transparent rounded-md text-center text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? '处理中...' : '立即订阅'}
                      </button>
                    </div>
                  </div>

                  {/* Pro 套餐 */}
                  <div className="relative p-8 bg-gray-800 border-2 border-blue-500 rounded-2xl shadow-sm flex flex-col">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="inline-flex px-4 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                        最受欢迎
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">Pro</h3>
                      <p className="mt-4 flex items-baseline text-gray-300">
                        <span className="text-5xl font-extrabold tracking-tight text-white">
                          $49
                        </span>
                        <span className="text-xl font-semibold">/month</span>
                      </p>
                      <p className="mt-6 text-gray-300">
                        1000 积分 + 3 模型/月
                      </p>

                      <ul className="mt-6 space-y-4">
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">1000 积分</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">3 模型/月</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">优先支持</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => handleSubscribe('pro_monthly')}
                        disabled={isLoading}
                        className={`w-full py-3 px-6 border border-transparent rounded-md text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? '处理中...' : '立即订阅'}
                      </button>
                    </div>
                  </div>

                  {/* Business 套餐 */}
                  <div className="relative p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-sm flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">Business</h3>
                      <p className="mt-4 flex items-baseline text-gray-300">
                        <span className="text-5xl font-extrabold tracking-tight text-white">
                          $99
                        </span>
                        <span className="text-xl font-semibold">/month</span>
                      </p>
                      <p className="mt-6 text-gray-300">
                        3000 积分 + 10 模型/月
                      </p>

                      <ul className="mt-6 space-y-4">
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">3000 积分</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">10 模型/月</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">企业支持</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => handleSubscribe('business_monthly')}
                        disabled={isLoading}
                        className={`w-full py-3 px-6 border border-transparent rounded-md text-center text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? '处理中...' : '立即订阅'}
                      </button>
                    </div>
                  </div>

                  {/* Enterprise 套餐 */}
                  <div className="relative p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-sm flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">Enterprise</h3>
                      <p className="mt-4 flex items-baseline text-gray-300">
                        <span className="text-5xl font-extrabold tracking-tight text-white">
                          $199
                        </span>
                        <span className="text-xl font-semibold">/month</span>
                      </p>
                      <p className="mt-6 text-gray-300">
                        10000 积分 + 50 模型/月
                      </p>

                      <ul className="mt-6 space-y-4">
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">10000 积分</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">50 模型/月</span>
                        </li>
                        <li className="flex">
                          <svg className="flex-shrink-0 w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-300">专属支持</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => handleSubscribe('enterprise_monthly')}
                        disabled={isLoading}
                        className={`w-full py-3 px-6 border border-transparent rounded-md text-center text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? '处理中...' : '立即订阅'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-gray-400 text-sm">
                    所有套餐都包含 24/7 客户支持和 30 天退款保证
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

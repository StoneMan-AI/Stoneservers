import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PricingAI from '../component-library/sections/PricingAI'

export default function AIGenerator() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [user, setUser] = useState(null)

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
        
        if (!hasActiveSubscription) {
          // 用户未订阅，跳转到首页并定位到 Pricing 模块
          router.push('/#pricing')
          return
        }
        
        // 用户已登录且已订阅，显示页面
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

            {/* Pricing 组件 */}
            <PricingAI user={user} onSubscribe={(planId) => console.log('订阅计划:', planId)} />
          </div>
        </main>
      </div>
    </>
  )
}

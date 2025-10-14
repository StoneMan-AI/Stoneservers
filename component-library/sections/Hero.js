// Hero 组件 - 首页横幅
// 使用方式：复制此组件代码到页面文件中，并传入必要的props

export default function Hero({ user, setUser, isLoading, setIsLoading }) {
  // 检查用户登录状态
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/auth/check', {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.authenticated) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [setUser, setIsLoading])

  return (
    <section className="relative pt-16 min-h-screen flex items-center">
      <div className="absolute inset-0" style={{backgroundColor: '#111'}}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Award Badge */}
          <div className="flex items-center justify-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-full w-fit mx-auto">
            <span className="text-yellow-400">🏆</span>
            <span className="text-yellow-400">#1 AI Photographer</span>
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl font-bold leading-tight">
            Fire your photographer 🔥
          </h1>
          
          {/* Feature List */}
          <div className="max-w-4xl mx-auto space-y-4 text-lg">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">✏️</span>
              <span>Upload your selfies → Create an AI model of yourself</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🤔</span>
              <span>...or create a 100% AI influencer to monetize</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">📷</span>
              <span>Then take AI photos with your AI model in any pose, place or action</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🎬</span>
              <span>And create AI videos starring your AI model as the main character</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">❤️</span>
              <span>Run 100s of photo packs like Tinder or Instagram</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🎁</span>
              <span>Create product videos and try on clothes with your AI model</span>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-medium">
              🎃 Now with free Halloween photos!
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-black max-w-md w-full">
              <div className="space-y-4">
                <p className="text-gray-500 text-sm text-center">* 733,446 photos generated this month</p>
                
                {isLoading ? (
                  <div className="w-full bg-gray-200 py-3 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">检查登录状态...</span>
                  </div>
                ) : user ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">欢迎回来</p>
                      <p className="font-medium">{user.email}</p>
                      {user.subscriptionStatus && (
                        <p className="text-xs text-green-600">已订阅: {user.subscriptionStatus}</p>
                      )}
                    </div>
                    <a 
                      href="/dashboard.html" 
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      进入控制面板
                    </a>
                    <a 
                      href="/auth/logout" 
                      className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center text-sm"
                    >
                      退出登录
                    </a>
                  </div>
                ) : (
                  <a 
                    href="/auth/google" 
                    className="w-full bg-white border border-gray-300 text-black py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </a>
                )}
                
                {!user && !isLoading && (
                  <p className="text-gray-500 text-sm text-center">If you already have an account, we'll log you in</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

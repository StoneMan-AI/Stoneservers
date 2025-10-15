import Head from 'next/head'
import { useState, useEffect } from 'react'

// Header 组件 - 导航栏
function Header() {
  return (
    <header 
      className="fixed top-0 w-full z-50 backdrop-blur-sm" 
      style={{backgroundColor: 'rgba(17, 17, 17, 0.9)'}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold">PHOTO AI</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#pricing" className="hover:text-gray-300">Pricing</a>
            <a href="#faq" className="hover:text-gray-300">FAQ</a>
            <a href="#" className="hover:text-gray-300">Log in</a>
            <a href="#" className="hover:text-gray-300">Billing</a>
            <a href="#" className="hover:text-gray-300">Gallery</a>
            <a href="#" className="hover:text-gray-300">Ideas</a>
          </nav>
          
          {/* CTA Button */}
          <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Take photos like these →
          </button>
        </div>
      </div>
    </header>
  )
}

// Hero 组件 - 首页横幅
function Hero({ user, setUser, isLoading, setIsLoading }) {
  // 检查用户登录状态
  useEffect(() => {
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 to-red-900/30"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Halloween Badge */}
          <div className="flex items-center justify-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-full w-fit mx-auto">
            <span className="text-orange-400">🎃</span>
            <span className="text-orange-400">Halloween Special</span>
            <span className="text-orange-400">FREE</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl font-bold leading-tight">
            🎃 Halloween Photo Pack
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            Transform yourself into spooky, mysterious, and creative Halloween characters! 
            Get 20+ unique Halloween photos featuring you in amazing costumes.
          </p>
          
          {/* Features */}
          <div className="max-w-4xl mx-auto space-y-4 text-lg">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">👻</span>
              <span>20+ Halloween costume photos</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🧙‍♀️</span>
              <span>Witch, Devil, Angel, and more characters</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🎭</span>
              <span>Professional quality with spooky atmosphere</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🎁</span>
              <span>FREE for new subscribers!</span>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl text-xl font-bold">
              🎃 Get Your Halloween Photos Now - FREE!
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

// Halloween 照片展示组件
function HalloweenGallery() {
  const halloweenPhotos = [
    { id: 1, type: 'Witch', colors: 'from-purple-500 to-black' },
    { id: 2, type: 'Devil', colors: 'from-red-500 to-red-700' },
    { id: 3, type: 'Angel', colors: 'from-white to-gray-200' },
    { id: 4, type: 'Vampire', colors: 'from-red-600 to-black' },
    { id: 5, type: 'Zombie', colors: 'from-green-600 to-gray-800' },
    { id: 6, type: 'Ghost', colors: 'from-gray-300 to-white' },
    { id: 7, type: 'Skeleton', colors: 'from-gray-200 to-gray-400' },
    { id: 8, type: 'Pumpkin', colors: 'from-orange-500 to-red-500' },
    { id: 9, type: 'Frankenstein', colors: 'from-green-500 to-gray-700' },
    { id: 10, type: 'Werewolf', colors: 'from-gray-600 to-gray-900' },
    { id: 11, type: 'Mummy', colors: 'from-yellow-200 to-yellow-400' },
    { id: 12, type: 'Demon', colors: 'from-red-700 to-black' }
  ]

  return (
    <section className="py-20" style={{backgroundColor: '#111'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🎃 Halloween Photo Gallery
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            See what amazing Halloween photos you can create with Photo AI
          </p>
          <div className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full w-fit mx-auto">
            ✨ 20+ Unique Halloween Characters
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {halloweenPhotos.map((photo) => (
            <div key={photo.id} className="group cursor-pointer">
              <div className={`aspect-square bg-gradient-to-br ${photo.colors} rounded-2xl mb-4 relative overflow-hidden transition-transform group-hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20"></div>
                <div className="absolute bottom-2 left-2 right-2 h-8 bg-orange-500 rounded opacity-80"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg opacity-80">🎃</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-center group-hover:text-orange-400 transition-colors">
                {photo.type} Costume
              </h3>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">
            All these photos will be generated featuring YOU in the costumes!
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:opacity-90 transition-opacity">
            🎃 Start Creating My Halloween Photos
          </button>
        </div>
      </div>
    </section>
  )
}

// Comparison 组件 - 产品对比
function Comparison() {
  return (
    <section className="py-20" style={{backgroundColor: '#111'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            How does Photo AI compare to other AI image generators?
          </h2>
          <p className="text-xl text-gray-300">
            With the same uploaded selfies, Photo AI performs far better than competitors in photorealism and resemblance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Midjourney */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/30"></div>
              <div className="absolute bottom-4 left-4 right-4 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-80"></div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Midjourney (2025)</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Cannot train people</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Inconsistent character</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Medium photorealism</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>High resolution</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Maintains ethnicity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Clear and sharp</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Zoom out of photos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>No video support</span>
              </div>
            </div>
          </div>

          {/* Photo AI - Highlighted */}
          <div className="bg-gray-800 rounded-2xl p-6 border-2 border-orange-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
              BEST
            </div>
            <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30"></div>
              <div className="absolute bottom-4 left-4 right-4 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg opacity-80"></div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Photo AI™ (2025)</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Train real people</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Consistent character</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>High photorealism</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>High resolution</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Maintains ethnicity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Clear and sharp</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Zoom out of photos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Create videos</span>
              </div>
            </div>
          </div>

          {/* ChatGPT */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-500 rounded-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/30 to-gray-700/30"></div>
              <div className="absolute bottom-4 left-4 right-4 h-16 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg opacity-80"></div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4">ChatGPT (2025)</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Cannot train people</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Inconsistent character</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Low photorealism</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Low resolution</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Maintains ethnicity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Clear and sharp</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>No zoom out support</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>No video support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Pricing 组件 - 价格方案
function Pricing({ handleSubscribe }) {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 19,
      yearlyPrice: 99,
      description: 'Get started with basic AI photos, create your first model, and begin your AI photography journey',
      features: [
        'Get 50 AI Credits',
        'Create 1 AI Model per month',
        'Flux™ model'
      ],
      limitations: [
        'Low quality photos',
        'Low likeness',
        'Take 1 photo at a time',
        'Slow processing',
        'For personal use only',
        'No free auto-generated photos'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 49,
      yearlyPrice: 349,
      description: 'Boost your creativity with higher quality photos, parallel processing, and commercial usage rights',
      features: [
        'Get 1,000 AI Credits',
        'Create 3 AI Models per month',
        'Flux™ model'
      ],
      additionalFeatures: [
        'Medium quality photos',
        'Medium likeness',
        'Take up to 4 photos in parallel',
        'Import photos',
        'Write your own prompts',
        'Remix any photo',
        'Commercial use license'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      monthlyPrice: 99,
      yearlyPrice: 599,
      description: 'Get more photos, more models, more features, and higher quality photos with our most popular plan',
      isPopular: true,
      features: [
        'Get 3,000 AI Credits',
        'Create 10 AI Models per month',
        'Hyper Realism™ 🔥'
      ],
      additionalFeatures: [
        'High quality photos',
        'High likeness',
        'Take up to 8 photos in parallel',
        'Edit photos',
        'Crop photos',
        'Zoom out photos',
        'Shoot AI videos',
        'Use LoRas from Civitai',
        'Relight photos',
        'Combine photos',
        'Use the magic upscaler',
        'Try on clothes (for Shopify)',
        'Early access to new features'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 199,
      yearlyPrice: 1199,
      description: 'Get our highest level of access with ultra-fast processing and enterprise-level performance',
      features: [
        'Get 10,000 AI Credits',
        'Create 50 AI Models per month',
        'Hyper Realism™ 🔥'
      ],
      additionalFeatures: [
        'Ultra quality photos',
        'Ultra-high likeness',
        'Take up to 16 photos in parallel',
        'Unlimited photo storage',
        'Priority: faster response times',
        'Export your models'
      ]
    }
  ]

  return (
    <section id="pricing" className="py-20" style={{backgroundColor: '#111'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8">Pricing</h2>
          <div className="flex items-center justify-center space-x-4 mb-12">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                !isYearly ? 'bg-orange-500 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                isYearly ? 'bg-orange-500 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              🔥 Yearly: get 6+ months free
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-gray-800 rounded-2xl p-6 ${plan.isPopular ? 'relative' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="text-4xl font-bold mb-2">
                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              </div>
              <p className="text-gray-400 mb-6">per month</p>
              <p className="text-gray-300 mb-6">{plan.description}</p>
              
              <button 
                onClick={() => handleSubscribe(isYearly ? `${plan.id}_yearly` : `${plan.id}_monthly`)}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mb-4"
              >
                Subscribe →
              </button>
              <p className="text-gray-400 text-sm mb-6">Save with yearly (6+ months free) →</p>
              
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm">
                {plan.limitations ? (
                  <>
                    <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded">Low quality photos</div>
                    {plan.limitations.slice(1).map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-red-500">✗</span>
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-gray-300 font-medium mb-2">
                      -- All {plan.id === 'pro' ? 'Starter' : plan.id === 'business' ? 'Pro' : 'Premium'} features, plus:
                    </div>
                    <div className={`px-2 py-1 rounded ${
                      plan.id === 'pro' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {plan.id === 'pro' ? 'Medium' : plan.id === 'business' ? 'High' : 'Ultra'} quality photos
                    </div>
                    {plan.additionalFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer 组件 - 页脚
function Footer() {
  return (
    <>
      <footer className="py-16" style={{backgroundColor: '#111'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* PHOTO AI™ */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold">PHOTO AI™</span>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Photo AI™ is a registered trademark.</p>
                <p>Formerly known as Avatar AI.</p>
                <p>©2025. Terms of Service and Privacy Policy.</p>
              </div>
            </div>

            {/* Shot with Photo AI™ */}
            <div className="space-y-4">
              <h3 className="font-bold">Shot with Photo AI™</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>Halloween</div>
                <div>Diwali</div>
                <div>Tinder</div>
                <div>Instagram</div>
                <div>LinkedIn Headshots</div>
                <div>Startup Founder Headshots</div>
                <div>AI Dating</div>
                <div>CEO Headshots</div>
                <div>AI Photography</div>
                <div>Luxury Lifestyle</div>
                <div>Hinge</div>
                <div>Extreme Close-Ups</div>
                <div>Badoo</div>
                <div>A night in Las Vegas</div>
                <div>AI Art Generator</div>
                <div>Podcast Host Studio</div>
                <div>Mobster</div>
                <div>Cheerleader</div>
                <div>Actor headshots</div>
                <div>Comedian headshots</div>
                <div>1950s Film Noir</div>
                <div>Retro 60s</div>
              </div>
            </div>

            {/* Pages */}
            <div className="space-y-4">
              <h3 className="font-bold">Pages</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Free AI Photo Generator</div>
                <div>Photo Shoot Ideas</div>
                <div>Gallery</div>
                <div>Sign up or Log in</div>
                <div>FAQ</div>
                <div>Billing</div>
                <div>Legal</div>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-4">
              <h3 className="font-bold">FAQ</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Generate AI photos and vi...</div>
                <div>Turn images into stunning ...</div>
                <div>Uncrop & expand images ...</div>
                <div>How to create AI Thumbna...</div>
                <div>Generate a 3D model from...</div>
                <div>Upscale your AI photos an...</div>
                <div>Batch Try On Clothes with ...</div>
                <div>Batch img2img with Photo ...</div>
                <div>Generate virtual try ons on...</div>
                <div>How to make AI influencer...</div>
                <div>How to create talking AI vi...</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Trust Badges */}
      <div className="py-8 border-t border-gray-800" style={{backgroundColor: '#111'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm mb-6">as seen on / and used by</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-bold">The New York Times</div>
            <div className="text-gray-400 font-bold">shopify</div>
            <div className="text-gray-400 font-bold">TE TechCrunch</div>
            <div className="text-gray-400 font-bold">msn</div>
            <div className="text-gray-400 font-bold">yahoo! news</div>
            <div className="text-gray-400 font-bold">Google</div>
            <div className="text-gray-400 font-bold">intel</div>
            <div className="text-gray-400 font-bold">pwc</div>
            <div className="text-gray-400 font-bold">Stanford University</div>
            <div className="text-gray-400 font-bold">Massachusetts Institute of Technology</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function HalloweenPage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 处理订阅
  const handleSubscribe = async (planId) => {
    if (!user) {
      alert('请先登录')
      return
    }

    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (response.ok) {
        // 重定向到 Stripe Checkout
        window.location.href = data.url
      } else {
        alert(data.error || '创建支付会话失败')
      }
    } catch (error) {
      console.error('订阅失败:', error)
      alert('订阅失败，请稍后重试')
    }
  }

  return (
    <>
      <Head>
        <title>🎃 Halloween Photo Pack - FREE AI Halloween Photos | Photo AI</title>
        <meta name="description" content="Create amazing Halloween photos with AI! Get 20+ spooky costume photos featuring you as witch, devil, angel, and more. FREE for new subscribers!" />
        <meta name="keywords" content="Halloween photos, AI photos, costume photos, witch photos, devil photos, angel photos, free Halloween photos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen text-white" style={{backgroundColor: '#111'}}>
        <Header />
        <main>
          <Hero user={user} setUser={setUser} isLoading={isLoading} setIsLoading={setIsLoading} />
          <HalloweenGallery />
          <Comparison />
          <Pricing handleSubscribe={handleSubscribe} />
        </main>
        <Footer />
      </div>
    </>
  )
}

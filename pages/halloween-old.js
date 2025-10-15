import Layout from '../components/layout/Layout'
import Hero from '../components/sections/Hero'
import Comparison from '../components/sections/Comparison'
import Pricing from '../components/sections/Pricing'
import { commonStyles } from '../styles/theme'
import { useState } from 'react'

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
    <section className={commonStyles.section} style={{backgroundColor: '#111'}}>
      <div className={commonStyles.container}>
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
    <Layout 
      title="🎃 Halloween Photo Pack - FREE AI Halloween Photos | Photo AI"
      description="Create amazing Halloween photos with AI! Get 20+ spooky costume photos featuring you as witch, devil, angel, and more. FREE for new subscribers!"
    >
      <Hero user={user} setUser={setUser} isLoading={isLoading} setIsLoading={setIsLoading} />
      <HalloweenGallery />
      <Comparison />
      <Pricing handleSubscribe={handleSubscribe} />
    </Layout>
  )
}

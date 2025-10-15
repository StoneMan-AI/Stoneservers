import Layout from '../components/layout/Layout'
import Hero from '../components/sections/Hero'
import Comparison from '../components/sections/Comparison'
import HalloweenSpecial from '../components/sections/HalloweenSpecial'
import Testimonials from '../components/sections/Testimonials'
import PhotoPacks from '../components/sections/PhotoPacks'
import Pricing from '../components/sections/Pricing'
import { useState } from 'react'

export default function Home() {
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
    <Layout>
      <Hero user={user} setUser={setUser} isLoading={isLoading} setIsLoading={setIsLoading} />
      <Comparison />
      <HalloweenSpecial />
      <Testimonials />
      <PhotoPacks />
      <Pricing handleSubscribe={handleSubscribe} />
    </Layout>
  )
}

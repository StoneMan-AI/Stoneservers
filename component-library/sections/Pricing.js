// Pricing 组件 - 价格方案
// 使用方式：复制此组件代码到页面文件中，并传入handleSubscribe函数

export default function Pricing({ handleSubscribe }) {
  const [isYearly, setIsYearly] = React.useState(false)

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

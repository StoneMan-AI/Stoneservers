// Testimonials 组件 - 用户评价
// 使用方式：复制此组件代码到页面文件中

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Everaldo',
      rating: 5,
      text: "Photo AI is just fantastic! I take amazing photos of my wife, family and friends. As a photographer I use it to test ideas before creating a real photoshoot. I strongly recommend!"
    },
    {
      id: 2,
      name: 'Iryna',
      rating: 5,
      text: "Cool AI tool for image generation! I could create a lot of truly amazing pictures in different locations with different outfits! All my friends were surprised and loved my pictures!"
    },
    {
      id: 3,
      name: 'Jordan',
      rating: 4,
      text: "Good input = good output. Very fun! Took me some effort to get the models to feel accurate but once I got the right input it was amazing. Photo AI was very responsive to my questions."
    }
  ]

  return (
    <section className="py-20" style={{backgroundColor: '#111'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">
          Customers can't stop raving about the photos they took
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white text-black rounded-2xl p-6 border border-orange-200">
              <div className="flex text-yellow-400 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? '' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <p className="mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{testimonial.name}</span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <span>✓</span>
                  <span className="text-sm">VERIFIED PURCHASE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

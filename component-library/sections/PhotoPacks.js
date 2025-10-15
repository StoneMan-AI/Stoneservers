// PhotoPacks 组件 - 照片包展示
// 使用方式：复制此组件代码到页面文件中

export default function PhotoPacks() {
  const photoPacks = [
    {
      id: 'halloween',
      title: '🎃 Halloween',
      description: 'Get into the spooky spirit with fun and festive Halloween costumes! Transform yourself into playful, mysterious, and creative characters that capture the excitement of Halloween with a dash of fright',
      photos: 20,
      runs: 13,
      colors: ['from-orange-500 to-red-500', 'from-purple-500 to-pink-500']
    },
    {
      id: 'diwali',
      title: '🪔 Diwali',
      description: 'Celebrate the Festival of Lights with a vibrant and festive Diwali-themed photo shoot! Capture the joy and warmth of this special occasion with traditional outfits, beautiful rangoli, and glowing diyas',
      photos: 20,
      runs: 3,
      colors: ['from-yellow-500 to-orange-500', 'from-red-500 to-pink-500']
    },
    {
      id: 'tinder',
      title: '🔥 Tinder',
      description: 'Look your best while staying true to who you are. Take photos with a variety of poses, playful expressions, and vibrant colors to make your dating profile stand out. Attract more matches on apps like Tinder, Bumble, and Hinge by showcasing your unique personality and style, helping you create a more engaging and appealing profile',
      photos: 29,
      runs: 40,
      colors: ['from-pink-500 to-red-500', 'from-blue-500 to-purple-500']
    },
    {
      id: 'instagram',
      title: '✨ Instagram',
      description: 'Take engaging and visually stunning photos that feature you as an Instagram influencer. Boost your confidence, likes and followers with captivating images that reflect your unique style and charisma',
      photos: 36,
      runs: 33,
      colors: ['from-pink-500 to-purple-500', 'from-blue-500 to-cyan-500']
    },
    {
      id: 'linkedin',
      title: '💼 LinkedIn',
      description: 'Professional headshots that make a lasting impression. Perfect for LinkedIn profiles, business cards, and corporate websites. Show your professional side with confidence and authority',
      photos: 25,
      runs: 28,
      colors: ['from-blue-600 to-blue-800', 'from-gray-600 to-gray-800']
    },
    {
      id: 'business',
      title: '🏢 Business',
      description: 'Executive and business professional photos. Ideal for CEOs, entrepreneurs, and business leaders. Convey trust, competence, and leadership through professional imagery',
      photos: 30,
      runs: 15,
      colors: ['from-slate-600 to-slate-800', 'from-indigo-500 to-indigo-700']
    },
    {
      id: 'fashion',
      title: '👗 Fashion',
      description: 'High-fashion and editorial style photos. Perfect for fashion bloggers, models, and style enthusiasts. Create stunning fashion-forward images that showcase your personal style',
      photos: 40,
      runs: 22,
      colors: ['from-rose-500 to-pink-600', 'from-purple-500 to-violet-600']
    },
    {
      id: 'travel',
      title: '✈️ Travel',
      description: 'Adventure and travel-themed photos. Perfect for travel bloggers, adventurers, and wanderlust enthusiasts. Capture the spirit of exploration and discovery in exotic locations',
      photos: 35,
      runs: 18,
      colors: ['from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600']
    },
    {
      id: 'fitness',
      title: '💪 Fitness',
      description: 'Athletic and fitness-focused photos. Great for personal trainers, athletes, and fitness enthusiasts. Show your strength, dedication, and healthy lifestyle with dynamic fitness imagery',
      photos: 32,
      runs: 25,
      colors: ['from-red-500 to-red-700', 'from-orange-500 to-red-600']
    }
  ]

  return (
    <section className="py-20" style={{backgroundColor: '#111'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8">Pick from 145+ photo packs</h2>
          <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-300">
            <p>With Photo AI's preset photo packs, you don't need to do any of the hard work of writing prompts or setting parameters.</p>
            <p>Instead, with just one click, Photo AI takes a set of photos for you and we keep adding new photo packs regularly.</p>
            <p>All packs are included in your membership! You can try as many as you want.</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photoPacks.map((pack) => (
            <div key={pack.id} className="bg-gray-800 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`aspect-square bg-gradient-to-br ${pack.colors[0]} rounded-lg`}></div>
                <div className={`aspect-square bg-gradient-to-br ${pack.colors[1]} rounded-lg`}></div>
              </div>
              <h3 className="text-xl font-bold mb-2">{pack.title}</h3>
              <p className="text-gray-300 text-sm mb-4">
                {pack.description}
              </p>
              <div className="space-y-2">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium w-fit">
                  {pack.photos} PHOTOS
                </div>
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium w-fit">
                  {pack.runs}X RAN THIS WEEK
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

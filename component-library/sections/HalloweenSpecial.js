// HalloweenSpecial 组件 - Halloween特别活动
// 使用方式：复制此组件代码到页面文件中

export default function HalloweenSpecial() {
  const halloweenCostumes = [
    {
      id: 'angel1',
      title: 'Angel Costume',
      colors: 'from-white to-gray-200'
    },
    {
      id: 'angel2',
      title: 'Angel Wings',
      colors: 'from-white to-gray-200'
    },
    {
      id: 'devil',
      title: 'Devil Costume',
      colors: 'from-red-500 to-red-700'
    },
    {
      id: 'witch',
      title: 'Witch Costume',
      colors: 'from-purple-500 to-black'
    }
  ]

  return (
    <section className="py-20" style={{backgroundColor: '#111'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🎃 Photo Pack Special: Halloween featuring you!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get into the spooky spirit with fun and festive Halloween costumes! Transform yourself into playful, mysterious, and creative characters that capture the excitement of Halloween with a dash of fright.
          </p>
          <p className="text-lg text-orange-400 font-medium">
            If you sign up to Photo AI now, we will auto generate this pack featuring you for free!
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {halloweenCostumes.map((costume) => (
            <div key={costume.id} className="bg-gray-800 rounded-2xl p-4">
              <div className={`aspect-square bg-gradient-to-br ${costume.colors} rounded-lg mb-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20"></div>
                <div className="absolute bottom-2 left-2 right-2 h-8 bg-orange-500 rounded"></div>
                <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 ${
                  costume.id === 'devil' ? 'bg-red-600' : 
                  costume.id === 'witch' ? 'bg-purple-600' : 'bg-yellow-400'
                } rounded-full`}></div>
              </div>
              <h3 className="text-lg font-bold text-center">{costume.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

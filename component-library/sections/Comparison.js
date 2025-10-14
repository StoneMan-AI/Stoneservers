// Comparison 组件 - 产品对比
// 使用方式：复制此组件代码到页面文件中

export default function Comparison() {
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

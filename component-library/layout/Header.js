// Header 组件 - 导航栏
// 使用方式：复制此组件代码到页面文件中

export default function Header() {
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

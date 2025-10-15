// Footer 组件 - 页脚
// 使用方式：复制此组件代码到页面文件中

export default function Footer() {
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

// Layout 组件 - 页面布局
// 使用方式：复制此组件代码到页面文件中

import Head from 'next/head'

export default function Layout({ children, title = "PHOTO AI™ - Fire your photographer", description = "Create stunning AI photos and videos from your selfies" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen text-white" style={{backgroundColor: '#111'}}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

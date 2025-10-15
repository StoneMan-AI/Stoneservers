// PageTemplate 组件 - 页面模板
// 使用方式：复制此组件代码到页面文件中

export default function PageTemplate({ 
  children, 
  title, 
  description,
  showHeader = true,
  showFooter = true 
}) {
  return (
    <Layout title={title} description={description}>
      {children}
    </Layout>
  )
}

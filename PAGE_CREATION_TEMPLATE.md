# 🚀 页面创建沟通模板

## 📋 标准沟通格式

### 创建新页面时，请使用以下格式：

```
需求：创建 [页面名称] 页面
功能：[具体功能列表]
组件：[需要的组件名称]
特殊要求：[任何特殊需求]
SEO：[SEO相关要求]
```

## 🎯 实际案例演示

### 案例：Halloween 详情页面

**沟通内容：**
```
需求：创建 Halloween 详情页面
功能：展示Halloween照片包详情、大量案例图片、用户生成内容
组件：Header, Hero, PhotoPacks, Comparison, Pricing, Footer
特殊要求：Halloween主题色彩、更多图片展示、用户评价展示
SEO：Halloween相关关键词、照片包描述
```

**实现结果：**
- ✅ 创建了 `pages/halloween.js`
- ✅ 包含所有要求的组件
- ✅ 自定义了Halloween主题的Hero组件
- ✅ 添加了照片画廊展示
- ✅ 集成了用户生成内容展示
- ✅ 优化了SEO关键词

## 🧩 可用组件清单

### 布局组件
- `Header` - 导航栏
- `Footer` - 页脚
- `Layout` - 主布局（包含Head、Header、Footer）

### 页面区块组件
- `Hero` - 首页横幅
- `Comparison` - 产品对比
- `HalloweenSpecial` - 万圣节特辑
- `Testimonials` - 用户评价
- `PhotoPacks` - 照片包展示
- `Pricing` - 套餐价格

### 页面模板
- `PageTemplate` - 通用页面模板

## 📝 页面创建步骤

### 1. 基础页面结构
```javascript
import Head from 'next/head'
import React, { useState, useEffect } from 'react'

// 从组件库复制的组件代码
function Header() {
  return (
    <header>
      {/* 组件实现 */}
    </header>
  )
}

function Hero({ user, setUser, isLoading, setIsLoading }) {
  return (
    <section>
      {/* 组件实现 */}
    </section>
  )
}

export default function PageName() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 处理订阅
  const handleSubscribe = async (planId) => {
    // 订阅逻辑
  }
  
  return (
    <>
      <Head>
        <title>页面标题</title>
        <meta name="description" content="页面描述" />
        <meta name="keywords" content="关键词1,关键词2" />
      </Head>
      
      <div className="min-h-screen text-white" style={{backgroundColor: '#111'}}>
        <Header />
        <main>
          <Hero user={user} setUser={setUser} isLoading={isLoading} setIsLoading={setIsLoading} />
          {/* 其他组件 */}
        </main>
        <Footer />
      </div>
    </>
  )
}
```

### 2. 自定义组件
如果需要特殊功能，可以创建页面专用组件：

```javascript
// 在页面文件中定义
function CustomComponent() {
  return (
    <section className="py-20" style={{backgroundColor: '#111'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 自定义内容 */}
      </div>
    </section>
  )
}
```

### 3. 数据驱动组件
对于需要展示数据的组件，使用数组配置：

```javascript
const data = [
  { id: 1, title: '标题1', description: '描述1' },
  { id: 2, title: '标题2', description: '描述2' }
]

// 在组件中使用
{data.map(item => (
  <div key={item.id}>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </div>
))}
```

## 🎨 样式系统使用

### 导入样式
```javascript
import { commonStyles, theme } from '../styles/theme'
```

### 常用样式类
```javascript
// 区块样式
className="py-20" style={{backgroundColor: '#111'}}

// 容器样式
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

// 按钮样式
className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"

// 文本样式
className="text-4xl font-bold mb-4"
```

### 主题颜色
```javascript
// 背景色
style={{backgroundColor: '#111'}}

// 渐变
className="bg-gradient-to-r from-orange-500 to-pink-500"
```

## 📋 常见需求模板

### 产品详情页
```
需求：创建 [产品名] 详情页面
功能：产品介绍、功能特点、用户评价、价格对比
组件：Hero, Comparison, Testimonials, Pricing
特殊要求：[产品特色]
SEO：[产品相关关键词]
```

### 功能展示页
```
需求：创建 [功能名] 展示页面
功能：功能演示、使用案例、技术对比
组件：Hero, PhotoPacks, Comparison
特殊要求：[功能特色]
SEO：[功能相关关键词]
```

### 营销活动页
```
需求：创建 [活动名] 活动页面
功能：活动介绍、参与方式、奖品展示
组件：Hero, PhotoPacks, Pricing
特殊要求：[活动特色]
SEO：[活动相关关键词]
```

### 主题页面
```
需求：创建 [主题名] 主题页面
功能：主题介绍、相关产品、用户案例
组件：Hero, PhotoPacks, Testimonials, Pricing
特殊要求：[主题特色色彩和风格]
SEO：[主题相关关键词]
```

## 🔧 开发最佳实践

### 1. 组件复用
- 优先使用现有组件
- 避免重复创建相似功能
- 通过props传递数据

### 2. 样式一致性
- 使用统一的暗色主题
- 保持设计风格统一
- 响应式设计

### 3. 性能优化
- 合理使用组件
- 避免不必要的重渲染
- 优化图片加载

### 4. SEO优化
- 设置页面标题和描述
- 使用语义化HTML
- 添加结构化数据

## 🚀 快速开始

1. **确定需求**：使用标准模板描述需求
2. **选择组件**：从可用组件清单中选择
3. **创建页面**：使用基础结构创建页面
4. **自定义内容**：根据需要添加自定义组件
5. **测试优化**：检查功能和样式

## 📞 技术支持

如有问题，请提供：
- 具体需求描述
- 期望的页面结构
- 特殊功能要求
- 设计风格偏好
- SEO关键词需求

## 🎯 页面类型参考

### 首页类型
- 功能：产品介绍、主要特性、用户评价、价格方案
- 组件：Hero, Comparison, Testimonials, PhotoPacks, Pricing
- 特点：全面展示产品价值

### 产品详情页
- 功能：产品详细介绍、功能对比、用户案例、购买引导
- 组件：Hero, PhotoPacks, Comparison, Testimonials, Pricing
- 特点：深度展示产品功能

### 主题页面
- 功能：主题介绍、相关产品、用户作品、参与方式
- 组件：Hero, PhotoPacks, Testimonials, Pricing
- 特点：突出主题特色

### 营销页面
- 功能：活动介绍、参与方式、奖品展示、转化引导
- 组件：Hero, PhotoPacks, Pricing
- 特点：强调转化效果

---

*通过标准化的页面创建流程，我们可以快速高效地创建符合需求的页面！*

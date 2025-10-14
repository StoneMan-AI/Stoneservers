# 🧩 组件化开发指南

## 📋 概述

本指南介绍如何使用组件库进行SEO友好的页面开发。

## 🎯 开发流程

### 1. 开发新组件
在 `component-library/` 目录中开发可复用组件：

```javascript
// component-library/sections/NewComponent.js
export default function NewComponent({ prop1, prop2 }) {
  return (
    <section className="...">
      {/* 组件内容 */}
    </section>
  )
}
```

### 2. 创建新页面
从组件库获取代码并合并到页面文件中：

```javascript
// pages/new-page.js
import Head from 'next/head'
import { useState } from 'react'

// 从组件库复制的组件代码
function Header() {
  return (
    <header>
      {/* 组件实现 */}
    </header>
  )
}

function Hero({ user, setUser }) {
  return (
    <section>
      {/* 组件实现 */}
    </section>
  )
}

export default function NewPage() {
  const [user, setUser] = useState(null)
  
  return (
    <>
      <Head>
        <title>页面标题</title>
        <meta name="description" content="页面描述" />
      </Head>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero user={user} setUser={setUser} />
        </main>
      </div>
    </>
  )
}
```

## 🔧 组件库结构

```
component-library/
├── layout/           # 布局组件
│   ├── Header.js     # 导航栏
│   └── Footer.js     # 页脚
├── sections/         # 页面区块
│   ├── Hero.js       # 首页横幅
│   ├── Comparison.js # 产品对比
│   └── Pricing.js    # 价格方案
├── ui/              # 通用UI组件
│   └── Button.js     # 按钮组件
└── templates/       # 页面模板
    └── BasicPage.js  # 基础页面模板
```

## 📝 组件开发规范

### 命名规范
- 文件名：`ComponentName.js`
- 组件名：`ComponentName`
- 导出：`export default function ComponentName()`

### 组件结构
```javascript
// 组件注释
export default function ComponentName({ prop1, prop2 }) {
  // 状态管理
  const [state, setState] = useState(null)
  
  // 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [])
  
  // 事件处理
  const handleEvent = () => {
    // 事件处理逻辑
  }
  
  // 渲染
  return (
    <div>
      {/* JSX内容 */}
    </div>
  )
}
```

### Props 类型
- `user`: 用户信息对象
- `setUser`: 设置用户信息的函数
- `isLoading`: 加载状态
- `setIsLoading`: 设置加载状态的函数
- `handleSubscribe`: 订阅处理函数

## 🚀 使用示例

### 创建Halloween页面
1. 从组件库复制 `Hero` 组件代码
2. 从组件库复制 `Header` 组件代码
3. 从组件库复制 `Footer` 组件代码
4. 合并到 `pages/halloween.js` 中
5. 添加页面特定的内容

### 创建新功能页面
1. 确定需要的组件
2. 从组件库获取组件代码
3. 创建新的页面文件
4. 合并组件代码
5. 添加页面特定逻辑

## ✅ 优势

1. **SEO友好**：页面包含完整HTML结构
2. **组件复用**：保持组件化开发优势
3. **维护性**：组件库统一管理
4. **性能**：无额外组件引用开销
5. **灵活性**：可根据页面需求调整组件

## 📚 最佳实践

1. **保持组件独立性**：组件不应依赖外部状态
2. **使用Props传递数据**：通过props控制组件行为
3. **添加详细注释**：说明组件的用途和参数
4. **测试组件功能**：确保组件在不同场景下正常工作
5. **版本控制**：记录组件的更新历史

## 🔄 更新流程

1. 在组件库中更新组件
2. 更新使用该组件的所有页面
3. 测试页面功能
4. 提交代码更改

## 📖 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://reactjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

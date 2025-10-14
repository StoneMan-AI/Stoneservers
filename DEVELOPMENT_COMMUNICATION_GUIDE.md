# 🚀 高效开发沟通指南

## 📋 标准沟通模板

### 创建新页面时，请使用以下格式：

```
需求：创建 [页面名称] 页面
功能：包含 [具体功能列表]
组件：使用 [需要的组件名称]
特殊要求：[任何特殊需求]
```

## 🎯 实际案例演示

### 案例：Halloween 详情页面

**沟通内容：**
```
需求：创建 Halloween 详情页面
功能：展示Halloween照片包详情、大量案例图片、用户生成内容
组件：Header, Hero, PhotoPacks, Comparison, Pricing, Footer
特殊要求：Halloween主题色彩、更多图片展示、用户评价展示
```

**实现结果：**
- ✅ 创建了 `pages/halloween.js`
- ✅ 包含所有要求的组件
- ✅ 自定义了Halloween主题的Hero组件
- ✅ 添加了照片画廊展示
- ✅ 集成了用户生成内容展示

## 🧩 可用组件清单

### 布局组件
- `Layout` - 主布局（包含Head、Header、Footer）
- `Header` - 导航栏
- `Footer` - 页脚

### 页面区块组件
- `Hero` - 首页横幅
- `Comparison` - 产品对比
- `HalloweenSpecial` - 万圣节特辑
- `Testimonials` - 用户评价
- `PhotoPacks` - 照片包展示
- `Pricing` - 套餐价格

### 页面模板
- `PageTemplate` - 通用页面模板

## 🎨 样式系统使用

### 导入样式
```javascript
import { commonStyles, theme } from '../styles/theme'
```

### 常用样式类
```javascript
// 区块样式
className={commonStyles.section}

// 容器样式
className={commonStyles.container}

// 卡片样式
className={commonStyles.card}

// 按钮样式
className={commonStyles.button.primary}

// 文本样式
className={commonStyles.text.heading}
```

### 主题颜色
```javascript
// 背景色
style={{backgroundColor: theme.colors.background}}

// 渐变
className={`bg-gradient-to-r ${theme.gradients.primary}`}
```

## 📝 页面创建步骤

### 1. 基础页面结构
```javascript
import Layout from '../components/layout/Layout'
import { 需要的组件 } from '../components'

export default function PageName() {
  return (
    <Layout title="页面标题" description="页面描述">
      {/* 页面内容 */}
    </Layout>
  )
}
```

### 2. 自定义组件
如果需要特殊功能，可以创建页面专用组件：

```javascript
// 在页面文件中定义
function CustomComponent() {
  return (
    <section className={commonStyles.section} style={{backgroundColor: '#111'}}>
      <div className={commonStyles.container}>
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

## 🔧 开发最佳实践

### 1. 组件复用
- 优先使用现有组件
- 避免重复创建相似功能
- 通过props传递数据

### 2. 样式一致性
- 使用主题系统
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

## 📋 常见需求模板

### 产品详情页
```
需求：创建 [产品名] 详情页面
功能：产品介绍、功能特点、用户评价、价格对比
组件：Hero, Comparison, Testimonials, Pricing
特殊要求：[产品特色]
```

### 功能展示页
```
需求：创建 [功能名] 展示页面
功能：功能演示、使用案例、技术对比
组件：Hero, PhotoPacks, Comparison
特殊要求：[功能特色]
```

### 营销活动页
```
需求：创建 [活动名] 活动页面
功能：活动介绍、参与方式、奖品展示
组件：Hero, PhotoPacks, Pricing
特殊要求：[活动特色]
```

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

---

*通过标准化的沟通方式，我们可以快速高效地创建符合需求的页面！*

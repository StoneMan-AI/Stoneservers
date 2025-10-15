# 🧩 组件使用指南

## 📁 项目结构

```
components/
├── layout/           # 布局组件
│   ├── Header.js     # 导航栏
│   ├── Footer.js     # 页脚
│   └── Layout.js     # 主布局
├── sections/         # 页面区块组件
│   ├── Hero.js       # 首页横幅
│   ├── Comparison.js # 产品对比
│   ├── HalloweenSpecial.js # 万圣节特辑
│   ├── Testimonials.js # 用户评价
│   ├── PhotoPacks.js # 照片包展示
│   └── Pricing.js    # 套餐价格
├── templates/        # 页面模板
│   └── PageTemplate.js
├── ui/              # 通用UI组件（预留）
└── index.js         # 组件导出
```

## 🎨 样式系统

### 主题配置 (`styles/theme.js`)

```javascript
import { theme, commonStyles } from '../styles/theme'

// 使用主题颜色
style={{backgroundColor: theme.colors.background}}

// 使用通用样式
className={commonStyles.section}
```

### 主要样式类

- `commonStyles.section` - 区块间距
- `commonStyles.container` - 容器样式
- `commonStyles.card` - 卡片样式
- `commonStyles.button.primary` - 主要按钮
- `commonStyles.text.heading` - 标题样式

## 🚀 使用方法

### 1. 创建新页面

```javascript
import Layout from '../components/layout/Layout'
import Hero from '../components/sections/Hero'
import Pricing from '../components/sections/Pricing'

export default function NewPage() {
  return (
    <Layout title="新页面标题" description="页面描述">
      <Hero />
      <Pricing />
    </Layout>
  )
}
```

### 2. 使用组件

```javascript
// 导入单个组件
import { Hero, Pricing } from '../components'

// 或导入特定组件
import Hero from '../components/sections/Hero'
```

### 3. 自定义样式

```javascript
import { theme } from '../styles/theme'

// 使用主题颜色
<div style={{backgroundColor: theme.colors.primary}}>
  内容
</div>

// 使用渐变
<div className={`bg-gradient-to-r ${theme.gradients.primary}`}>
  渐变背景
</div>
```

## 📝 组件开发规范

### 1. 组件结构

```javascript
import { commonStyles } from '../../styles/theme'

export default function ComponentName({ prop1, prop2 }) {
  return (
    <section className={commonStyles.section} style={{backgroundColor: '#111'}}>
      <div className={commonStyles.container}>
        {/* 组件内容 */}
      </div>
    </section>
  )
}
```

### 2. Props 类型

- 使用 PropTypes 或 TypeScript
- 提供默认值
- 添加 JSDoc 注释

### 3. 样式规范

- 优先使用主题配置
- 使用 Tailwind CSS 类
- 内联样式仅用于动态值

## 🔧 开发工具

### 代码格式化

```bash
# 安装 Prettier
npm install --save-dev prettier

# 格式化代码
npx prettier --write .
```

### ESLint 配置

项目已配置 ESLint，支持：
- Next.js 最佳实践
- React 规则
- 自定义规则

## 📋 待开发组件

### UI 组件
- [ ] Button - 按钮组件
- [ ] Card - 卡片组件
- [ ] Modal - 模态框
- [ ] Input - 输入框
- [ ] Loading - 加载组件

### 功能组件
- [ ] AuthGuard - 认证守卫
- [ ] ErrorBoundary - 错误边界
- [ ] SEO - SEO 组件
- [ ] Analytics - 分析组件

## 🎯 最佳实践

1. **组件复用**：优先使用现有组件
2. **样式一致**：使用主题系统
3. **性能优化**：使用 React.memo 和 useMemo
4. **可访问性**：添加 ARIA 属性
5. **响应式设计**：使用 Tailwind 响应式类

## 📞 技术支持

如有组件使用问题，请参考：
- 组件源码注释
- 主题配置文件
- 现有页面示例

---

*最后更新：2025年1月*

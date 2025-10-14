# 🧩 组件开发沟通模板

## 📋 标准沟通格式

### 创建新组件时，请使用以下格式：

```
需求：开发 [组件名称] 组件
功能：[具体功能描述]
类型：[layout/sections/ui/templates]
Props：[需要的props参数]
样式：[特殊样式要求]
复用性：[是否可复用，用于哪些页面]
```

## 🎯 实际案例演示

### 案例：创建新的照片展示组件

**沟通内容：**
```
需求：开发 PhotoGallery 组件
功能：展示照片网格、支持点击放大、懒加载
类型：sections
Props：photos (照片数组), onPhotoClick (点击回调)
样式：响应式网格布局，悬停效果
复用性：可复用，用于产品展示页面、用户作品页面
```

**实现结果：**
- ✅ 创建了 `component-library/sections/PhotoGallery.js`
- ✅ 支持响应式网格布局
- ✅ 实现了懒加载功能
- ✅ 添加了点击放大功能
- ✅ 可在多个页面中复用

## 🧩 组件类型说明

### Layout 组件
- **用途**：页面布局结构
- **示例**：Header, Footer, Layout
- **特点**：全局使用，结构固定

### Sections 组件
- **用途**：页面内容区块
- **示例**：Hero, Comparison, Pricing
- **特点**：内容展示，可配置

### UI 组件
- **用途**：通用交互元素
- **示例**：Button, Modal, Card
- **特点**：高度复用，功能单一

### Templates 组件
- **用途**：页面模板
- **示例**：BasicPage, ProductPage
- **特点**：页面结构，组合多个组件

## 📝 组件开发规范

### 命名规范
```
文件名：ComponentName.js
组件名：ComponentName
导出：export default function ComponentName()
```

### 文件结构
```
component-library/
├── layout/           # 布局组件
├── sections/         # 页面区块
├── ui/              # 通用UI组件
└── templates/       # 页面模板
```

### 组件结构模板
```javascript
// 组件注释 - 说明组件用途
export default function ComponentName({ 
  prop1, 
  prop2, 
  onEvent 
}) {
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
    <div className="...">
      {/* JSX内容 */}
    </div>
  )
}
```

## 🔧 常用Props类型

### 用户相关
- `user`: 用户信息对象
- `setUser`: 设置用户信息的函数
- `isLoading`: 加载状态
- `setIsLoading`: 设置加载状态的函数

### 功能相关
- `handleSubscribe`: 订阅处理函数
- `onClick`: 点击事件处理
- `onChange`: 变化事件处理

### 数据相关
- `data`: 数据数组
- `items`: 项目列表
- `config`: 配置对象

## 🎨 样式开发规范

### 使用主题系统
```javascript
import { commonStyles, theme } from '../../styles/theme'

// 使用通用样式
className={commonStyles.section}
className={commonStyles.container}
className={commonStyles.button.primary}

// 使用主题颜色
style={{backgroundColor: theme.colors.background}}
```

### 响应式设计
```javascript
// 移动端优先
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### 暗色主题
```javascript
// 使用项目统一的暗色主题
style={{backgroundColor: '#111'}}
```

## 🚀 开发流程

### 1. 需求分析
- 确定组件功能
- 分析复用场景
- 设计Props接口

### 2. 组件开发
- 创建组件文件
- 实现基础功能
- 添加样式

### 3. 测试验证
- 功能测试
- 样式测试
- 响应式测试

### 4. 文档更新
- 更新组件库索引
- 添加使用示例
- 记录更新历史

## 📋 常见需求模板

### 展示类组件
```
需求：开发 [组件名] 展示组件
功能：展示 [数据类型]，支持 [交互功能]
类型：sections
Props：data (数据数组), onItemClick (项目点击)
样式：[布局要求]
复用性：用于 [页面类型]
```

### 交互类组件
```
需求：开发 [组件名] 交互组件
功能：处理 [用户操作]，返回 [结果数据]
类型：ui
Props：onSubmit (提交回调), config (配置对象)
样式：[视觉要求]
复用性：全局复用
```

### 布局类组件
```
需求：开发 [组件名] 布局组件
功能：提供 [页面结构]，包含 [子组件]
类型：layout
Props：children (子组件), title (标题)
样式：[结构样式]
复用性：页面模板使用
```

## 🔄 更新维护

### 组件更新
1. 在组件库中修改组件
2. 更新使用该组件的页面
3. 测试功能完整性
4. 更新文档

### 版本管理
- 记录组件更新历史
- 保持向后兼容性
- 及时更新使用示例

## 📞 技术支持

开发组件时，请提供：
- 详细的功能需求
- 期望的Props接口
- 样式设计要求
- 复用场景说明
- 特殊功能需求

---

*通过标准化的组件开发流程，我们可以快速创建高质量、可复用的组件！*

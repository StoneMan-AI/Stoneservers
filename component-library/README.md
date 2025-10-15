# 🧩 组件库管理系统

## 📋 使用说明

### 开发流程
1. **开发组件**：在 `component-library/` 中开发可复用组件
2. **合并到页面**：创建页面时，从组件库获取代码并合并到页面文件中
3. **保持SEO友好**：页面代码包含完整的HTML结构，适合搜索引擎收录

### 组件库结构
```
component-library/
├── layout/           # 布局组件
│   ├── Header.js     # 导航栏
│   ├── Footer.js     # 页脚
│   └── Layout.js     # 页面布局
├── sections/         # 页面区块组件
│   ├── Hero.js       # 首页横幅
│   ├── Comparison.js # 产品对比
│   ├── Pricing.js    # 价格方案
│   ├── PhotoPacks.js # 照片包展示
│   ├── Testimonials.js # 用户评价
│   └── HalloweenSpecial.js # Halloween特别活动
├── templates/        # 页面模板
│   └── PageTemplate.js # 基础页面模板
└── ui/              # 通用UI组件
```

### 组件命名规范
- 文件名：`ComponentName.js`
- 组件名：`ComponentName`
- 导出：`export default function ComponentName()`

### 使用方式
1. 从组件库复制组件代码
2. 粘贴到目标页面文件中
3. 根据需要调整props和样式
4. 确保所有依赖都已导入

## 🎯 优势
- ✅ SEO友好：页面包含完整HTML结构
- ✅ 组件复用：保持组件化开发优势
- ✅ 维护性：组件库统一管理
- ✅ 性能：无额外组件引用开销

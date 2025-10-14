// 组件库索引文件
// 用于快速查看和获取所有可用组件

export const componentLibrary = {
  // 布局组件
  layout: {
    Header: {
      name: 'Header',
      description: '导航栏组件，包含Logo、导航菜单和CTA按钮',
      file: 'layout/Header.js',
      dependencies: [],
      props: []
    },
    Footer: {
      name: 'Footer',
      description: '页脚组件，包含版权信息和链接',
      file: 'layout/Footer.js',
      dependencies: [],
      props: []
    },
    Layout: {
      name: 'Layout',
      description: '页面布局组件，包含Header、Footer和内容区域',
      file: 'layout/Layout.js',
      dependencies: ['Head from next/head'],
      props: ['children', 'title', 'description']
    }
  },

  // 页面区块组件
  sections: {
    Hero: {
      name: 'Hero',
      description: '首页横幅组件，包含登录功能和主要介绍',
      file: 'sections/Hero.js',
      dependencies: ['React.useEffect', 'React.useState'],
      props: ['user', 'setUser', 'isLoading', 'setIsLoading']
    },
    Comparison: {
      name: 'Comparison',
      description: '产品对比组件，展示Photo AI与其他AI工具的对比',
      file: 'sections/Comparison.js',
      dependencies: [],
      props: []
    },
    Pricing: {
      name: 'Pricing',
      description: '价格方案组件，包含订阅功能',
      file: 'sections/Pricing.js',
      dependencies: ['React.useState'],
      props: ['handleSubscribe']
    },
    PhotoPacks: {
      name: 'PhotoPacks',
      description: '照片包展示组件，展示各种主题的照片包',
      file: 'sections/PhotoPacks.js',
      dependencies: [],
      props: []
    },
    Testimonials: {
      name: 'Testimonials',
      description: '用户评价组件，展示客户反馈',
      file: 'sections/Testimonials.js',
      dependencies: [],
      props: []
    },
    HalloweenSpecial: {
      name: 'HalloweenSpecial',
      description: 'Halloween特别活动组件',
      file: 'sections/HalloweenSpecial.js',
      dependencies: [],
      props: []
    }
  },

  // 页面模板组件
  templates: {
    PageTemplate: {
      name: 'PageTemplate',
      description: '基础页面模板组件',
      file: 'templates/PageTemplate.js',
      dependencies: ['Layout'],
      props: ['children', 'title', 'description', 'showHeader', 'showFooter']
    }
  },

  // UI组件
  ui: {
    Button: {
      name: 'Button',
      description: '通用按钮组件',
      file: 'ui/Button.js',
      dependencies: [],
      props: ['variant', 'size', 'children', 'onClick']
    }
  }
}

// 获取所有组件
export function getAllComponents() {
  return componentLibrary
}

// 获取特定分类的组件
export function getComponentsByCategory(category) {
  return componentLibrary[category] || {}
}

// 获取组件信息
export function getComponentInfo(category, componentName) {
  return componentLibrary[category]?.[componentName] || null
}

// 生成组件使用示例
export function generateUsageExample(category, componentName) {
  const component = getComponentInfo(category, componentName)
  if (!component) return ''

  const props = component.props.map(prop => `${prop}={${prop}}`).join(' ')
  return `<${componentName} ${props} />`
}

// 生成导入代码
export function generateImportCode(component) {
  if (!component) return ''
  
  const imports = component.dependencies.map(dep => {
    if (dep.includes(' from ')) {
      return `import ${dep}`
    }
    return `import { ${dep} } from 'react'`
  })
  
  return imports.join('\n')
}

export default componentLibrary

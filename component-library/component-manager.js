// 组件库管理工具
// 用于快速获取和合并组件代码

const componentLibrary = {
  // 布局组件
  layout: {
    Header: {
      path: 'layout/Header.js',
      description: '导航栏组件，包含Logo、导航菜单和CTA按钮',
      dependencies: [],
      props: []
    },
    Footer: {
      path: 'layout/Footer.js', 
      description: '页脚组件，包含版权信息和链接',
      dependencies: [],
      props: []
    },
    Layout: {
      path: 'layout/Layout.js',
      description: '页面布局组件，包含Header、Footer和内容区域',
      dependencies: ['Head from next/head'],
      props: ['children', 'title', 'description']
    }
  },

  // 页面区块组件
  sections: {
    Hero: {
      path: 'sections/Hero.js',
      description: '首页横幅组件，包含登录功能和主要介绍',
      dependencies: ['React.useEffect', 'React.useState'],
      props: ['user', 'setUser', 'isLoading', 'setIsLoading']
    },
    Comparison: {
      path: 'sections/Comparison.js',
      description: '产品对比组件，展示Photo AI与其他AI工具的对比',
      dependencies: [],
      props: []
    },
    Pricing: {
      path: 'sections/Pricing.js',
      description: '价格方案组件，包含订阅功能',
      dependencies: ['React.useState'],
      props: ['handleSubscribe']
    },
    PhotoPacks: {
      path: 'sections/PhotoPacks.js',
      description: '照片包展示组件，展示各种主题的照片包',
      dependencies: [],
      props: []
    },
    Testimonials: {
      path: 'sections/Testimonials.js',
      description: '用户评价组件，展示客户反馈',
      dependencies: [],
      props: []
    },
    HalloweenSpecial: {
      path: 'sections/HalloweenSpecial.js',
      description: 'Halloween特别活动组件',
      dependencies: [],
      props: []
    }
  },

  // 页面模板组件
  templates: {
    PageTemplate: {
      path: 'templates/PageTemplate.js',
      description: '基础页面模板组件',
      dependencies: ['Layout'],
      props: ['children', 'title', 'description', 'showHeader', 'showFooter']
    }
  },

  // UI组件
  ui: {
    Button: {
      path: 'ui/Button.js',
      description: '通用按钮组件',
      dependencies: [],
      props: ['variant', 'size', 'children', 'onClick']
    }
  }
}

// 获取组件信息
export function getComponentInfo(category, componentName) {
  return componentLibrary[category]?.[componentName] || null
}

// 获取所有组件列表
export function getAllComponents() {
  return componentLibrary
}

// 生成组件导入代码
export function generateImportCode(componentInfo) {
  if (!componentInfo) return ''
  
  const imports = componentInfo.dependencies.map(dep => {
    if (dep.includes('.')) {
      return `import { ${dep} } from 'react'`
    }
    return `import ${dep} from 'react'`
  })
  
  return imports.join('\n')
}

// 生成组件使用示例
export function generateUsageExample(componentInfo, componentName) {
  if (!componentInfo) return ''
  
  const props = componentInfo.props.map(prop => `${prop}={${prop}}`).join(' ')
  return `<${componentName} ${props} />`
}

export default componentLibrary

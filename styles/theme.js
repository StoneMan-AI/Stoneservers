// 主题配置
export const theme = {
  colors: {
    background: '#111',
    backgroundSecondary: '#1a1a1a',
    backgroundTertiary: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    textMuted: '#666666',
    primary: '#f97316', // orange-500
    primaryHover: '#ea580c', // orange-600
    secondary: '#ec4899', // pink-500
    accent: '#8b5cf6', // purple-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    border: '#374151', // gray-700
    borderLight: '#4b5563', // gray-600
  },
  
  gradients: {
    primary: 'from-orange-500 to-pink-500',
    secondary: 'from-purple-500 to-pink-500',
    accent: 'from-blue-500 to-purple-500',
    success: 'from-emerald-500 to-teal-500',
  },
  
  spacing: {
    section: 'py-20',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  
  borderRadius: {
    default: 'rounded-lg',
    large: 'rounded-2xl',
    full: 'rounded-full',
  },
  
  shadows: {
    default: 'shadow-lg',
    large: 'shadow-2xl',
  }
}

// 通用样式类
export const commonStyles = {
  section: `${theme.spacing.section}`,
  container: `${theme.spacing.container}`,
  card: `bg-gray-800 ${theme.borderRadius.large} p-6`,
  button: {
    primary: `bg-gradient-to-r ${theme.gradients.primary} text-white px-6 py-3 ${theme.borderRadius.default} font-medium hover:opacity-90 transition-opacity`,
    secondary: `bg-gray-700 text-white px-6 py-3 ${theme.borderRadius.default} font-medium hover:bg-gray-600 transition-colors`,
    outline: `border border-gray-600 text-white px-6 py-3 ${theme.borderRadius.default} font-medium hover:bg-gray-700 transition-colors`,
  },
  text: {
    heading: 'text-4xl font-bold mb-4',
    subheading: 'text-2xl font-bold mb-2',
    body: 'text-gray-300',
    muted: 'text-gray-400',
  }
}

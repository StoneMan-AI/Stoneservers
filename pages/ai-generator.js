import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export default function AIGenerator() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Photo Model 和 Photo AI 切换状态
  const [activeTab, setActiveTab] = useState('photo-model')
  
  // Photo Model 相关状态
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [isCreatingModel, setIsCreatingModel] = useState(false)
  const [modelForm, setModelForm] = useState({
    name: '',
    type: '',
    age: '',
    eyeColor: '',
    bodyType: '',
    ethnicity: ''
  })
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showModelList, setShowModelList] = useState(false)
  const [isCreatingNewModelUI, setIsCreatingNewModelUI] = useState(false)
  const modelListRef = useRef(null)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showEyeColorDropdown, setShowEyeColorDropdown] = useState(false)
  const [showBodyTypeDropdown, setShowBodyTypeDropdown] = useState(false)
  const [showEthnicityDropdown, setShowEthnicityDropdown] = useState(false)

  // 处理订阅函数
  const handleSubscribe = async (planId) => {
    if (!user) {
      window.location.href = '/auth/google';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建支付会话失败');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('订阅失败:', error);
      alert('订阅失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // 处理 Model 表单变化
  const handleModelFormChange = (field, value) => {
    setModelForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 处理照片上传
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)
    setUploadedPhotos(prev => [...prev, ...files])
  }

  // 创建 Photo Model
  const handleCreateModel = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    // 检查用户模型配额
    if (user.modelQuota <= 0) {
      alert('您的模型配额已用完，请升级订阅套餐')
      return
    }

    if (!modelForm.name || !modelForm.type || !modelForm.age || !modelForm.eyeColor || !modelForm.bodyType || !modelForm.ethnicity) {
      alert('请填写所有必填字段')
      return
    }

    if (uploadedPhotos.length === 0) {
      alert('请至少上传一张照片')
      return
    }

    setIsCreatingModel(true)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // 准备照片数据
      const photosData = uploadedPhotos.map((file, index) => ({
        name: file.name,
        path: `/uploads/models/${Date.now()}_${file.name}`, // 实际应该上传到对象存储
        size: file.size,
        type: file.type,
        uploadOrder: index + 1
      }))

      // 调用后端 API 创建模型
      const response = await fetch('/api/photo-models/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: modelForm.name,
          type: modelForm.type,
          age: modelForm.age,
          eyeColor: modelForm.eyeColor,
          bodyType: modelForm.bodyType,
          ethnicity: modelForm.ethnicity,
          photos: photosData
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '创建模型失败')
      }

      const result = await response.json()
      setUploadProgress(100)

      // 重新加载模型列表
      await loadModels()

      // 重置表单
      setModelForm({
        name: '',
        type: '',
        age: '',
        eyeColor: '',
        bodyType: '',
        ethnicity: ''
      })
      setUploadedPhotos([])

      alert('Photo Model 创建成功！基础 Prompt 已生成，可以开始使用 Photo AI 功能。')
    } catch (error) {
      console.error('创建模型失败:', error)
      alert('创建模型失败: ' + error.message)
    } finally {
      setIsCreatingModel(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // 加载用户的 Photo Models
  const loadModels = async () => {
    try {
      const response = await fetch('/api/photo-models/models', {
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        setModels(result.models)
        
        // 如果有模型且没有选中，默认选中最新的
        if (result.models.length > 0 && !selectedModel) {
          setSelectedModel(result.models[0])
        }
      }
    } catch (error) {
      console.error('加载模型列表失败:', error)
    }
  }

  // 选择模型
  const handleModelSelect = (model) => {
    setSelectedModel(model)
    setShowModelList(false)
    setIsCreatingNewModelUI(false)
  }

  // 创建新模型
  const handleCreateNewModel = () => {
    setSelectedModel(null)
    setShowModelList(false)
    setIsCreatingNewModelUI(true)
  }

  // 点击下拉框外部收起
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModelList && modelListRef.current && !modelListRef.current.contains(event.target)) {
        setShowModelList(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showModelList])

  useEffect(() => {
    // 检查 URL 参数，看是否是支付成功后的跳转
    const { payment, session_id, auth } = router.query
    
    if (payment === 'success' && session_id) {
      setShowSuccessMessage(true)
      // 3秒后隐藏成功消息
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }

    // 检查用户登录状态和订阅状态
    const checkAuthAndSubscription = async () => {
      try {
        // 首先检查认证状态
        const authResponse = await fetch('/auth/check', {
          credentials: 'include'
        })
        
        if (!authResponse.ok) {
          console.log('❌ 认证检查失败，跳转到首页')
          router.push('/')
          return
        }
        
        const authData = await authResponse.json()
        console.log('🔍 认证检查结果:', authData)
        
        if (!authData.authenticated) {
          console.log('❌ 用户未认证，跳转到首页')
          router.push('/')
          return
        }
        
        // 如果认证成功，获取完整的用户信息
        const userResponse = await fetch('/auth/user', {
          credentials: 'include'
        })
        
        if (!userResponse.ok) {
          console.log('❌ 获取用户信息失败，跳转到首页')
          router.push('/')
          return
        }
        
        const userData = await userResponse.json()
        setUser(userData)
        
        console.log('🔍 AI Generator 页面 - 用户信息:', {
          email: userData.email,
          subscriptionStatus: userData.subscriptionStatus,
          subscriptionExpiry: userData.subscriptionExpiry,
          points: userData.points,
          modelQuota: userData.modelQuota
        })
        
        // 检查订阅状态
        const hasActiveSubscription = userData.subscriptionStatus === 'active' && 
          (userData.subscriptionExpiry === null || new Date(userData.subscriptionExpiry) > new Date())
        
        if (!hasActiveSubscription) {
          console.log('❌ 用户未订阅，跳转到首页 Pricing 模块')
          router.push('/#pricing')
          return
        }
        
        console.log('✅ 用户已认证且已订阅，可以访问 AI Generator')
        setIsChecking(false)
        
        // 加载用户的 Photo Models
        await loadModels()
      } catch (error) {
        console.error('❌ 检查认证状态失败:', error)
        router.push('/')
      }
    }

    checkAuthAndSubscription()
  }, [router])

  // 初始化时默认选中最近创建的模型
  useEffect(() => {
    if (models.length > 0 && !selectedModel && !isCreatingNewModelUI) {
      // 按创建时间排序，选择最新的模型
      const sortedModels = [...models].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setSelectedModel(sortedModels[0])
    }
  }, [models, selectedModel, isCreatingNewModelUI])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-white">Verifying your access...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>AI Generator - Stoneservers</title>
        <meta name="description" content="AI 图像生成工具" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* 成功消息 */}
        {showSuccessMessage && (
          <div className="bg-green-900 border border-green-600 text-green-300 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">🎉 支付成功！欢迎使用 AI Generator</span>
          </div>
        )}

        {/* 头部导航 */}
        <div className="bg-gray-900 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">PHOTO AI™</h1>
                <span className="ml-4 text-sm text-gray-400">550K MRR • 639K PHOTOS/MO</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Welcome, {user?.email}
                </span>
                <span className="text-sm text-gray-400">
                  Model quota: {user?.modelQuota || 0}
                </span>
                <button className="bg-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-600 text-sm font-medium">
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab 切换 */}
          <div className="mb-8">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('photo-model')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'photo-model'
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Photo Model
                </button>
                <button
                  onClick={() => setActiveTab('photo-ai')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'photo-ai'
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Photo AI
                </button>
              </nav>
            </div>
          </div>

          {/* Photo Model 界面 */}
          {activeTab === 'photo-model' && (
            <div className="grid gap-8" style={{ gridTemplateColumns: '2fr 3fr' }}>
              {/* 左侧：Model 管理栏 */}
              <div className="space-y-6">
                {/* Model 列表选择器 */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6" style={{maxHeight: 'calc(100vh - 240px)', overflowY: 'auto'}}>
                  <h3 className="text-lg font-medium text-white mb-4">Model Management</h3>
                  
                  {models.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">No models yet</p>
                      <button
                        onClick={handleCreateNewModel}
                        className="bg-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-600 font-medium"
                      >
                        Create New Model
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between relative">
                        <button
                          onClick={() => setShowModelList(!showModelList)}
                          className="flex items-center justify-between w-full p-3 border border-gray-600 rounded-md hover:bg-gray-700 bg-gray-800"
                        >
                          <span className="text-white">{selectedModel ? selectedModel.name : 'Select Model'}</span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {showModelList && (
                        <div ref={modelListRef} className="absolute z-20 mt-2 border border-gray-600 rounded-md bg-gray-800 shadow-xl" style={{maxHeight: '14rem', overflowY: 'auto', minWidth: '16rem', width: 'auto'}}>
                          {/* 创建新Model按钮在列表顶部 */}
                          <button
                            onClick={handleCreateNewModel}
                            className="w-full text-left p-3 hover:bg-gray-700 border-b border-gray-600 bg-orange-900"
                          >
                            <div className="font-medium text-white flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Create New Model
                            </div>
                          </button>
                          
                          {/* 现有模型列表 */}
                          {models.slice(0, 4).map((model) => (
                            <button
                              key={model.id}
                              onClick={() => handleModelSelect(model)}
                              className={`w-full text-left p-3 hover:bg-gray-700 ${
                                selectedModel?.id === model.id ? 'bg-orange-900 border-l-4 border-orange-500' : ''
                              }`}
                            >
                              <div className="font-medium text-white">{model.name}</div>
                              <div className="text-sm text-gray-400">
                                {model.type} • {model.age} yrs • {model.eyeColor} eyes
                              </div>
                              <div className="text-xs text-gray-500">
                                Created {new Date(model.createdAt).toLocaleDateString()}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Model 属性表单 */}
                {!selectedModel && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Create Photo Model</h3>
                    <p className="text-gray-400 mb-6">The model you create is private and only usable by you.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          NAME *
                        </label>
                        <input
                          type="text"
                          value={modelForm.name}
                          onChange={(e) => handleModelFormChange('name', e.target.value)}
                          className="w-full bg-gray-900 border-2 border-orange-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Person's name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          TYPE *
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                            className="w-full bg-gray-900 border-2 border-orange-500 rounded-md px-3 py-2 text-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {modelForm.type || '选择类型'}
                          </button>
                          {showTypeDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                              {['Man', 'Woman', 'Couple / Two people', 'Dog', 'Cat', 'Other'].map((type) => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    handleModelFormChange('type', type)
                                    setShowTypeDropdown(false)
                                  }}
                                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700"
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          AGE *
                        </label>
                        <input
                          type="number"
                          value={modelForm.age}
                          onChange={(e) => handleModelFormChange('age', e.target.value)}
                          className="w-full bg-gray-900 border-2 border-orange-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="年龄"
                          min="1"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          EYE COLOR *
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowEyeColorDropdown(!showEyeColorDropdown)}
                            className="w-full bg-gray-900 border-2 border-orange-500 rounded-md px-3 py-2 text-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {modelForm.eyeColor || '选择眼睛颜色'}
                          </button>
                          {showEyeColorDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                              {['Brown', 'Blue', 'Hazel', 'Green', 'Gray'].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => {
                                    handleModelFormChange('eyeColor', color)
                                    setShowEyeColorDropdown(false)
                                  }}
                                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 flex items-center"
                                >
                                  {modelForm.eyeColor === color && <span className="mr-2">✓</span>}
                                  {color}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          BODY TYPE *
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowBodyTypeDropdown(!showBodyTypeDropdown)}
                            className="w-full bg-gray-900 border-2 border-orange-500 rounded-md px-3 py-2 text-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {modelForm.bodyType || '选择体型'}
                          </button>
                          {showBodyTypeDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                              {['Skinny', 'Slim', 'Athletic', 'Muscular', 'Curvy', 'Overweight', 'Obese'].map((type) => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    handleModelFormChange('bodyType', type)
                                    setShowBodyTypeDropdown(false)
                                  }}
                                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 flex items-center"
                                >
                                  {modelForm.bodyType === type && <span className="mr-2">✓</span>}
                                  {type}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          ETHNICITY *
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowEthnicityDropdown(!showEthnicityDropdown)}
                            className="w-full bg-gray-900 border-2 border-orange-500 rounded-md px-3 py-2 text-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {modelForm.ethnicity || '选择种族'}
                          </button>
                          {showEthnicityDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                              {['White', 'Black', 'East Asian (Chinese, Japanese, Korean)', 'South East Asian (Thai, Indonesian)', 'South Asian (Indian)', 'Hispanic', 'Mixed'].map((ethnicity) => (
                                <button
                                  key={ethnicity}
                                  onClick={() => {
                                    handleModelFormChange('ethnicity', ethnicity)
                                    setShowEthnicityDropdown(false)
                                  }}
                                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 flex items-center"
                                >
                                  {modelForm.ethnicity === ethnicity && <span className="mr-2">✓</span>}
                                  {ethnicity}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 照片上传区域 */}
                {!selectedModel && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">SELECT 10+ PHOTOS</h3>
                    
                    {/* Good Photos 示例说明 */}
                    <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-md">
                      <div className="flex items-center mb-2">
                        <span className="text-green-400 mr-2">✓</span>
                          <h4 className="font-medium text-green-300">Good photos</h4>
                      </div>
                      <p className="text-sm text-green-200 mb-3">
                        High variety, mix of close-up selfies and full body shots in a variety of places, angles, clothes and expressions.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gray-700 h-16 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Example 1</span>
                        </div>
                        <div className="bg-gray-700 h-16 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Example 2</span>
                        </div>
                        <div className="bg-gray-700 h-16 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Example 3</span>
                        </div>
                      </div>
                    </div>

                    {/* Bad Photos 示例说明 */}
                    <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-md">
                      <div className="flex items-center mb-2">
                        <span className="text-red-400 mr-2">✗</span>
                          <h4 className="font-medium text-red-300">Bad photos</h4>
                      </div>
                      <p className="text-sm text-red-200 mb-3">
                        Low variety, group photos, other people, sunglasses, hats, face cut off or not visible.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gray-700 h-16 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Example 1</span>
                        </div>
                        <div className="bg-gray-700 h-16 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Example 2</span>
                        </div>
                        <div className="bg-gray-700 h-16 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Example 3</span>
                        </div>
                      </div>
                    </div>

                    {/* 文件上传控件 */}
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer block"
                      >
                        <div className="flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-white text-lg">Select at least 25 photos of yourself</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Hold ⇧ to select multiple files
                        </p>
                      </label>
                    </div>

                    {/* 已上传照片预览 */}
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-white mb-2">
                          Selected {uploadedPhotos.length} photos:
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {uploadedPhotos.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded border border-gray-600"
                              />
                              <button
                                onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== index))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 上传进度 */}
                    {isUploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>上传进度</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* 配额检查提示 */}
                    {user && user.modelQuota <= 0 && (
                      <div className="mt-4 p-4 bg-red-900 border border-red-600 rounded-md">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div>
                            <h4 className="font-medium text-red-300">Model quota exhausted</h4>
                            <p className="text-sm text-red-200 mt-1">
                              Your model quota has been used up. Please upgrade your plan.
                            </p>
                            <button
                              onClick={() => handleSubscribe('pro')}
                              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
                            >
                              Upgrade now
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 创建 Model 按钮 */}
                    <button
                      onClick={handleCreateModel}
                      disabled={isCreatingModel || isUploading || (user && user.modelQuota <= 0)}
                      className="w-full mt-6 bg-orange-500 text-black py-3 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isCreatingModel ? 'Creating...' : 'Create model (~60min)'}
                    </button>
                  </div>
                )}

                {/* 选中 Model 的属性显示 */}
                {selectedModel && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6" style={{maxHeight: 'calc(100vh - 240px)', overflowY: 'auto'}}>
                    <h3 className="text-lg font-medium text-white mb-4">Model Attributes</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedModel.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{selectedModel.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Age:</span>
                        <span className="text-white">{selectedModel.age} yrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eye color:</span>
                        <span className="text-white">{selectedModel.eyeColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Body type:</span>
                        <span className="text-white">{selectedModel.bodyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ethnicity:</span>
                        <span className="text-white">{selectedModel.ethnicity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created at:</span>
                        <span className="text-white text-sm">
                          {new Date(selectedModel.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 右侧：展示栏 */}
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6" style={{maxHeight: 'calc(100vh - 240px)', overflowY: 'auto'}}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                      {selectedModel ? `${selectedModel.name} 生成的图片` : '图片展示'}
                    </h3>
                    {selectedModel && (
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>照片数量: {selectedModel.photoCount}</span>
                        <span>生成图片: {selectedModel.generatedPhotos?.length || 0}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedModel ? (
                    <div>
                      {/* 显示通过 Photo AI 生成的图片 */}
                      {selectedModel.generatedPhotos && selectedModel.generatedPhotos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {selectedModel.generatedPhotos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo.url}
                                alt={`Generated ${index + 1}`}
                                className="w-full h-48 object-cover rounded border border-gray-600"
                              />
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                {photo.createdAt}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                  <div className="text-center py-12">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                      <p className="mt-2 text-gray-400">Images generated with Photo AI will appear here</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-gray-400">请先创建一个 Photo Model</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Photo AI 界面 */}
          {activeTab === 'photo-ai' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">Photo AI</h3>
                <p className="mt-1 text-gray-400">Photo AI 功能正在开发中...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
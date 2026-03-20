<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
    <!-- 顶部导航 -->
    <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-400 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
            AI 智能面诊
          </span>
        </div>
        
        <div class="flex items-center space-x-4">
          <button 
            v-if="currentStep > 0"
            @click="resetAll"
            class="text-gray-600 hover:text-pink-500 transition-colors"
          >
            重新开始
          </button>
          <button class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
            历史记录
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要内容区 -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- 步骤指示器 -->
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center space-x-4">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex items-center"
          >
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                currentStep >= index 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span 
              :class="[
                'ml-2 text-sm hidden sm:block',
                currentStep >= index ? 'text-pink-600 font-medium' : 'text-gray-400'
              ]"
            >
              {{ step }}
            </span>
            <div 
              v-if="index < steps.length - 1"
              :class="[
                'w-12 h-1 mx-4 rounded transition-all',
                currentStep > index ? 'bg-pink-500' : 'bg-gray-200'
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- 步骤内容 -->
      <transition name="fade" mode="out-in">
        <!-- 步骤1：拍照上传 -->
        <div v-if="currentStep === 0" key="upload" class="max-w-3xl mx-auto">
          <div class="bg-white rounded-3xl shadow-xl p-8 card-hover">
            <h2 class="text-2xl font-bold text-center mb-2">上传您的面部照片</h2>
            <p class="text-gray-500 text-center mb-8">AI将为您进行专业的皮肤、轮廓、抗衰分析</p>
            
            <!-- 双照片上传区域 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 正面照 -->
              <div class="space-y-3">
                <div class="flex items-center justify-center space-x-2 text-gray-700 font-medium">
                  <span class="text-xl">👤</span>
                  <span>正面照</span>
                  <span v-if="frontPhoto" class="text-green-500">✓</span>
                </div>
                <div 
                  @click="triggerUpload('front')"
                  @dragover.prevent="draggingFront = true"
                  @dragleave="draggingFront = false"
                  @drop.prevent="handleDrop($event, 'front')"
                  :class="[
                    'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all min-h-[280px] flex flex-col items-center justify-center',
                    frontPhoto ? 'border-green-400 bg-green-50' : '',
                    draggingFront ? 'border-pink-400 bg-pink-50' : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50/50'
                  ]"
                >
                  <input 
                    ref="frontInput"
                    type="file" 
                    accept="image/*" 
                    capture="user"
                    class="hidden" 
                    @change="handleFileSelect($event, 'front')"
                  />
                  
                  <div v-if="!frontPhoto" class="space-y-3">
                    <div class="w-16 h-16 bg-pink-100 rounded-full mx-auto flex items-center justify-center">
                      <svg class="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-700">点击上传正面照</p>
                      <p class="text-xs text-gray-400 mt-1">面部正对镜头</p>
                    </div>
                  </div>
                  
                  <div v-else class="relative w-full">
                    <img :src="frontPhoto" class="max-h-52 mx-auto rounded-xl" />
                    <button 
                      @click.stop="clearPhoto('front')"
                      class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 侧面照 -->
              <div class="space-y-3">
                <div class="flex items-center justify-center space-x-2 text-gray-700 font-medium">
                  <span class="text-xl">👤</span>
                  <span>侧面照</span>
                  <span v-if="sidePhoto" class="text-green-500">✓</span>
                </div>
                <div 
                  @click="triggerUpload('side')"
                  @dragover.prevent="draggingSide = true"
                  @dragleave="draggingSide = false"
                  @drop.prevent="handleDrop($event, 'side')"
                  :class="[
                    'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all min-h-[280px] flex flex-col items-center justify-center',
                    sidePhoto ? 'border-green-400 bg-green-50' : '',
                    draggingSide ? 'border-pink-400 bg-pink-50' : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50/50'
                  ]"
                >
                  <input 
                    ref="sideInput"
                    type="file" 
                    accept="image/*" 
                    capture="user"
                    class="hidden" 
                    @change="handleFileSelect($event, 'side')"
                  />
                  
                  <div v-if="!sidePhoto" class="space-y-3">
                    <div class="w-16 h-16 bg-pink-100 rounded-full mx-auto flex items-center justify-center">
                      <svg class="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-700">点击上传侧面照</p>
                      <p class="text-xs text-gray-400 mt-1">侧脸 90° 角度</p>
                    </div>
                  </div>
                  
                  <div v-else class="relative w-full">
                    <img :src="sidePhoto" class="max-h-52 mx-auto rounded-xl" />
                    <button 
                      @click.stop="clearPhoto('side')"
                      class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 拍照提示 -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-pink-50 rounded-xl p-4">
                <h4 class="font-medium text-pink-700 mb-2">📸 正面照要求</h4>
                <ul class="text-sm text-pink-600 space-y-1">
                  <li>✓ 面部正对镜头，表情自然</li>
                  <li>✓ 确保五官清晰可见</li>
                  <li>✓ 头发不要遮挡脸部</li>
                </ul>
              </div>
              <div class="bg-blue-50 rounded-xl p-4">
                <h4 class="font-medium text-blue-700 mb-2">📸 侧面照要求</h4>
                <ul class="text-sm text-blue-600 space-y-1">
                  <li>✓ 侧脸与镜头呈 90°</li>
                  <li>✓ 展示下颌线条</li>
                  <li>✓ 鼻梁、下巴轮廓清晰</li>
                </ul>
              </div>
            </div>
            
            <!-- 通用提示 -->
            <div class="mt-4 bg-gray-50 rounded-xl p-4">
              <h4 class="font-medium text-gray-700 mb-2">💡 通用拍摄建议</h4>
              <ul class="text-sm text-gray-600 space-y-1 flex flex-wrap gap-x-6">
                <li>✓ 请在自然光线下拍摄</li>
                <li>✓ 不要化妆或使用滤镜</li>
                <li>✓ 支持 JPG、PNG 格式</li>
              </ul>
            </div>
            
            <!-- 上传进度 -->
            <div v-if="frontPhoto || sidePhoto" class="mt-6 bg-gray-50 rounded-xl p-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">已上传照片</span>
                <span class="font-medium" :class="bothPhotosUploaded ? 'text-green-600' : 'text-orange-500'">
                  {{ uploadedCount }}/2
                </span>
              </div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-300"
                  :class="bothPhotosUploaded ? 'bg-green-500' : 'bg-orange-400'"
                  :style="{ width: (uploadedCount / 2 * 100) + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- 下一步按钮 -->
            <button 
              @click="startAnalysis"
              :disabled="!bothPhotosUploaded || isAnalyzing"
              :class="[
                'w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all',
                bothPhotosUploaded && !isAnalyzing
                  ? 'btn-gradient text-white' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
            >
              {{ isAnalyzing ? '处理中...' : (bothPhotosUploaded ? '开始 AI 面诊' : '请上传两张照片') }}
            </button>
          </div>
        </div>

        <!-- 步骤2：分析中 -->
        <div v-else-if="currentStep === 1" key="analyzing" class="max-w-2xl mx-auto">
          <div class="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div class="relative w-32 h-32 mx-auto mb-6">
              <div class="absolute inset-0 bg-pink-200 rounded-full loading-ring"></div>
              <div class="absolute inset-2 bg-pink-300 rounded-full loading-ring" style="animation-delay: 0.3s"></div>
              <div class="absolute inset-4 bg-pink-400 rounded-full loading-ring" style="animation-delay: 0.6s"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-16 h-16 text-pink-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-800 mb-2">AI 正在分析中...</h2>
            <p class="text-gray-500 mb-6">{{ analysisStatus }}</p>
            
            <!-- 已上传照片预览 -->
            <div class="flex justify-center space-x-4 mb-6">
              <img v-if="frontPhoto" :src="frontPhoto" class="w-20 h-20 object-cover rounded-lg border-2 border-pink-200" />
              <img v-if="sidePhoto" :src="sidePhoto" class="w-20 h-20 object-cover rounded-lg border-2 border-blue-200" />
            </div>
            
            <div class="space-y-4 text-left max-w-md mx-auto">
              <div 
                v-for="(task, index) in analysisTasks" 
                :key="index"
                class="flex items-center space-x-3"
              >
                <div 
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                    task.status === 'done' ? 'bg-green-500' : 
                    task.status === 'processing' ? 'bg-pink-500 animate-pulse' : 'bg-gray-200'
                  ]"
                >
                  <svg v-if="task.status === 'done'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span :class="task.status === 'processing' ? 'text-pink-600 font-medium' : 'text-gray-600'">
                  {{ task.name }}
                </span>
              </div>
            </div>
            
            <!-- 错误提示 -->
            <div v-if="analysisError" class="mt-6 p-4 bg-red-50 rounded-xl text-red-600 text-sm">
              {{ analysisError }}
              <button @click="startAnalysis" class="ml-2 underline">重试</button>
            </div>
          </div>
        </div>

        <!-- 步骤3：分析报告 -->
        <div v-else-if="currentStep === 2" key="report" class="space-y-6">
          <!-- 总体评分 -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold">面诊报告</h2>
              <span class="text-sm text-gray-400">{{ new Date().toLocaleDateString() }}</span>
            </div>
            
            <!-- 总分 -->
            <div class="flex items-center justify-center space-x-8 mb-8">
              <div class="text-center">
                <div class="text-5xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                  {{ overallScore }}
                </div>
                <div class="text-gray-500 mt-1">综合评分</div>
              </div>
              <div class="w-px h-16 bg-gray-200"></div>
              <div class="text-center">
                <div class="text-5xl font-bold text-green-500">{{ goodItems.length }}</div>
                <div class="text-gray-500 mt-1">优势项</div>
              </div>
              <div class="w-px h-16 bg-gray-200"></div>
              <div class="text-center">
                <div class="text-5xl font-bold text-orange-500">{{ improveItems.length }}</div>
                <div class="text-gray-500 mt-1">待改善</div>
              </div>
            </div>
            
            <!-- 各维度评分 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                v-for="score in scores" 
                :key="score.name"
                class="bg-gradient-to-br rounded-2xl p-6 card-hover"
                :class="score.bgClass"
              >
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl">{{ score.icon }}</span>
                  <span class="text-3xl font-bold" :class="score.textClass">{{ score.value }}</span>
                </div>
                <h3 class="font-semibold text-gray-700 mb-2">{{ score.name }}</h3>
                <div class="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-1000"
                    :class="score.barClass"
                    :style="{ width: score.value + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 详细分析 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 皮肤问题 -->
            <div class="bg-white rounded-3xl shadow-xl p-6">
              <h3 class="text-lg font-bold flex items-center mb-4">
                <span class="text-2xl mr-2">🧴</span> 皮肤分析
              </h3>
              <div class="space-y-3">
                <div v-for="item in skinAnalysis" :key="item.name" class="flex items-center justify-between">
                  <span class="text-gray-600">{{ item.name }}</span>
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      item.level === '轻微' || item.level === '无' ? 'bg-green-100 text-green-600' :
                      item.level === '良好' ? 'bg-blue-100 text-blue-600' :
                      item.level === '中度' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    ]"
                  >
                    {{ item.level }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 五官轮廓 -->
            <div class="bg-white rounded-3xl shadow-xl p-6">
              <h3 class="text-lg font-bold flex items-center mb-4">
                <span class="text-2xl mr-2">👤</span> 轮廓分析
              </h3>
              <div class="space-y-3">
                <div v-for="item in contourAnalysis" :key="item.name" class="flex items-center justify-between">
                  <span class="text-gray-600">{{ item.name }}</span>
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      item.level === '优秀' ? 'bg-green-100 text-green-600' :
                      item.level === '良好' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    ]"
                  >
                    {{ item.level }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 抗衰分析 -->
          <div class="bg-white rounded-3xl shadow-xl p-6">
            <h3 class="text-lg font-bold flex items-center mb-4">
              <span class="text-2xl mr-2">⏳</span> 抗衰老分析
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="item in agingAnalysis" 
                :key="item.name"
                class="text-center p-4 rounded-xl"
                :class="item.bgClass"
              >
                <div class="text-3xl mb-2">{{ item.icon }}</div>
                <div class="text-sm text-gray-500">{{ item.name }}</div>
                <div class="font-bold mt-1" :class="item.textClass">{{ item.status }}</div>
              </div>
            </div>
          </div>
          
          <!-- 推荐方案 -->
          <div class="bg-gradient-to-br from-pink-500 to-pink-400 rounded-3xl shadow-xl p-8 text-white">
            <h3 class="text-xl font-bold mb-6 flex items-center">
              <span class="text-2xl mr-2">💎</span> 专属改善方案
            </h3>
            <div class="space-y-4">
              <div 
                v-for="(rec, index) in recommendations" 
                :key="index"
                class="bg-white/20 backdrop-blur rounded-xl p-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold">{{ rec.title }}</h4>
                    <p class="text-sm text-white/80 mt-1">{{ rec.description }}</p>
                    <div v-if="rec.estimatedSessions" class="text-xs text-white/60 mt-2">
                      疗程：{{ rec.estimatedSessions }} | {{ rec.interval }} | {{ rec.price }}
                    </div>
                  </div>
                  <span class="bg-white/30 px-3 py-1 rounded-full text-sm ml-2">{{ rec.priority }}</span>
                </div>
              </div>
            </div>
            
            <!-- 综合建议 -->
            <div v-if="overallAdvice" class="mt-6 p-4 bg-white/10 rounded-xl">
              <h4 class="font-semibold mb-2">📝 综合建议</h4>
              <p class="text-sm text-white/90">{{ overallAdvice }}</p>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex justify-center space-x-4">
            <button 
              @click="resetAll"
              class="px-8 py-3 bg-white text-pink-500 rounded-xl font-semibold hover:bg-pink-50 transition-colors"
            >
              重新面诊
            </button>
            <button 
              class="px-8 py-3 btn-gradient text-white rounded-xl font-semibold"
            >
              保存报告
            </button>
          </div>
        </div>
      </transition>
    </main>
    
    <!-- 底部 -->
    <footer class="text-center py-6 text-gray-400 text-sm">
      <p>⚠️ 本报告仅供参考，不构成医疗建议</p>
      <p class="mt-1">如有皮肤问题，请咨询专业医生</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { analyzeFace } from './api.js'

// 步骤
const steps = ['拍照上传', 'AI分析', '查看报告']
const currentStep = ref(0)

// 上传相关
const frontInput = ref(null)
const sideInput = ref(null)
const frontPhoto = ref(null)
const sidePhoto = ref(null)
const draggingFront = ref(false)
const draggingSide = ref(false)

// 分析状态
const isAnalyzing = ref(false)
const analysisError = ref(null)
const analysisStatus = ref('请稍候，正在为您进行专业面诊')

// 计算属性
const bothPhotosUploaded = computed(() => frontPhoto.value && sidePhoto.value)
const uploadedCount = computed(() => {
  let count = 0
  if (frontPhoto.value) count++
  if (sidePhoto.value) count++
  return count
})

// 分析任务
const analysisTasks = ref([
  { name: '识别面部特征', status: 'pending' },
  { name: '分析皮肤状态', status: 'pending' },
  { name: '评估轮廓比例', status: 'pending' },
  { name: '检测衰老迹象', status: 'pending' },
  { name: '生成改善方案', status: 'pending' },
])

// 评分数据
const scores = ref([
  { name: '皮肤状态', value: 0, icon: '🧴', bgClass: 'from-pink-50 to-pink-100', textClass: 'text-pink-500', barClass: 'bg-pink-500' },
  { name: '轮廓比例', value: 0, icon: '👤', bgClass: 'from-blue-50 to-blue-100', textClass: 'text-blue-500', barClass: 'bg-blue-500' },
  { name: '抗衰指数', value: 0, icon: '⏳', bgClass: 'from-purple-50 to-purple-100', textClass: 'text-purple-500', barClass: 'bg-purple-500' },
])

// 总评分
const overallScore = computed(() => {
  const avg = scores.value.reduce((sum, s) => sum + s.value, 0) / scores.value.length
  return Math.round(avg)
})

// 优势项和待改善项
const goodItems = computed(() => scores.value.filter(s => s.value >= 80))
const improveItems = computed(() => scores.value.filter(s => s.value < 80))

// 皮肤分析
const skinAnalysis = ref([])

// 轮廓分析
const contourAnalysis = ref([])

// 抗衰分析
const agingAnalysis = ref([])

// 推荐方案
const recommendations = ref([])

// 综合建议
const overallAdvice = ref('')

// 方法
const triggerUpload = (type) => {
  if (type === 'front') {
    frontInput.value?.click()
  } else {
    sideInput.value?.click()
  }
}

const handleFileSelect = (e, type) => {
  const file = e.target.files[0]
  if (file) {
    loadImage(file, type)
  }
}

const handleDrop = (e, type) => {
  if (type === 'front') {
    draggingFront.value = false
  } else {
    draggingSide.value = false
  }
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file, type)
  }
}

const loadImage = (file, type) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    if (type === 'front') {
      frontPhoto.value = e.target.result
    } else {
      sidePhoto.value = e.target.result
    }
  }
  reader.readAsDataURL(file)
}

const clearPhoto = (type) => {
  if (type === 'front') {
    frontPhoto.value = null
    if (frontInput.value) frontInput.value.value = ''
  } else {
    sidePhoto.value = null
    if (sideInput.value) sideInput.value.value = ''
  }
}

const resetAll = () => {
  frontPhoto.value = null
  sidePhoto.value = null
  currentStep.value = 0
  analysisError.value = null
  isAnalyzing.value = false
  // 重置分析任务状态
  analysisTasks.value.forEach(task => task.status = 'pending')
}

const startAnalysis = async () => {
  if (!bothPhotosUploaded.value || isAnalyzing.value) return
  
  isAnalyzing.value = true
  analysisError.value = null
  currentStep.value = 1
  
  try {
    // 启动任务动画
    const taskInterval = setInterval(() => {
      for (const task of analysisTasks.value) {
        if (task.status === 'pending') {
          task.status = 'processing'
          analysisStatus.value = task.name + '...'
          break
        } else if (task.status === 'processing') {
          task.status = 'done'
          break
        }
      }
    }, 500)
    
    // 调用API
    const result = await analyzeFace(frontPhoto.value, sidePhoto.value)
    
    clearInterval(taskInterval)
    
    if (result.success && result.data) {
      const data = result.data
      
      // 更新评分
      if (data.scores) {
        scores.value[0].value = data.scores.skin?.value || 0
        scores.value[1].value = data.scores.contour?.value || 0
        scores.value[2].value = data.scores.antiAging?.value || 0
      }
      
      // 更新皮肤分析
      if (data.skinAnalysis) {
        skinAnalysis.value = data.skinAnalysis
      }
      
      // 更新轮廓分析
      if (data.contourAnalysis) {
        contourAnalysis.value = data.contourAnalysis
      }
      
      // 更新抗衰分析
      if (data.agingAnalysis) {
        agingAnalysis.value = data.agingAnalysis.map(item => ({
          ...item,
          bgClass: item.status === '无' || item.status === '轻微' ? 'bg-green-50' : 
                   item.status === '清晰' || item.status === '良好' ? 'bg-yellow-50' : 'bg-red-50',
          textClass: item.status === '无' || item.status === '轻微' ? 'text-green-600' : 
                     item.status === '清晰' || item.status === '良好' ? 'text-yellow-600' : 'text-red-600'
        }))
      }
      
      // 更新推荐方案
      if (data.recommendations) {
        recommendations.value = data.recommendations
      }
      
      // 更新综合建议
      overallAdvice.value = data.overallAdvice || ''
      
      // 完成所有任务
      analysisTasks.value.forEach(task => task.status = 'done')
      
      // 延迟跳转
      setTimeout(() => {
        currentStep.value = 2
      }, 500)
    } else {
      throw new Error('分析结果无效')
    }
    
  } catch (error) {
    console.error('分析失败:', error)
    analysisError.value = '分析失败：' + error.message + '，请检查后端服务是否启动'
    isAnalyzing.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

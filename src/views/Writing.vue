<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getUserLevel, hasFeatureAccess } from '../store/userLevel';
import { getSyllabusBySubject } from '../store/examSyllabus';
import { getTemplatesByLevelAndSubject, getTemplateById } from '../store/paperTemplates';
import type { PaperTemplate } from '../store/paperTemplates';
import RichTextEditor from '../components/RichTextEditor.vue';
import { useWordCount } from '../composables/useWordCount';

// 论文写作区域配置
const writingConfig = reactive({
  title: '论文写作',
  wordCount: 0,
  timeRemaining: 120 * 60, // 120分钟
  autoSaveInterval: 60, // 自动保存间隔（秒）
  isAutoSaving: false,
  lastSaveTime: '' // 最后保存时间
});

// 论文内容
const initialPaperContent = {
  title: '',
  background: '',
  problemAnalysis: '',
  solution: '',
  implementation: '',
  results: '',
  conclusion: ''
};

const { formData: paperContent, wordCount: paperWordCount, updateWordCount } = useWordCount(initialPaperContent);

// 同步到writingConfig的wordCount
watch(paperWordCount, (newCount: number) => {
  writingConfig.wordCount = newCount;
});

// 写作区域
const activeSection = ref('background');

// 用户等级信息
const userLevel = getUserLevel();

// 模板相关
const showTemplatesModal = ref(false);
const availableTemplates = ref<PaperTemplate[]>([]);

// 考试大纲相关
const showSyllabusModal = ref(false);
const examSyllabus = ref(getSyllabusBySubject('系统架构设计师'));

// 初始化模板列表
const initTemplates = () => {
  // 从localStorage获取用户选择的科目
  const examInfo = localStorage.getItem('examInfo');
  let subject = '系统架构设计师';
  if (examInfo) {
    try {
      const parsedInfo = JSON.parse(examInfo);
      subject = parsedInfo.examType || '系统架构设计师';
    } catch (e) {
      console.error('Failed to parse examInfo from localStorage:', e);
      subject = '系统架构设计师';
    }
  }
  
  // 根据用户等级和科目获取可用模板
  availableTemplates.value = getTemplatesByLevelAndSubject(userLevel.id as any, subject);
  
  // 获取对应的考试大纲
  examSyllabus.value = getSyllabusBySubject(subject);
};

// 应用模板
const applyTemplate = (templateId: string) => {
  const template = getTemplateById(templateId);
  if (template) {
    // 应用模板内容
    Object.assign(paperContent.value, template.content);
    // 更新字数统计
    updateWordCount();
    // 关闭模板选择模态框
    showTemplatesModal.value = false;
  }
};

// 打开模板选择
const openTemplatesModal = () => {
  initTemplates();
  showTemplatesModal.value = true;
};

// 打开考试大纲
const openSyllabusModal = () => {
  initTemplates();
  showSyllabusModal.value = true;
};

// 格式化时间
const formattedTime = computed(() => {
  const mins = Math.floor(writingConfig.timeRemaining / 60);
  const secs = writingConfig.timeRemaining % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});



// 自动保存
const autoSave = () => {
  writingConfig.isAutoSaving = true;
  // 保存到本地存储
  localStorage.setItem('paperContent', JSON.stringify(paperContent.value));
  // 更新最后保存时间
  const now = new Date();
  writingConfig.lastSaveTime = now.toLocaleTimeString();
  setTimeout(() => {
    writingConfig.isAutoSaving = false;
  }, 1000);
};

// 切换写作区域
const switchSection = (section: string) => {
  activeSection.value = section;
};

// 加载论文内容
const loadPaperContent = () => {
  const savedContent = localStorage.getItem('paperContent');
  if (savedContent) {
    try {
      const parsedContent = JSON.parse(savedContent);
      Object.assign(paperContent.value, parsedContent);
      updateWordCount();
    } catch (error) {
      console.error('Failed to parse paperContent from localStorage:', error);
      // 如果解析失败，使用默认值
      Object.keys(initialPaperContent).forEach(key => {
        const typedKey = key as keyof typeof initialPaperContent;
        (paperContent.value as any)[typedKey] = initialPaperContent[typedKey];
      });
      updateWordCount();
    }
  }
};

// 倒计时定时器
let countdownTimer: number | null = null;

// 开始倒计时
const startCountdown = () => {
  countdownTimer = window.setInterval(() => {
    if (writingConfig.timeRemaining > 0) {
      writingConfig.timeRemaining--;
    } else {
      // 时间到
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
      alert('考试时间结束！');
    }
  }, 1000);
};

// 自动保存定时器
let autoSaveTimer: number | null = null;

// 路由器实例
const router = useRouter();

// 提交状态
const isSubmitting = ref(false);

// 开始自动保存
const startAutoSave = () => {
  autoSaveTimer = window.setInterval(() => {
    autoSave();
  }, writingConfig.autoSaveInterval * 1000);
};

// 提交论文
const submitPaper = async () => {
  isSubmitting.value = true;
  try {
    // 保存论文内容
    autoSave();
    
    // 验证论文内容
    const contentValues = Object.values(paperContent.value);
    const hasContent = contentValues.some(content => content && content.trim());
    
    if (!hasContent) {
      alert('请先填写论文内容再提交！');
      isSubmitting.value = false;
      return;
    }
    
    // 模拟提交过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 显示提交成功提示
    alert('论文提交成功！');
    
    // 清除本地存储的内容
    localStorage.removeItem('paperContent');
    
    // 跳转到提交成功页面
    router.push('/paper-submit-success');
    
  } catch (error) {
    console.error('提交论文时发生错误:', error);
    alert('提交失败，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
};

// 页面加载时检查是否有保存的内容或选定的模板
onMounted(() => {
  // 首先检查是否有选定的模板
  const selectedTemplate = localStorage.getItem('selectedTemplate');
  if (selectedTemplate) {
    try {
      const template = JSON.parse(selectedTemplate);
      // 根据模板初始化内容
      const templateBasedContent: any = {};
      template.sections.forEach((section: any) => {
        templateBasedContent[section.id] = section.placeholder || '';
      });
      paperContent.value = { ...paperContent.value, ...templateBasedContent };
      
      // 清除已使用的模板
      localStorage.removeItem('selectedTemplate');
    } catch (error) {
      console.error('Failed to parse template:', error);
    }
  } else {
    // 如果没有模板，则尝试恢复之前保存的内容
    loadPaperContent();
  }
  
  // 开始倒计时
  startCountdown();
  // 开始自动保存
  startAutoSave();
});
</script>

<template>
  <div class="writing-container">
    <!-- 顶部导航栏 -->
    <header class="writing-header card mb-md">
      <div class="header-left pl-md">
        <h1 class="title m-0">{{ writingConfig.title }}</h1>
      </div>
      <div class="header-right flex-between pr-md">
          <div class="info-item mr-md">
            <span class="label">字数统计:</span>
            <span class="value">{{ writingConfig.wordCount }}</span>
          </div>
          <div class="info-item mr-md">
            <span class="label">剩余时间:</span>
            <span class="value time">{{ formattedTime }}</span>
          </div>
          <div class="info-item auto-save mr-md" v-if="writingConfig.isAutoSaving">
            <span class="label">自动保存中...</span>
          </div>
          <div class="info-item mr-md" v-else-if="writingConfig.lastSaveTime">
            <span class="label">最后保存:</span>
            <span class="value saved">{{ writingConfig.lastSaveTime }}</span>
          </div>
        </div>
        <div class="header-actions flex-between">
          <button 
            class="btn btn-secondary mr-md" 
            @click="openSyllabusModal"
            title="查看考试大纲"
          >
            考试大纲
          </button>
          <button 
            class="btn btn-primary" 
            @click="openTemplatesModal"
            title="选择模板"
            :disabled="!hasFeatureAccess('基础模板库')"
          >
            选择模板
          </button>
        </div>
    </header>

    <!-- 主要内容区 -->
    <main class="writing-main">
      <!-- 左侧导航 -->
      <aside class="section-nav">
        <h3>论文结构</h3>
        <ul class="nav-list">
          <li 
            class="nav-item" 
            :class="{ active: activeSection === 'title' }"
            @click="switchSection('title')"
          >
            <span class="section-icon">📋</span>
            <span class="section-name">论文标题</span>
          </li>
          <li 
            class="nav-item" 
            :class="{ active: activeSection === 'background' }"
            @click="switchSection('background')"
          >
            <span class="section-icon">📝</span>
            <span class="section-name">项目背景</span>
          </li>
          <li 
            class="nav-item" 
            :class="{ active: activeSection === 'problemAnalysis' }"
            @click="switchSection('problemAnalysis')"
          >
            <span class="section-icon">🔍</span>
            <span class="section-name">问题分析</span>
          </li>
          <li 
            class="nav-item" 
            :class="{ active: activeSection === 'solution' }"
            @click="switchSection('solution')"
          >
            <span class="section-icon">💡</span>
            <span class="section-name">解决方案</span>
          </li>
          <li 
            class="nav-item" 
            :class="{ active: activeSection === 'implementation' }"
            @click="switchSection('implementation')"
          >
            <span class="section-icon">⚙️</span>
            <span class="section-name">实施过程</span>
          </li>
          <li 
            class="nav-item" 
            :class="{ active: activeSection === 'results' }"
            @click="switchSection('results')"
          >
            <span class="section-icon">📊</span>
            <span class="section-name">实施效果</span>
          </li>
          <li 
            class="nav-item" 
            :class="{ active: activeSection === 'conclusion' }"
            @click="switchSection('conclusion')"
          >
            <span class="section-icon">🏁</span>
            <span class="section-name">结论与展望</span>
          </li>
        </ul>
      </aside>

      <!-- 右侧写作区域 -->
      <section class="writing-area">
        <!-- 论文标题 -->
        <div v-if="activeSection === 'title'" class="section-content">
          <h2 class="section-title">论文标题</h2>
          <input 
            type="text" 
            class="title-input" 
            v-model="paperContent.title"
            placeholder="请输入论文标题"
            @input="updateWordCount"
          />
        </div>

        <!-- 项目背景 -->
        <div v-else-if="activeSection === 'background'" class="section-content">
          <h2 class="section-title">项目背景</h2>
          <RichTextEditor
            v-model:modelValue="paperContent.background"
            placeholder="请描述项目的背景、目标、规模等信息..."
            @change="updateWordCount"
          />
        </div>

        <!-- 问题分析 -->
        <div v-else-if="activeSection === 'problemAnalysis'" class="section-content">
          <h2 class="section-title">问题分析</h2>
          <RichTextEditor
            v-model:modelValue="paperContent.problemAnalysis"
            placeholder="请分析项目中遇到的主要问题和挑战..."
            @change="updateWordCount"
          />
        </div>

        <!-- 解决方案 -->
        <div v-else-if="activeSection === 'solution'" class="section-content">
          <h2 class="section-title">解决方案</h2>
          <RichTextEditor
            v-model:modelValue="paperContent.solution"
            placeholder="请阐述架构设计思路和解决方案..."
            @change="updateWordCount"
          />
        </div>

        <!-- 实施过程 -->
        <div v-else-if="activeSection === 'implementation'" class="section-content">
          <h2 class="section-title">实施过程</h2>
          <RichTextEditor
            v-model:modelValue="paperContent.implementation"
            placeholder="请描述方案的实施过程和关键技术点..."
            @change="updateWordCount"
          />
        </div>

        <!-- 实施效果 -->
        <div v-else-if="activeSection === 'results'" class="section-content">
          <h2 class="section-title">实施效果</h2>
          <RichTextEditor
            v-model:modelValue="paperContent.results"
            placeholder="请分析项目实施后的效果和效益..."
            @change="updateWordCount"
          />
        </div>

        <!-- 结论与展望 -->
        <div v-else-if="activeSection === 'conclusion'" class="section-content">
          <h2 class="section-title">结论与展望</h2>
          <RichTextEditor
            v-model:modelValue="paperContent.conclusion"
            placeholder="请总结经验教训，对未来发展进行展望..."
            @change="updateWordCount"
          />
        </div>
      </section>
    </main>

    <!-- 底部操作栏 -->
    <footer class="writing-footer">
      <div class="footer-left">
        <button class="btn secondary" @click="autoSave">手动保存</button>
      </div>
      <div class="footer-right">
        <button class="btn primary" @click="submitPaper" :disabled="isSubmitting">
          <span v-if="isSubmitting">提交中...</span>
          <span v-else>提交论文</span>
        </button>
      </div>
    </footer>

    <!-- 模板选择模态框 -->
    <div class="modal-overlay" v-if="showTemplatesModal" @click="showTemplatesModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>选择论文模板</h2>
          <button class="close-btn" @click="showTemplatesModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="user-level-info">
            <h3>当前用户等级：{{ userLevel.name }}</h3>
            <p>{{ userLevel.description }}</p>
          </div>
          <div class="templates-grid">
            <div 
              v-for="template in availableTemplates" 
              :key="template.id"
              class="template-card"
            >
              <h4>{{ template.title }}</h4>
              <p class="template-desc">{{ template.description }}</p>
              <button 
                class="apply-btn" 
                @click="applyTemplate(template.id)"
              >
                应用模板
              </button>
            </div>
          </div>
          <div v-if="availableTemplates.length === 0" class="no-templates">
            暂无可用模板
          </div>
        </div>
      </div>
    </div>

    <!-- 考试大纲模态框 -->
    <div class="modal-overlay" v-if="showSyllabusModal" @click="showSyllabusModal = false">
      <div class="modal-content syllabus-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ examSyllabus?.title }}</h2>
          <button class="close-btn" @click="showSyllabusModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="examSyllabus" class="syllabus-content">
            <section class="syllabus-section">
              <h3>考试要求</h3>
              <ul>
                <li v-for="req in examSyllabus.requirements" :key="req.id">
                  <strong>{{ req.title }}</strong> - {{ req.description }}
                  <span class="importance" :class="req.importance">{{ req.importance === 'high' ? '重要' : req.importance === 'medium' ? '一般' : '次要' }}</span>
                </li>
              </ul>
            </section>
            
            <section class="syllabus-section">
              <h3>评分标准</h3>
              <ul class="scoring-list">
                <li v-for="criterion in examSyllabus.scoringCriteria" :key="criterion.id">
                  <div class="scoring-item">
                    <span class="scoring-category">{{ criterion.category }}</span>
                    <span class="scoring-weight">{{ criterion.weight }}%</span>
                  </div>
                  <p class="scoring-desc">{{ criterion.description }}</p>
                </li>
              </ul>
            </section>
            
            <section class="syllabus-section">
              <h3>论文结构</h3>
              <div class="structure-grid">
                <div 
                  v-for="section in examSyllabus.paperStructure" 
                  :key="section.id"
                  class="structure-item"
                >
                  <h4>{{ section.title }}</h4>
                  <p>{{ section.description }}</p>
                  <div class="word-count-hint">
                    字数要求：{{ section.minWordCount }}-{{ section.maxWordCount }}字
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div v-else class="no-syllabus">
            暂无考试大纲信息
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.writing-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.writing-header {
  background-color: #2563eb;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.info-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

.label {
  font-weight: 500;
}

.value {
  font-weight: 600;
}

.value.time {
  background-color: #ff6b6b;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 16px;
}

.value.saved {
  color: #10b981;
  font-weight: 600;
}

.auto-save {
  color: #d1d5db;
  font-style: italic;
}

.writing-main {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .writing-main {
    flex-direction: column;
    padding: 10px;
  }
  
  .section-nav {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .nav-list {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 10px;
  }
  
  .nav-item {
    flex-shrink: 0;
    min-width: 150px;
    margin-bottom: 0;
  }
  
  .writing-area {
    padding: 20px;
  }
  
  .header-right {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .writing-footer {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}

.section-nav {
  width: 250px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-nav h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #374151;
  font-size: 18px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  border: 1px solid transparent;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
  font-weight: 500;
}

.section-icon {
  font-size: 18px;
}

.section-name {
  flex: 1;
  font-size: 14px;
}

.writing-area {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-content {
  width: 100%;
}

.section-title {
  font-size: 24px;
  color: #1f2937;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 600;
}

.title-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  transition: border-color 0.2s;
}

.title-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.content-textarea {
  width: 100%;
  padding: 20px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  resize: vertical;
  transition: border-color 0.2s;
  font-family: inherit;
}

.content-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.writing-footer {
  background-color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background-color: #2563eb;
  color: white;
}

.btn.primary:hover {
  background-color: #1d4ed8;
}

.btn.secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn.secondary:hover {
  background-color: #e5e7eb;
}

/* 顶部操作按钮 */
.header-actions {
  display: flex;
  gap: 10px;
  margin-left: 20px;
}

.header-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.header-btn.primary {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}

.header-btn:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
}

.header-btn.primary:hover:not(:disabled) {
  background-color: #1d4ed8;
  color: white;
}

.header-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.syllabus-modal {
  max-width: 1000px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f3f4f6;
}

.modal-body {
  padding: 20px;
}

/* 用户等级信息 */
.user-level-info {
  background-color: #eff6ff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #2563eb;
}

.user-level-info h3 {
  margin: 0 0 8px 0;
  color: #1e40af;
}

.user-level-info p {
  margin: 0;
  color: #374151;
  font-size: 14px;
}

/* 模板网格 */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.template-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
  cursor: pointer;
}

.template-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.template-card h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 18px;
}

.template-desc {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.apply-btn {
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn:hover {
  background-color: #1d4ed8;
}

.no-templates {
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
  font-size: 16px;
}

/* 考试大纲样式 */
.syllabus-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.syllabus-section {
  margin-bottom: 20px;
}

.syllabus-section h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 20px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.syllabus-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.syllabus-section li {
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #2563eb;
}

.importance {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
}

.importance.high {
  background-color: #fee2e2;
  color: #991b1b;
}

.importance.medium {
  background-color: #fef3c7;
  color: #92400e;
}

.importance.low {
  background-color: #d1fae5;
  color: #065f46;
}

/* 评分标准 */
.scoring-list li {
  background-color: white;
  border: 1px solid #e5e7eb;
}

.scoring-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.scoring-category {
  font-weight: 600;
  color: #1f2937;
}

.scoring-weight {
  font-weight: 700;
  color: #2563eb;
}

.scoring-desc {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* 论文结构 */
.structure-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.structure-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
}

.structure-item h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 16px;
}

.structure-item p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.word-count-hint {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
  background-color: #eff6ff;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.no-syllabus {
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
  font-size: 16px;
}

/* 更新响应式设计 */
@media (max-width: 768px) {
  .header-actions {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
    justify-content: center;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .structure-grid {
    grid-template-columns: 1fr;
  }
}
</style>
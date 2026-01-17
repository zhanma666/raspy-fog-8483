<script setup lang="ts">
import { ref, reactive } from 'vue';

// 智能校验类型
const checkTypes = [
  { value: 'project_scale', label: '项目规模智能校验' },
  { value: 'background_analysis', label: '项目背景段检查' },
  { value: 'transition_check', label: '过渡段检查' },
  { value: 'conclusion_check', label: '结尾段检查' },
  { value: 'management_check', label: '十大管理检查' }
];

// 表单数据
const formData = reactive({
  checkType: 'project_scale',
  content: '',
  contentSource: 'manual' // manual, auto (from writing page)
});

// 校验结果
const result = ref({
  isLoading: false,
  success: false,
  message: '',
  score: 0, // 校验评分
  type: '', // 校验类型
  suggestions: [] as string[],
  strengths: [] as string[], // 优点
  weaknesses: [] as string[], // 缺点
  improvement: [] as string[], // 改进方向
  keywords: [] as string[], // 提取的关键词
  wordCount: 0 // 字数统计
});

// 从写作页面获取内容
const getContentFromWriting = () => {
  const savedContent = localStorage.getItem('paperContent');
  if (savedContent) {
    try {
      const parsedContent = JSON.parse(savedContent);
      // 根据校验类型自动选择对应的内容段
      switch (formData.checkType) {
        case 'background_analysis':
          formData.content = parsedContent.background || '';
          break;
        case 'transition_check':
          // 合并背景和问题分析作为过渡段检查
          formData.content = `${parsedContent.background || ''}\n\n${parsedContent.problemAnalysis || ''}`;
          break;
        case 'conclusion_check':
          formData.content = parsedContent.conclusion || '';
          break;
        case 'project_scale':
          // 项目规模检查使用整个论文内容
          formData.content = Object.values(parsedContent).join('\n\n');
          break;
        case 'management_check':
          // 管理检查使用解决方案和实施过程
          formData.content = `${parsedContent.solution || ''}\n\n${parsedContent.implementation || ''}`;
          break;
        default:
          formData.content = Object.values(parsedContent).join('\n\n');
      }
      formData.contentSource = 'auto';
    } catch (error) {
      console.error('Failed to parse saved content:', error);
    }
  } else {
    alert('未找到已保存的论文内容，请先在写作页面保存内容');
  }
};

// 根据评分获取样式类
const getScoreClass = (score: number): string => {
  if (score >= 90) return 'score-excellent';
  if (score >= 80) return 'score-good';
  if (score >= 70) return 'score-average';
  return 'score-poor';
};

// 执行智能校验
const executeCheck = () => {
  result.value.isLoading = true;
  result.value.success = false;
  result.value.message = '';
  result.value.suggestions = [];
  result.value.strengths = [];
  result.value.weaknesses = [];
  result.value.improvement = [];
  result.value.keywords = [];
  result.value.wordCount = formData.content.length;
  
  // 模拟校验过程
  setTimeout(() => {
    // 根据不同的校验类型生成不同的结果
    switch (formData.checkType) {
      case 'project_scale':
        result.value.success = true;
        result.value.score = 85;
        result.value.message = '项目规模校验完成';
        result.value.type = 'project_scale';
        result.value.strengths = [
          '项目背景金额设置合理',
          '人数配比符合行业标准',
          '项目目标明确'
        ];
        result.value.weaknesses = [
          '缺少项目周期描述',
          '项目复杂度分析不足',
          '技术栈选择理由不充分'
        ];
        result.value.improvement = [
          '增加项目周期和里程碑描述',
          '补充项目复杂度分析',
          '详细说明技术栈选择理由'
        ];
        result.value.keywords = ['项目规模', '技术架构', '团队配置', '项目目标'];
        break;
      case 'background_analysis':
        result.value.success = false;
        result.value.score = 72;
        result.value.message = '项目背景段检查完成，发现问题';
        result.value.type = 'background_analysis';
        result.value.strengths = [
          '业务需求描述清晰',
          '问题背景分析到位',
          '项目价值明确'
        ];
        result.value.weaknesses = [
          '项目背景描述不够新颖',
          '发起单位性质与项目表述匹配度较低',
          '技术架构描述不够详细',
          '存在2处语法错误'
        ];
        result.value.improvement = [
          '使用更具行业特色的背景描述',
          '调整发起单位性质与项目的匹配度',
          '补充技术架构细节',
          '修正语法错误'
        ];
        result.value.keywords = ['业务需求', '问题背景', '项目价值', '技术架构'];
        break;
      case 'transition_check':
        result.value.success = true;
        result.value.score = 88;
        result.value.message = '过渡段检查完成';
        result.value.type = 'transition_check';
        result.value.strengths = [
          '过渡段对于项目特点的表述合理',
          '上下文衔接自然',
          '逻辑关系清晰'
        ];
        result.value.weaknesses = [
          '过渡句类型单一',
          '缺少承上启下的连接词',
          '部分段落转换生硬'
        ];
        result.value.improvement = [
          '增加过渡句的多样性',
          '适当添加连接词增强逻辑性',
          '优化段落转换方式'
        ];
        result.value.keywords = ['过渡段', '上下文衔接', '逻辑关系', '连接词'];
        break;
      case 'conclusion_check':
        result.value.success = false;
        result.value.score = 75;
        result.value.message = '结尾段检查完成，发现问题';
        result.value.type = 'conclusion_check';
        result.value.strengths = [
          '总结了项目主要成果',
          '提及了项目经验教训',
          '结构完整'
        ];
        result.value.weaknesses = [
          '建设收益描述不够具体',
          '实施过程反思不够深入',
          '未来展望不够明确'
        ];
        result.value.improvement = [
          '使用具体数据描述建设收益',
          '深入分析实施过程中的问题和解决方法',
          '明确未来发展方向和改进计划'
        ];
        result.value.keywords = ['项目成果', '经验教训', '建设收益', '未来展望'];
        break;
      case 'management_check':
        result.value.success = true;
        result.value.score = 90;
        result.value.message = '十大管理检查完成';
        result.value.type = 'management_check';
        result.value.strengths = [
          '管理过程表述完整',
          '包含了作用和重要性描述',
          '实施过程描述清晰',
          '产出成果明确',
          '管理工具应用得当'
        ];
        result.value.weaknesses = [
          '风险管理措施不够具体',
          '质量管理方法描述简单',
          '缺少团队管理细节'
        ];
        result.value.improvement = [
          '补充具体的风险管理措施',
          '详细描述质量管理方法和工具',
          '增加团队管理和沟通协调的细节'
        ];
        result.value.keywords = ['项目管理', '风险管理', '质量管理', '团队管理'];
        break;
      default:
        result.value.success = true;
        result.value.score = 80;
        result.value.message = '校验完成';
        result.value.type = 'general';
        result.value.strengths = ['内容完整', '结构清晰', '逻辑连贯'];
        result.value.weaknesses = ['缺少具体案例', '分析深度不足'];
        result.value.improvement = ['增加具体案例支持', '深入分析问题本质'];
        result.value.keywords = ['内容结构', '逻辑分析', '案例支持'];
    }
    
    // 合并所有建议
    result.value.suggestions = [...result.value.strengths, ...result.value.weaknesses, ...result.value.improvement];
    
    result.value.isLoading = false;
  }, 1500);
};
</script>

<template>
  <div class="smart-check-container pt-md pb-md">
    <header class="header mb-md">
      <div class="container">
        <h1 class="title">智能校验</h1>
      </div>
    </header>
    
    <main class="main-content container">
      <div class="card form-section mb-md">
        <div class="card-header">
          <h2 class="m-0">校验设置</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="executeCheck" class="check-form">
            <div class="form-group">
              <label class="form-label">校验类型：</label>
              <select v-model="formData.checkType" class="form-input">
                <option v-for="type in checkTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">内容来源：</label>
              <div class="radio-group">
                <label class="radio-item mr-md">
                  <input type="radio" v-model="formData.contentSource" value="manual" /> 手动输入
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.contentSource" value="auto" @change="getContentFromWriting"/> 从写作页面获取
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">待校验内容：</label>
              <textarea 
                v-model="formData.content" 
                class="form-input" 
                :placeholder="getPlaceholderText()"
                rows="10"
                style="height: auto; min-height: 150px;"
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" :disabled="result.isLoading">
              <span v-if="result.isLoading">校验中...</span>
              <span v-else>开始校验</span>
            </button>
          </form>
        </div>
      </div>
      
      <!-- 校验结果显示 -->
      <div v-if="result.success" class="result-section card mb-md">
        <div class="card-header">
          <h2 class="m-0">校验结果</h2>
        </div>
        <div class="card-body">
          <div class="result-info mb-md">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">校验类型</div>
                <div class="info-value">{{ result.type }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">总字数</div>
                <div class="info-value">{{ result.wordCount }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">评分</div>
                <div class="info-value" :class="getScoreClass(result.score)">
                  {{ result.score }}分
                </div>
              </div>
            </div>
          </div>
          
          <!-- 详细结果 -->
          <div class="result-details">
            <div v-if="result.strengths && result.strengths.length > 0" class="result-section mb-md">
              <h3 class="subtitle">优点</h3>
              <ul class="result-list">
                <li v-for="(strength, index) in result.strengths" :key="index" class="result-item card">
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <div v-if="result.weaknesses && result.weaknesses.length > 0" class="result-section mb-md">
              <h3 class="subtitle">待改进之处</h3>
              <ul class="result-list">
                <li v-for="(weakness, index) in result.weaknesses" :key="index" class="result-item card">
                  {{ weakness }}
                </li>
              </ul>
            </div>
            
            <div v-if="result.improvement && result.improvement.length > 0" class="result-section mb-md">
              <h3 class="subtitle">改进建议</h3>
              <ul class="result-list">
                <li v-for="(item, index) in result.improvement" :key="index" class="result-item card">
                  {{ item }}
                </li>
              </ul>
            </div>
            
            <div v-if="result.keywords && result.keywords.length > 0" class="result-section">
              <h3 class="subtitle">提取的关键词</h3>
              <div class="keywords-container">
                <span 
                  class="keyword-tag btn btn-secondary mr-sm mb-sm" 
                  v-for="(keyword, index) in result.keywords" 
                  :key="index"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 智能校验面板 -->
      <SmartValidationPanel 
        v-if="formData.content" 
        :content="formData.content" 
        class="mb-md"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import SmartValidationPanel from '../components/SmartValidationPanel.vue';

// 智能校验类型
const checkTypes = [
  { value: 'project_scale', label: '项目规模智能校验' },
  { value: 'background_analysis', label: '项目背景段检查' },
  { value: 'transition_check', label: '过渡段检查' },
  { value: 'conclusion_check', label: '结尾段检查' },
  { value: 'management_check', label: '十大管理检查' }
];

// 表单数据
const formData = reactive({
  checkType: 'project_scale',
  content: '',
  contentSource: 'manual' // manual, auto (from writing page)
});

// 校验结果
const result = ref({
  isLoading: false,
  success: false,
  message: '',
  score: 0, // 校验评分
  type: '', // 校验类型
  suggestions: [] as string[],
  strengths: [] as string[], // 优点
  weaknesses: [] as string[], // 缺点
  improvement: [] as string[], // 改进方向
  keywords: [] as string[], // 提取的关键词
  wordCount: 0 // 字数统计
});

// 从写作页面获取内容
const getContentFromWriting = () => {
  const savedContent = localStorage.getItem('paperContent');
  if (savedContent) {
    try {
      const parsedContent = JSON.parse(savedContent);
      // 根据校验类型自动选择对应的内容段
      switch (formData.checkType) {
        case 'background_analysis':
          formData.content = parsedContent.background || '';
          break;
        case 'transition_check':
          // 合并背景和问题分析作为过渡段检查
          formData.content = `${parsedContent.background || ''}\n\n${parsedContent.problemAnalysis || ''}`;
          break;
        case 'conclusion_check':
          formData.content = parsedContent.conclusion || '';
          break;
        case 'project_scale':
          // 项目规模检查使用整个论文内容
          formData.content = Object.values(parsedContent).join('\n\n');
          break;
        case 'management_check':
          // 管理检查使用解决方案和实施过程
          formData.content = `${parsedContent.solution || ''}\n\n${parsedContent.implementation || ''}`;
          break;
        default:
          formData.content = Object.values(parsedContent).join('\n\n');
      }
      formData.contentSource = 'auto';
    } catch (error) {
      console.error('Failed to parse saved content:', error);
    }
  } else {
    alert('未找到已保存的论文内容，请先在写作页面保存内容');
  }
};

// 根据评分获取样式类
const getScoreClass = (score: number): string => {
  if (score >= 90) return 'score-excellent';
  if (score >= 80) return 'score-good';
  if (score >= 70) return 'score-average';
  return 'score-poor';
};

// 执行智能校验
const executeCheck = () => {
  result.value.isLoading = true;
  result.value.success = false;
  result.value.message = '';
  result.value.suggestions = [];
  result.value.strengths = [];
  result.value.weaknesses = [];
  result.value.improvement = [];
  result.value.keywords = [];
  result.value.wordCount = formData.content.length;
  
  // 模拟校验过程
  setTimeout(() => {
    // 根据不同的校验类型生成不同的结果
    switch (formData.checkType) {
      case 'project_scale':
        result.value.success = true;
        result.value.score = 85;
        result.value.message = '项目规模校验完成';
        result.value.type = '项目规模智能校验';
        result.value.strengths = [
          '项目规模设定合理，符合实际业务需求',
          '人员配置比例恰当，技术架构清晰',
          '预算估算详细，风险评估充分'
        ];
        result.value.weaknesses = [
          '项目周期预估可能过于乐观',
          '部分技术选型缺乏详细论证'
        ];
        result.value.improvement = [
          '建议增加项目周期缓冲时间',
          '补充技术选型对比分析'
        ];
        result.value.keywords = ['项目规模', '人员配置', '预算估算', '风险评估'];
        break;
      case 'background_analysis':
        result.value.success = true;
        result.value.score = 78;
        result.value.message = '项目背景分析完成';
        result.value.type = '项目背景段检查';
        result.value.strengths = [
          '项目背景描述清晰，目标明确',
          '业务需求分析较为全面',
          '技术挑战识别准确'
        ];
        result.value.weaknesses = [
          '项目发起单位介绍不够详细',
          '部分技术术语使用不够准确'
        ];
        result.value.improvement = [
          '补充项目发起单位背景介绍',
          '规范技术术语使用'
        ];
        result.value.keywords = ['项目背景', '业务需求', '技术挑战'];
        break;
      case 'transition_check':
        result.value.success = true;
        result.value.score = 92;
        result.value.message = '过渡段检查完成';
        result.value.type = '过渡段检查';
        result.value.strengths = [
          '段落间衔接自然流畅',
          '逻辑关系表达清晰',
          '过渡词使用恰当'
        ];
        result.value.weaknesses = [];
        result.value.improvement = [
          '可考虑增加更多对比分析'
        ];
        result.value.keywords = ['过渡段', '逻辑关系', '衔接自然'];
        break;
      case 'conclusion_check':
        result.value.success = true;
        result.value.score = 88;
        result.value.message = '结尾段检查完成';
        result.value.type = '结尾段检查';
        result.value.strengths = [
          '总结全面，涵盖要点',
          '未来展望具有前瞻性',
          '经验总结深刻'
        ];
        result.value.weaknesses = [
          '部分结论过于笼统'
        ];
        result.value.improvement = [
          '细化具体实施建议',
          '量化部分成果指标'
        ];
        result.value.keywords = ['总结', '展望', '经验'];
        break;
      case 'management_check':
        result.value.success = true;
        result.value.score = 80;
        result.value.message = '十大管理检查完成';
        result.value.type = '十大管理检查';
        result.value.strengths = [
          '项目管理过程描述完整',
          '工具和技术运用得当',
          '输入输出关系明确'
        ];
        result.value.weaknesses = [
          '部分管理过程关联性不够强',
          '个别环节缺少具体实例'
        ];
        result.value.improvement = [
          '加强各管理过程间的关联性',
          '补充更多具体实施案例'
        ];
        result.value.keywords = ['项目管理', '十大领域', '过程组'];
        break;
      default:
        result.value.success = true;
        result.value.score = 85;
        result.value.message = '校验完成';
        result.value.type = '综合校验';
        result.value.strengths = ['内容完整', '结构清晰'];
        result.value.weaknesses = ['部分细节需要完善'];
        result.value.improvement = ['细化部分内容'];
        result.value.keywords = ['综合', '内容', '结构'];
    }
    
    result.value.isLoading = false;
  }, 1500);
};

// 获取占位符文本
const getPlaceholderText = (): string => {
  switch (formData.checkType) {
    case 'project_scale':
      return '请输入项目规模相关信息，包括项目预算、人员配置、技术架构等内容...';
    case 'background_analysis':
      return '请输入项目背景相关信息，包括项目发起单位、项目目标、业务需求等内容...';
    case 'transition_check':
      return '请输入需要检查过渡段的内容...';
    case 'conclusion_check':
      return '请输入结尾段内容，包括总结、经验、展望等内容...';
    case 'management_check':
      return '请输入项目管理相关内容，包括十大管理领域的实施情况...';
    default:
      return '请输入需要校验的内容...';
  }
};
</script>
      
      <div class="check-result" v-if="result.message">
        <h2>校验结果</h2>
        <div class="result-header">
          <span class="result-message" :class="{ success: result.success, error: !result.success }">
            {{ result.message }}
          </span>
          <div class="result-meta">
            <span class="meta-item">
              <strong>评分：</strong>
              <span class="score" :class="getScoreClass(result.score)">{{ result.score }}分</span>
            </span>
            <span class="meta-item">
              <strong>字数：</strong>{{ result.wordCount }}字
            </span>
          </div>
        </div>
        
        <!-- 关键词标签 -->
        <div class="keywords-section" v-if="result.keywords.length > 0">
          <h3>提取关键词：</h3>
          <div class="keyword-tags">
            <span 
              v-for="(keyword, index) in result.keywords" 
              :key="index" 
              class="keyword-tag"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
        
        <!-- 校验详情卡片 -->
        <div class="result-cards">
          <!-- 优点卡片 -->
          <div class="result-card strengths-card">
            <h3 class="card-title">
              <span class="card-icon">✅</span>
              优点
            </h3>
            <ul class="card-list">
              <li v-for="(strength, index) in result.strengths" :key="index" class="card-item">
                {{ strength }}
              </li>
            </ul>
          </div>
          
          <!-- 缺点卡片 -->
          <div class="result-card weaknesses-card">
            <h3 class="card-title">
              <span class="card-icon">⚠️</span>
              问题
            </h3>
            <ul class="card-list">
              <li v-for="(weakness, index) in result.weaknesses" :key="index" class="card-item">
                {{ weakness }}
              </li>
            </ul>
          </div>
          
          <!-- 改进建议卡片 -->
          <div class="result-card improvement-card">
            <h3 class="card-title">
              <span class="card-icon">💡</span>
              改进建议
            </h3>
            <ul class="card-list">
              <li v-for="(item, index) in result.improvement" :key="index" class="card-item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.smart-check-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.smart-check-header {
  background-color: #2563eb;
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.smart-check-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.smart-check-main {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-check-main {
    flex-direction: column;
    padding: 10px;
  }
  
  .check-form,
  .check-result {
    padding: 20px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .btn.secondary.small {
    align-self: flex-start;
  }
}

.check-form {
  flex: 1;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.check-form h2 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.check-form p {
  margin-bottom: 20px;
  color: #6b7280;
  font-size: 14px;
}

.form-section {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.select {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;
  font-family: inherit;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.button-section {
  margin-top: 20px;
}

.btn.secondary.small {
  padding: 6px 12px;
  font-size: 12px;
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

.btn.primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  opacity: 0.7;
}

.check-result {
  flex: 1;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.check-result h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.result-header {
  margin-bottom: 20px;
}

.result-message {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 16px;
  font-weight: 600;
}

.result-message.success {
  background-color: #d1fae5;
  color: #065f46;
}

.result-message.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.suggestions h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #2563eb;
}

.suggestion-icon {
  font-size: 18px;
  margin-top: 2px;
}

.suggestion-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

/* 结果元数据 */
.result-meta {
  margin-top: 16px;
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 评分样式 */
.score {
  font-weight: 700;
  font-size: 18px;
  padding: 4px 12px;
  border-radius: 12px;
}

.score-excellent {
  color: #065f46;
  background-color: #d1fae5;
}

.score-good {
  color: #1e40af;
  background-color: #dbeafe;
}

.score-average {
  color: #92400e;
  background-color: #fef3c7;
}

.score-poor {
  color: #991b1b;
  background-color: #fee2e2;
}

/* 关键词标签 */
.keywords-section {
  margin-top: 24px;
}

.keywords-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  display: inline-block;
  padding: 6px 12px;
  background-color: #eff6ff;
  color: #2563eb;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.keyword-tag:hover {
  background-color: #dbeafe;
  transform: translateY(-1px);
}

/* 结果卡片 */
.result-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.result-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.result-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 不同类型卡片的边框颜色 */
.result-card.strengths-card {
  border-left: 4px solid #10b981;
}

.result-card.weaknesses-card {
  border-left: 4px solid #ef4444;
}

.result-card.improvement-card {
  border-left: 4px solid #3b82f6;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.card-icon {
  font-size: 20px;
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.card-item:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .result-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .result-cards {
    grid-template-columns: 1fr;
  }
  
  .keywords-section {
    margin-top: 20px;
  }
}
</style>
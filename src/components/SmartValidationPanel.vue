<template>
  <div class="smart-validation-panel">
    <div class="validation-header mb-md">
      <h3 class="title m-0">智能校验结果</h3>
      <div class="validation-summary flex-between">
        <div class="summary-item">
          <span class="summary-label">总字数:</span>
          <span class="summary-value">{{ analysisResult.wordCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">错误数:</span>
          <span class="summary-value error-count">{{ analysisResult.errors.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">可读性:</span>
          <span 
            class="summary-value" 
            :class="readabilityClass"
          >
            {{ analysisResult.readability }}分
          </span>
        </div>
      </div>
    </div>

    <div class="validation-results">
      <!-- 错误列表 -->
      <div class="validation-section mb-lg" v-if="analysisResult.errors.length > 0">
        <h4 class="subtitle mb-md">发现的错误</h4>
        <div 
          class="error-item card mb-sm" 
          v-for="(error, index) in analysisResult.errors" 
          :key="index"
        >
          <div class="error-header flex-between">
            <span class="error-type" :class="'type-' + error.type">{{ errorTypeLabels[error.type] }}</span>
            <span class="error-position">第{{ error.position }}位</span>
          </div>
          <div class="error-message">{{ error.message }}</div>
          <div class="error-suggestion mt-sm">
            <strong>建议:</strong> {{ error.suggestion }}
          </div>
        </div>
      </div>

      <!-- 建议列表 -->
      <div class="validation-section mb-lg" v-if="analysisResult.suggestions.length > 0">
        <h4 class="subtitle mb-md">改进建议</h4>
        <div 
          class="suggestion-item card mb-sm" 
          v-for="(suggestion, index) in analysisResult.suggestions" 
          :key="index"
        >
          <div class="suggestion-header flex-between">
            <span class="suggestion-type" :class="'type-' + suggestion.type">{{ suggestionTypeLabels[suggestion.type] }}</span>
            <span class="suggestion-position">第{{ suggestion.position }}位</span>
          </div>
          <div class="suggestion-message">{{ suggestion.message }}</div>
        </div>
      </div>

      <!-- 关键词提取 -->
      <div class="validation-section mb-lg" v-if="analysisResult.keywords.length > 0">
        <h4 class="subtitle mb-md">提取的关键词</h4>
        <div class="keywords-container">
          <span 
            class="keyword-tag btn btn-secondary mr-sm mb-sm" 
            v-for="(keyword, index) in analysisResult.keywords" 
            :key="index"
          >
            {{ keyword }}
          </span>
        </div>
      </div>

      <!-- 结构评估 -->
      <div class="validation-section" v-if="structureEvaluation">
        <h4 class="subtitle mb-md">论文结构评估</h4>
        <div class="structure-evaluation card">
          <div class="structure-item flex-between mb-sm">
            <span>引言部分</span>
            <span :class="structureEvaluation.hasIntroduction ? 'text-success' : 'text-warning'">
              {{ structureEvaluation.hasIntroduction ? '✓ 已包含' : '✗ 缺少' }}
            </span>
          </div>
          <div class="structure-item flex-between mb-sm">
            <span>正文部分</span>
            <span :class="structureEvaluation.hasBody ? 'text-success' : 'text-warning'">
              {{ structureEvaluation.hasBody ? '✓ 已包含' : '✗ 缺少' }}
            </span>
          </div>
          <div class="structure-item flex-between">
            <span>结论部分</span>
            <span :class="structureEvaluation.hasConclusion ? 'text-success' : 'text-warning'">
              {{ structureEvaluation.hasConclusion ? '✓ 已包含' : '✗ 缺少' }}
            </span>
          </div>
          <div class="structure-score mt-md pt-md border-top">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: structureEvaluation.structureScore + '%' }"
              ></div>
            </div>
            <div class="text-center mt-sm">
              结构完整性: <strong>{{ structureEvaluation.structureScore }}/100</strong>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 高级分析结果 -->
      <div class="validation-section" v-if="advancedAnalysis.basic.textLength > 0">
        <h4 class="subtitle mb-md">高级分析结果</h4>
        <div class="advanced-analysis card">
          <div class="analysis-overview mb-md">
            <div class="overview-grid">
              <div class="overview-item">
                <div class="overview-label">可读性</div>
                <div class="overview-value" :class="getScoreColor(advancedAnalysis.readability)">
                  {{ advancedAnalysis.readability }}/100
                </div>
              </div>
              <div class="overview-item">
                <div class="overview-label">连贯性</div>
                <div class="overview-value" :class="getScoreColor(advancedAnalysis.coherence)">
                  {{ advancedAnalysis.coherence }}/100
                </div>
              </div>
              <div class="overview-item">
                <div class="overview-label">主题相关性</div>
                <div class="overview-value" :class="getScoreColor(advancedAnalysis.topicRelevance)">
                  {{ advancedAnalysis.topicRelevance }}/100
                </div>
              </div>
            </div>
          </div>
          
          <!-- 词频分析 -->
          <div class="word-frequency-section mb-md" v-if="Object.keys(advancedAnalysis.wordFrequency).length > 0">
            <h5 class="subtitle mb-sm">高频词汇</h5>
            <div class="word-frequency-list">
              <div 
                class="word-frequency-item flex-between mb-xs" 
                v-for="(count, word) in advancedAnalysis.wordFrequency" 
                :key="word"
              >
                <span class="word">{{ word }}</span>
                <span class="count badge">{{ count }}</span>
              </div>
            </div>
          </div>
          
          <!-- 改进建议 -->
          <div class="improvement-suggestions" v-if="advancedAnalysis.suggestions.length > 0">
            <h5 class="subtitle mb-sm">AI改进建议</h5>
            <ul class="suggestions-list">
              <li 
                class="suggestion-item card mb-sm" 
                v-for="(suggestion, index) in advancedAnalysis.suggestions" 
                :key="index"
              >
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import ChineseTextAnalyzer from '@/utils/chineseTextAnalyzer';
import AdvancedChineseAnalyzer from '@/utils/advancedChineseAnalyzer';

// 定义props
interface Props {
  content: string;
}

const props = defineProps<Props>();

// 分析结果
const analysisResult = ref({
  wordCount: 0,
  charCount: 0,
  sentenceCount: 0,
  paragraphCount: 0,
  avgSentenceLength: 0,
  errors: [],
  suggestions: [],
  keywords: [],
  readability: 0
});

// 高级分析结果
const advancedAnalysis = ref({
  basic: {
    charCount: 0,
    wordCount: 0,
    sentenceCount: 0,
    paragraphCount: 0,
    avgSentenceLength: 0,
    textLength: 0
  },
  segments: [] as string[],
  wordFrequency: {} as Record<string, number>,
  readability: 0,
  coherence: 0,
  topicRelevance: 0,
  suggestions: [] as string[]
});

// 结构评估
const structureEvaluation = ref(null as any);

// 错误类型标签
const errorTypeLabels = {
  repeated: '重复字符',
  grammar: '语法错误',
  style: '风格问题',
  length: '长度问题'
};

// 建议类型标签
const suggestionTypeLabels = {
  improvement: '改进',
  enhancement: '增强',
  recommendation: '建议'
};

// 可读性等级
const readabilityClass = computed(() => {
  const score = analysisResult.value.readability;
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-danger';
});

// 监听内容变化并重新分析
watch(
  () => props.content,
  async (newContent) => {
    if (newContent) {
      // 使用防抖机制避免频繁分析
      setTimeout(async () => {
        try {
          analysisResult.value = ChineseTextAnalyzer.analyze(newContent);
          structureEvaluation.value = ChineseTextAnalyzer.evaluateStructure(newContent);
          
          // 执行高级分析
          advancedAnalysis.value = AdvancedChineseAnalyzer.analyze(newContent);
        } catch (error) {
          console.error('文本分析出错:', error);
        }
      }, 500);
    } else {
      // 清空结果
      analysisResult.value = {
        wordCount: 0,
        charCount: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        avgSentenceLength: 0,
        errors: [],
        suggestions: [],
        keywords: [],
        readability: 0
      };
      advancedAnalysis.value = {
        basic: {
          charCount: 0,
          wordCount: 0,
          sentenceCount: 0,
          paragraphCount: 0,
          avgSentenceLength: 0,
          textLength: 0
        },
        segments: [],
        wordFrequency: {},
        readability: 0,
        coherence: 0,
        topicRelevance: 0,
        suggestions: []
      };
      structureEvaluation.value = null;
    }
  },
  { immediate: true }
);

// 根据分数获取颜色类
const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-danger';
};
</script>

<style scoped>
.smart-validation-panel {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.validation-header {
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--spacing-md);
}

.validation-summary {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.summary-label {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

.summary-value {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-md);
}

.error-count {
  color: var(--danger-color);
}

.validation-section h4 {
  color: var(--text-primary);
  border-left: 3px solid var(--primary-color);
  padding-left: var(--spacing-sm);
}

.error-item, .suggestion-item {
  padding: var(--spacing-md);
}

.error-header, .suggestion-header {
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-light);
  margin-bottom: var(--spacing-sm);
}

.error-type, .suggestion-type {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.type-repeated { background-color: #fff2f0; color: #ff4d4f; }
.type-grammar { background-color: #fff2f0; color: #ff4d4f; }
.type-style { background-color: #fffbe6; color: #faad14; }
.type-length { background-color: #fffbe6; color: #faad14; }

.type-improvement { background-color: #e6f7ff; color: #1890ff; }
.type-enhancement { background-color: #f6ffed; color: #52c41a; }
.type-recommendation { background-color: #e6f7ff; color: #1890ff; }

.error-message, .suggestion-message {
  color: var(--text-secondary);
  line-height: 1.5;
}

.error-suggestion {
  padding: var(--spacing-sm);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--warning-color);
}

.keyword-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.structure-evaluation {
  padding: var(--spacing-md);
}

.structure-item {
  padding: var(--spacing-sm) 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-hover-color));
  transition: width 0.3s ease;
}

.border-top {
  border-top: 1px solid var(--border-light);
}

.text-success {
  color: var(--secondary-color);
}

.text-warning {
  color: var(--warning-color);
}

.text-danger {
  color: var(--danger-color);
}

/* 高级分析结果样式 */
.analysis-overview {
  padding: var(--spacing-md);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.overview-item {
  text-align: center;
  padding: var(--spacing-sm);
}

.overview-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.overview-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.word-frequency-list {
  max-height: 200px;
  overflow-y: auto;
  padding: var(--spacing-sm);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.word-frequency-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-bottom: 1px solid var(--border-light);
}

.word-frequency-item:last-child {
  border-bottom: none;
}

.word {
  font-weight: var(--font-weight-medium);
}

.count {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.suggestions-list {
  list-style: none;
  padding: 0;
}

.suggestion-item {
  padding: var(--spacing-md);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--primary-color);
}
</style>
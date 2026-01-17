<script setup lang="ts">
import { ref, reactive } from 'vue';

// 真题分类
const categories = [
  { value: 'all', label: '全部' },
  { value: 'system_arch', label: '系统架构设计师' },
  { value: 'sys_analyst', label: '系统分析师' },
  { value: 'project_manager', label: '信息系统项目管理师' }
];

// 真题数据（模拟）
const questions = reactive([
  {
    id: 1,
    category: 'system_arch',
    year: '2025',
    period: '上半年',
    title: '基于微服务架构的企业级应用设计',
    content: '请结合您在项目中使用微服务架构的实践经验，论述：\n1. 微服务架构的核心概念和设计原则\n2. 微服务架构在企业级应用中的优势和挑战\n3. 如何设计和实现微服务之间的通信机制\n4. 微服务架构的部署和监控策略\n5. 微服务架构的安全性设计'
  },
  {
    id: 2,
    category: 'project_manager',
    year: '2025',
    period: '下半年',
    title: '大型信息系统项目的风险管理',
    content: '请结合您在大型信息系统项目中的实践经验，论述：\n1. 大型信息系统项目的风险特点\n2. 风险识别和评估的方法\n3. 风险应对策略的制定\n4. 风险监控和控制的实践\n5. 如何处理项目中的突发风险'
  },
  {
    id: 3,
    category: 'sys_analyst',
    year: '2024',
    period: '上半年',
    title: '基于大数据的企业决策支持系统设计',
    content: '请结合您在大数据项目中的实践经验，论述：\n1. 大数据决策支持系统的架构设计\n2. 数据采集、存储和处理的技术选型\n3. 数据分析和可视化的实现方法\n4. 系统性能优化的策略\n5. 系统安全和隐私保护机制'
  }
]);

// 当前筛选条件
const currentFilter = ref('all');

// 筛选后的真题
const filteredQuestions = ref(questions);

// 选中的真题
const selectedQuestion = ref(null as typeof questions[0] | null);

// 筛选真题
const filterQuestions = () => {
  if (currentFilter.value === 'all') {
    filteredQuestions.value = questions;
  } else {
    filteredQuestions.value = questions.filter(q => q.category === currentFilter.value);
  }
  // 清除选中的真题
  selectedQuestion.value = null;
};

// 查看真题详情
const viewQuestion = (question: typeof questions[0]) => {
  selectedQuestion.value = question;
};

// 返回真题列表
const backToList = () => {
  selectedQuestion.value = null;
};
</script>

<template>
  <div class="question-bank-container">
    <!-- 顶部导航栏 -->
    <header class="question-bank-header">
      <h1>真题题库</h1>
    </header>

    <!-- 主要内容区 -->
    <main class="question-bank-main">
      <div v-if="!selectedQuestion" class="question-list">
        <div class="filter-section">
          <h2>真题分类</h2>
          <div class="filter-buttons">
            <button 
              v-for="category in categories" 
              :key="category.value"
              class="filter-btn"
              :class="{ active: currentFilter === category.value }"
              @click="() => { currentFilter = category.value; filterQuestions(); }"
            >
              {{ category.label }}
            </button>
          </div>
        </div>

        <div class="questions">
          <h2>真题列表</h2>
          <div class="question-cards">
            <div 
              v-for="question in filteredQuestions" 
              :key="question.id"
              class="question-card"
              @click="viewQuestion(question)"
            >
              <div class="question-header">
                <div class="question-meta">
                  <span class="year">{{ question.year }}年{{ question.period }}</span>
                  <span class="category">{{ categories.find(c => c.value === question.category)?.label }}</span>
                </div>
              </div>
              <div class="question-title">{{ question.title }}</div>
              <div class="question-preview">{{ question.content.substring(0, 100) }}...</div>
              <div class="view-btn">查看详情 →</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 真题详情 -->
      <div v-else class="question-detail">
        <div class="detail-header">
          <button class="back-btn" @click="backToList">← 返回列表</button>
          <div class="detail-meta">
            <span class="year">{{ selectedQuestion.year }}年{{ selectedQuestion.period }}</span>
            <span class="category">{{ categories.find(c => c.value === selectedQuestion.category)?.label }}</span>
          </div>
        </div>
        <h2 class="detail-title">{{ selectedQuestion.title }}</h2>
        <div class="detail-content">{{ selectedQuestion.content }}</div>
        <div class="action-buttons">
          <button class="btn primary">开始练习</button>
          <button class="btn secondary">收藏题目</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.question-bank-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.question-bank-header {
  background-color: #2563eb;
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.question-bank-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.question-bank-main {
  flex: 1;
  padding: 20px;
}

/* 真题列表样式 */
.question-list {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.filter-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  background-color: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}

.filter-btn:hover:not(.active) {
  border-color: #2563eb;
  color: #2563eb;
}

.questions h2 {
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.question-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.question-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #2563eb;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #6b7280;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
  line-height: 1.4;
}

.question-preview {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.view-btn {
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
  text-align: right;
}

/* 真题详情样式 */
.question-detail {
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.back-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.detail-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #6b7280;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  line-height: 1.4;
}

.detail-content {
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 30px;
  white-space: pre-line;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
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
</style>
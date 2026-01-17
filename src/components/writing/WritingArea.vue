<template>
  <section class="writing-area">
    <!-- 论文标题 -->
    <div v-if="activeSection === 'title'" class="section-content">
      <h2 class="section-title">论文标题</h2>
      <input 
        type="text" 
        class="title-input" 
        v-model="paperContent.title"
        placeholder="请输入论文标题"
        @input="onInput"
      />
    </div>

    <!-- 项目背景 -->
    <div v-else-if="activeSection === 'background'" class="section-content">
      <h2 class="section-title">项目背景</h2>
      <textarea 
        class="content-textarea" 
        v-model="paperContent.background"
        placeholder="请输入项目背景，包括项目的起源、目标、规模等信息"
        rows="20"
        @input="onInput"
      ></textarea>
    </div>

    <!-- 问题分析 -->
    <div v-else-if="activeSection === 'problemAnalysis'" class="section-content">
      <h2 class="section-title">问题分析</h2>
      <textarea 
        class="content-textarea" 
        v-model="paperContent.problemAnalysis"
        placeholder="请分析项目中遇到的主要问题，包括技术、管理等方面"
        rows="20"
        @input="onInput"
      ></textarea>
    </div>

    <!-- 解决方案 -->
    <div v-else-if="activeSection === 'solution'" class="section-content">
      <h2 class="section-title">解决方案</h2>
      <textarea 
        class="content-textarea" 
        v-model="paperContent.solution"
        placeholder="请描述针对问题提出的解决方案，包括技术架构、方法论等"
        rows="20"
        @input="onInput"
      ></textarea>
    </div>

    <!-- 实施过程 -->
    <div v-else-if="activeSection === 'implementation'" class="section-content">
      <h2 class="section-title">实施过程</h2>
      <textarea 
        class="content-textarea" 
        v-model="paperContent.implementation"
        placeholder="请描述解决方案的实施过程，包括关键步骤、遇到的挑战及解决方法"
        rows="20"
        @input="onInput"
      ></textarea>
    </div>

    <!-- 实施效果 -->
    <div v-else-if="activeSection === 'results'" class="section-content">
      <h2 class="section-title">实施效果</h2>
      <textarea 
        class="content-textarea" 
        v-model="paperContent.results"
        placeholder="请描述项目实施后的效果，包括技术指标、业务收益等"
        rows="20"
        @input="onInput"
      ></textarea>
    </div>

    <!-- 结论与展望 -->
    <div v-else-if="activeSection === 'conclusion'" class="section-content">
      <h2 class="section-title">结论与展望</h2>
      <textarea 
        class="content-textarea" 
        v-model="paperContent.conclusion"
        placeholder="请总结项目经验教训，并对未来发展进行展望"
        rows="20"
        @input="onInput"
      ></textarea>
    </div>
  </section>
</template>

<script setup lang="ts">
interface PaperContent {
  title: string;
  background: string;
  problemAnalysis: string;
  solution: string;
  implementation: string;
  results: string;
  conclusion: string;
}

interface Props {
  activeSection: string;
  paperContent: PaperContent;
  onInput: () => void;
}

defineProps<Props>();
</script>

<style scoped>
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

/* 响应式设计 */
@media (max-width: 768px) {
  .writing-area {
    padding: 20px;
  }
}
</style>
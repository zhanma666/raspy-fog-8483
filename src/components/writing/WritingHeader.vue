<template>
  <header class="writing-header">
    <div class="header-left">
      <h1>{{ config.title }}</h1>
    </div>
    <div class="header-right">
      <div class="info-item">
        <span class="label">字数统计:</span>
        <span class="value">{{ config.wordCount }}</span>
      </div>
      <div class="info-item">
        <span class="label">剩余时间:</span>
        <span class="value time">{{ formattedTime }}</span>
      </div>
      <div class="info-item auto-save" v-if="config.isAutoSaving">
        <span class="label">自动保存中...</span>
      </div>
      <div class="info-item" v-else-if="config.lastSaveTime">
        <span class="label">最后保存:</span>
        <span class="value saved">{{ config.lastSaveTime }}</span>
      </div>
    </div>
    <div class="header-actions">
      <button 
        class="header-btn" 
        @click="onOpenSyllabus"
        title="查看考试大纲"
      >
        考试大纲
      </button>
      <button 
        class="header-btn primary" 
        @click="onOpenTemplates"
        title="选择模板"
        :disabled="!hasFeatureAccess('基础模板库')"
      >
        选择模板
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { hasFeatureAccess } from '../../store/userLevel';

interface Props {
  config: {
    title: string;
    wordCount: number;
    timeRemaining: number;
    isAutoSaving: boolean;
    lastSaveTime: string;
  };
  onOpenSyllabus: () => void;
  onOpenTemplates: () => void;
}

const props = defineProps<Props>();

// 格式化时间
const formattedTime = computed(() => {
  const mins = Math.floor(props.config.timeRemaining / 60);
  const secs = props.config.timeRemaining % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});
</script>

<style scoped>
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
</style>
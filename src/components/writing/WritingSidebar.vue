<template>
  <aside class="section-nav">
    <h3>论文结构</h3>
    <ul class="nav-list">
      <li 
        class="nav-item" 
        :class="{ active: activeSection === 'title' }"
        @click="onSectionChange('title')"
      >
        <span class="section-icon">📋</span>
        <span class="section-name">论文标题</span>
      </li>
      <li 
        class="nav-item" 
        :class="{ active: activeSection === 'background' }"
        @click="onSectionChange('background')"
      >
        <span class="section-icon">📝</span>
        <span class="section-name">项目背景</span>
      </li>
      <li 
        class="nav-item" 
        :class="{ active: activeSection === 'problemAnalysis' }"
        @click="onSectionChange('problemAnalysis')"
      >
        <span class="section-icon">🔍</span>
        <span class="section-name">问题分析</span>
      </li>
      <li 
        class="nav-item" 
        :class="{ active: activeSection === 'solution' }"
        @click="onSectionChange('solution')"
      >
        <span class="section-icon">💡</span>
        <span class="section-name">解决方案</span>
      </li>
      <li 
        class="nav-item" 
        :class="{ active: activeSection === 'implementation' }"
        @click="onSectionChange('implementation')"
      >
        <span class="section-icon">⚙️</span>
        <span class="section-name">实施过程</span>
      </li>
      <li 
        class="nav-item" 
        :class="{ active: activeSection === 'results' }"
        @click="onSectionChange('results')"
      >
        <span class="section-icon">📊</span>
        <span class="section-name">实施效果</span>
      </li>
      <li 
        class="nav-item" 
        :class="{ active: activeSection === 'conclusion' }"
        @click="onSectionChange('conclusion')"
      >
        <span class="section-icon">🏁</span>
        <span class="section-name">结论与展望</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

defineProps<Props>();
</script>

<style scoped>
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

/* 响应式设计 */
@media (max-width: 768px) {
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
}
</style>
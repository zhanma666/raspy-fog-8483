<template>
  <div class="modal-overlay" v-if="showModal" @click="onClose">
    <div class="modal-content syllabus-modal" @click.stop>
      <div class="modal-header">
        <h2>{{ examSyllabus?.title }}</h2>
        <button class="close-btn" @click="onClose">&times;</button>
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
</template>

<script setup lang="ts">
import type { ExamSyllabus } from '../../store/examSyllabus';

interface Props {
  showModal: boolean;
  examSyllabus: ExamSyllabus | null;
  onClose: () => void;
}

defineProps<Props>();
</script>

<style scoped>
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
  max-width: 1000px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .structure-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div class="modal-overlay" v-if="showModal" @click="onClose">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>选择论文模板</h2>
        <button class="close-btn" @click="onClose">&times;</button>
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
              @click="onApplyTemplate(template.id)"
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
</template>

<script setup lang="ts">
import type { PaperTemplate } from '../../store/paperTemplates';
import { getUserLevel } from '../../store/userLevel';

interface Props {
  showModal: boolean;
  availableTemplates: PaperTemplate[];
  onClose: () => void;
  onApplyTemplate: (templateId: string) => void;
}

defineProps<Props>();

const userLevel = getUserLevel();
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
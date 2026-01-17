<template>
  <footer class="writing-footer">
    <div class="footer-left">
      <button class="btn secondary" @click="onManualSave">手动保存</button>
    </div>
    <div class="footer-right">
      <button class="btn primary" @click="onSubmitPaper" :disabled="isSubmitting">
        <span v-if="isSubmitting">提交中...</span>
        <span v-else>提交论文</span>
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Props {
  isSubmitting: boolean;
  onManualSave: () => void;
  onSubmitPaper: () => void;
}

defineProps<Props>();
</script>

<style scoped>
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

/* 响应式设计 */
@media (max-width: 768px) {
  .writing-footer {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>
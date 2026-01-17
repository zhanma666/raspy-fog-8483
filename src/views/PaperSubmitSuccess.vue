<template>
  <div class="submit-success-container flex-center pt-xl pb-xl">
    <div class="card" style="width: 100%; max-width: 500px; text-align: center;">
      <div class="card-body">
        <h1 class="title mb-sm">论文提交</h1>
        <h2 class="success-title title mb-md" style="color: var(--success-color);">提交成功！</h2>
        <div class="content-section mb-lg">
          <p class="success-message mb-md">您的论文已成功提交</p>
          <div class="button-group flex-center" style="gap: var(--spacing-md);">
            <button class="btn btn-primary" @click="goToSmartCheck">前往智能批改</button>
            <button class="btn btn-secondary" @click="goToHome">返回首页</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToSmartCheck = () => {
  router.push('/smart-check');
};

const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.submit-success-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #4CAF50 0%, #4CAF50 60%, #ffffff 60%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.success-title {
  font-size: 48px;
  color: #fff;
  margin-bottom: 30px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.success-message {
  font-size: 24px;
  color: #333;
  margin-bottom: 40px;
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #2196F3;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #1976D2;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .success-title {
    font-size: 36px;
  }
  
  .button-group {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
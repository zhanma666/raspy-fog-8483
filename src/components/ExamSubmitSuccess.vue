<template>
  <div class="submit-success-container flex-center pt-xl pb-xl">
    <div class="card" style="width: 100%; max-width: 500px; text-align: center;">
      <div class="card-body">
        <h1 class="exam-title title mb-sm">{{ examSubject }}</h1>
        <h2 class="success-title title mb-md" style="color: var(--secondary-color);">交卷成功！</h2>
        <p class="warning-message mb-md">请您不要关机！</p>
        <div class="content-section mb-lg">
          <p class="countdown-message mb-md">{{ countdown }}秒后进入下一科目考试</p>
          <div class="button-group flex-center" style="gap: var(--spacing-md);">
            <button class="btn btn-primary" @click="showContinueConfirm">继续作答下一科</button>
            <button class="btn btn-secondary" @click="showLeaveConfirm">交卷离场</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认对话框 -->
    <div v-if="showConfirmDialog" class="modal-overlay">
      <div class="modal">
        <h3>{{ confirmTitle }}</h3>
        <p>{{ confirmMessage }}</p>
        <div class="modal-buttons">
          <button class="btn btn-secondary" @click="hideConfirmDialog">取消</button>
          <button class="btn btn-primary" @click="confirmAction">确认</button>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="showError" class="error-toast">
      <p>{{ errorMessage }}</p>
      <button class="close-btn" @click="hideError">×</button>
    </div>
    
    <!-- 反馈按钮 -->
    <button class="feedback-btn" @click="showFeedbackForm">反馈问题</button>
    
    <!-- 反馈表单 -->
    <div v-if="showFeedback" class="modal-overlay">
      <div class="modal">
        <h3>问题反馈</h3>
        <textarea v-model="feedbackContent" placeholder="请描述您遇到的问题..." rows="5"></textarea>
        <div class="modal-buttons">
          <button class="btn btn-secondary" @click="hideFeedbackForm">取消</button>
          <button class="btn btn-primary" @click="submitFeedback">提交反馈</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamSubmitSuccess',
  props: {
    examSubject: {
      type: String,
      default: '网络规划设计师(综合知识)'
    },
    countdownSeconds: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      countdown: this.countdownSeconds,
      timer: null,
      showConfirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmAction: null,
      showError: false,
      errorMessage: '',
      showFeedback: false,
      feedbackContent: ''
    };
  },
  mounted() {
    try {
      this.startCountdown();
    } catch (error) {
      this.showErrorToast('初始化失败，请刷新页面重试');
      console.error('Countdown initialization error:', error);
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    startCountdown() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.timer);
          this.$emit('show-history-records');
        }
      }, 1000);
    },
    showContinueConfirm() {
      this.confirmTitle = '确认继续';
      this.confirmMessage = '确定要进入下一科目考试吗？';
      this.confirmAction = () => this.continueNextExam();
      this.showConfirmDialog = true;
    },
    showLeaveConfirm() {
      this.confirmTitle = '确认离场';
      this.confirmMessage = '确定要交卷离场吗？离场后将无法继续作答。';
      this.confirmAction = () => this.leaveExam();
      this.showConfirmDialog = true;
    },
    hideConfirmDialog() {
      this.showConfirmDialog = false;
      this.confirmAction = null;
    },
    confirmAction() {
      if (this.confirmAction) {
        this.confirmAction();
        this.hideConfirmDialog();
      }
    },
    continueNextExam() {
      try {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.$emit('show-history-records');
      } catch (error) {
        this.showErrorToast('跳转失败，请重试');
        console.error('Continue exam error:', error);
      }
    },
    leaveExam() {
      try {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.$emit('leave-exam');
      } catch (error) {
        this.showErrorToast('离场失败，请重试');
        console.error('Leave exam error:', error);
      }
    },
    showErrorToast(message) {
      this.errorMessage = message;
      this.showError = true;
      setTimeout(() => {
        this.hideError();
      }, 5000);
    },
    hideError() {
      this.showError = false;
      this.errorMessage = '';
    },
    showFeedbackForm() {
      this.showFeedback = true;
    },
    hideFeedbackForm() {
      this.showFeedback = false;
      this.feedbackContent = '';
    },
    submitFeedback() {
      if (!this.feedbackContent.trim()) {
        this.showErrorToast('请输入反馈内容');
        return;
      }
      try {
        this.$emit('submit-feedback', this.feedbackContent);
        this.hideFeedbackForm();
        this.showErrorToast('反馈提交成功，感谢您的意见！');
      } catch (error) {
        this.showErrorToast('反馈提交失败，请重试');
        console.error('Submit feedback error:', error);
      }
    }
  }
};
</script>

<style scoped>
.submit-success-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #2196F3 0%, #2196F3 60%, #ffffff 60%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Microsoft YaHei', sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 50px;
}

.exam-title {
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 20px;
  font-weight: normal;
}

.success-title {
  font-size: 60px;
  color: #FF5722;
  margin-bottom: 30px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.warning-message {
  font-size: 32px;
  color: #FF5722;
  font-weight: bold;
}

.content-section {
  text-align: center;
}

.countdown-message {
  font-size: 28px;
  color: #1976D2;
  margin-bottom: 40px;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.btn {
  padding: 15px 40px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1976D2;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #1565C0;
}

.btn-secondary {
  background-color: #FF5722;
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: #E64A19;
}

@media (max-width: 768px) {
  .success-title {
    font-size: 40px;
  }
  
  .warning-message {
    font-size: 24px;
  }
  
  .countdown-message {
    font-size: 22px;
  }
  
  .button-group {
    flex-direction: column;
    gap: 20px;
  }
  
  .btn {
    padding: 12px 30px;
    font-size: 18px;
  }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  text-align: center;
}

.modal h3 {
  margin-bottom: 15px;
  color: #333;
}

.modal p {
  margin-bottom: 25px;
  color: #666;
}

.modal-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.modal-buttons .btn {
  flex: 1;
  max-width: 150px;
}

/* 错误提示 */
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #f44336;
  color: white;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 15px;
}

.error-toast p {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

/* 反馈按钮 */
.feedback-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #FF5722;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.feedback-btn:hover {
  background-color: #E64A19;
}

/* 反馈表单 */
.modal textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.modal textarea:focus {
  outline: none;
  border-color: #2196F3;
}
</style>
<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 软考高级科目列表
const examTypes = [
  { value: 'system_arch', label: '系统架构设计师' },
  { value: 'sys_analyst', label: '系统分析师' },
  { value: 'project_manager', label: '信息系统项目管理师' }
];

// 考试时间列表
const examTimes = [
  { value: '202605', label: '2026年上半年（5月下旬）' },
  { value: '202611', label: '2026年下半年（11月上旬）' }
];

// 表单数据
const formData = reactive({
  name: '',
  idCard: '',
  gender: '',
  examType: '',
  examTime: ''
});

// 表单验证
const errors = reactive({
  name: '',
  idCard: '',
  gender: '',
  examType: '',
  examTime: ''
});

// 验证表单
  const validateForm = () => {
    let isValid = true;
    
    // 重置错误信息
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = '';
    });
    
    // 验证姓名
    if (!formData.name.trim()) {
      errors.name = '请输入姓名';
      isValid = false;
    }
    
    // 验证证件号码
    if (!formData.idCard.trim()) {
      errors.idCard = '请输入证件号码';
      isValid = false;
    } else if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(formData.idCard)) {
      errors.idCard = '请输入有效的身份证号码';
      isValid = false;
    }
    
    // 验证性别
    if (!formData.gender) {
      errors.gender = '请选择性别';
      isValid = false;
    }
    
    // 验证考试类型
    if (!formData.examType) {
      errors.examType = '请选择考试类型';
      isValid = false;
    }
    
    // 验证考试时间
    if (!formData.examTime) {
      errors.examTime = '请选择考试时间';
      isValid = false;
    }
    
    return isValid;
  };

// 提交表单
const submitForm = () => {
  if (validateForm()) {
    // 保存考试信息到本地存储
    localStorage.setItem('examInfo', JSON.stringify(formData));
    // 跳转到考试页面
    router.push('/exam');
  }
};
</script>

<template>
  <div class="exam-info-container">
    <div class="exam-info-card">
      <div class="logo">软</div>
      <h1 class="title">软考高级论文写作系统</h1>
      <h2 class="subtitle">考试信息填写</h2>
      
      <form class="form" @submit.prevent="submitForm">
        <!-- 姓名输入 -->
        <div class="form-group">
          <label class="label">姓名 <span class="required">*</span></label>
          <input 
            type="text" 
            class="input" 
            v-model="formData.name" 
            placeholder="请输入您的姓名"
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>
        
        <!-- 证件号码输入 -->
        <div class="form-group">
          <label class="label">证件号码 <span class="required">*</span></label>
          <input 
            type="text" 
            class="input" 
            v-model="formData.idCard" 
            placeholder="请输入您的身份证号码"
          />
          <div v-if="errors.idCard" class="error-message">{{ errors.idCard }}</div>
        </div>
        
        <!-- 性别选择 -->
        <div class="form-group">
          <label class="label">性别 <span class="required">*</span></label>
          <select 
            class="input" 
            v-model="formData.gender"
          >
            <option value="">请选择性别</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
          <div v-if="errors.gender" class="error-message">{{ errors.gender }}</div>
        </div>
        
        <!-- 考试类型选择 -->
        <div class="form-group">
          <label class="label">考试类型 <span class="required">*</span></label>
          <select 
            class="input" 
            v-model="formData.examType"
          >
            <option value="">请选择考试类型</option>
            <option 
              v-for="type in examTypes" 
              :key="type.value" 
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
          <div v-if="errors.examType" class="error-message">{{ errors.examType }}</div>
        </div>
        
        <!-- 考试时间选择 -->
        <div class="form-group">
          <label class="label">考试时间 <span class="required">*</span></label>
          <select 
            class="input" 
            v-model="formData.examTime"
          >
            <option value="">请选择考试时间</option>
            <option 
              v-for="time in examTimes" 
              :key="time.value" 
              :value="time.value"
            >
              {{ time.label }}
            </option>
          </select>
          <div v-if="errors.examTime" class="error-message">{{ errors.examTime }}</div>
        </div>
        
        <!-- 提交按钮 -->
        <button type="submit" class="submit-btn">
          确认并进入考试
        </button>
      </form>
      
      <a href="/" class="back-link" @click.prevent="router.push('/')">返回首页</a>
    </div>
  </div>
</template>

<style scoped>
.exam-info-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  padding: 20px;
}

.exam-info-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.logo {
  width: 60px;
  height: 60px;
  background-color: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 24px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 32px;
}

.form {
  text-align: left;
}

.form-group {
  margin-bottom: 24px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.required {
  color: #ef4444;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 16px;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.back-link {
  display: inline-block;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
  margin-top: 24px;
}

.back-link:hover {
  color: #2563eb;
}
</style>
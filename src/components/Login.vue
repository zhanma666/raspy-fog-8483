<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = useRouter();

// 模式管理
const isLogin = ref(true);
const isResetPassword = ref(false);
const isVerifyQuestion = ref(false);

// 输入字段
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const securityQuestion = ref('');
const securityAnswer = ref('');
const verifyAnswer = ref('');

// 消息
const error = ref('');
const success = ref('');

// 获取安全问题列表
const authStore = useAuthStore();
const securityQuestions = authStore.getSecurityQuestions;

// 计算属性：确认密码是否匹配
const isPasswordMatch = computed(() => {
  return isLogin.value ? true : password.value === confirmPassword.value;
});

const isNewPasswordMatch = computed(() => {
  return newPassword.value === confirmNewPassword.value;
});

// 处理表单提交
const handleSubmit = () => {
  // 重置消息
  error.value = '';
  success.value = '';
  
  if (isLogin.value) {
    // 登录逻辑
    if (authStore.login(username.value, password.value)) {
      // 登录成功，跳转到考试信息填写页面
      router.push('/exam-info');
    } else {
      // 登录失败，显示错误信息
      error.value = '用户名或密码错误';
    }
  } else if (isResetPassword.value) {
    // 重置密码逻辑
    if (newPassword.value !== confirmNewPassword.value) {
      error.value = '两次输入的密码不一致';
      return;
    }
    
    if (authStore.resetPassword(username.value, newPassword.value)) {
      // 密码重置成功，切换到登录模式
      success.value = '密码重置成功，请登录';
      resetState();
      isLogin.value = true;
    } else {
      error.value = '密码重置失败，请检查输入';
    }
  } else if (isVerifyQuestion.value) {
    // 验证安全问题逻辑
    if (authStore.verifySecurityQuestion(username.value, verifyAnswer.value)) {
      // 验证成功，进入重置密码步骤
      isVerifyQuestion.value = false;
      isResetPassword.value = true;
    } else {
      error.value = '安全问题回答错误';
    }
  } else {
    // 注册逻辑
    console.log('注册信息:', {
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      securityQuestion: securityQuestion.value,
      securityAnswer: securityAnswer.value
    });
    
    if (password.value !== confirmPassword.value) {
      error.value = '两次输入的密码不一致';
      console.log('注册失败: 两次输入的密码不一致');
      return;
    }
    
    if (!securityQuestion.value) {
      error.value = '请选择安全问题';
      console.log('注册失败: 请选择安全问题');
      return;
    }
    
    if (!securityAnswer.value) {
      error.value = '请输入安全问题答案';
      console.log('注册失败: 请输入安全问题答案');
      return;
    }
    
    if (authStore.register(username.value, password.value, securityQuestion.value, securityAnswer.value)) {
      // 注册成功，显示成功信息并切换到登录模式
      success.value = '注册成功，请登录';
      console.log('注册成功');
      resetState();
      isLogin.value = true;
    } else {
      // 注册失败，显示错误信息
      error.value = '注册失败，请检查输入';
      console.log('注册失败: 其他原因');
    }
  }
};

// 处理忘记密码
const handleForgotPassword = () => {
  // 重置状态
  resetState();
  // 进入验证安全问题步骤
  isLogin.value = false;
  isVerifyQuestion.value = true;
  // 获取用户安全问题
  const userQuestion = authStore.getUserSecurityQuestion(username.value);
  if (userQuestion) {
    securityQuestion.value = userQuestion;
  } else {
    error.value = '未找到该用户的安全问题';
  }
};

// 重置状态
const resetState = () => {
  error.value = '';
  success.value = '';
  password.value = '';
  confirmPassword.value = '';
  newPassword.value = '';
  confirmNewPassword.value = '';
  securityAnswer.value = '';
  verifyAnswer.value = '';
};

// 切换到登录模式
const switchToLogin = () => {
  resetState();
  isLogin.value = true;
  isResetPassword.value = false;
  isVerifyQuestion.value = false;
};

// 切换到注册模式
const switchToRegister = () => {
  resetState();
  isLogin.value = false;
  isResetPassword.value = false;
  isVerifyQuestion.value = false;
};
</script>

<template>
  <div class="login-container flex-center pt-xl pb-xl">
    <div class="card login-card" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <div class="logo flex-center mb-md">软</div>
        <h1 class="title text-center mb-sm">软考高级论文写作系统</h1>
        <p class="subtitle text-center mb-lg">专业的论文写作辅助工具</p>
        
        <!-- 登录/注册标签 -->
        <div class="tabs flex-between mb-md" v-if="!isVerifyQuestion && !isResetPassword">
          <button type="button" class="btn" :class="{ 'btn-primary': isLogin, 'btn-secondary': !isLogin }" @click="switchToLogin">登录</button>
          <button type="button" class="btn" :class="{ 'btn-primary': !isLogin, 'btn-secondary': isLogin }" @click="switchToRegister">注册</button>
        </div>
        
        <!-- 表单标题 -->
        <h3 class="form-title text-center mb-md" v-if="isVerifyQuestion">验证安全问题</h3>
        <h3 class="form-title text-center mb-md" v-else-if="isResetPassword">重置密码</h3>
        
        <form class="form" @submit.prevent="handleSubmit">
          <!-- 用户名输入（所有模式都需要） -->
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="username" 
              placeholder="请输入用户名"
              required
            />
          </div>
        
        <!-- 登录模式 -->
        <template v-if="isLogin">
          <div class="form-group">
            <label class="label">密码</label>
            <input 
              type="password" 
              class="input" 
              v-model="password" 
              placeholder="请输入密码"
              required
            />
          </div>
          
          <!-- 忘记密码链接 -->
          <div class="forgot-password">
            <a href="#" @click.prevent="handleForgotPassword">忘记密码？</a>
          </div>
        </template>
        
        <!-- 注册模式 -->
        <template v-else-if="!isVerifyQuestion && !isResetPassword">
          <div class="form-group">
            <label class="label">密码</label>
            <input 
              type="password" 
              class="input" 
              v-model="password" 
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="label">确认密码</label>
            <input 
              type="password" 
              class="input" 
              v-model="confirmPassword" 
              placeholder="请再次输入密码"
              required
            />
            <div v-if="!isPasswordMatch && password && confirmPassword" class="error-message small">
              两次输入的密码不一致
            </div>
          </div>
          
          <div class="form-group">
            <label class="label">安全问题</label>
            <select 
              class="input" 
              v-model="securityQuestion" 
              required
            >
              <option value="">请选择安全问题</option>
              <option v-for="question in securityQuestions" :key="question" :value="question">
                {{ question }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="label">安全问题答案</label>
            <input 
              type="text" 
              class="input" 
              v-model="securityAnswer" 
              placeholder="请输入安全问题答案"
              required
            />
          </div>
        </template>
        
        <!-- 验证安全问题模式 -->
        <template v-else-if="isVerifyQuestion">
          <div class="form-group">
            <label class="label">安全问题</label>
            <div class="security-question-display">{{ securityQuestion || '请先输入用户名' }}</div>
          </div>
          
          <div class="form-group">
            <label class="label">安全问题答案</label>
            <input 
              type="text" 
              class="input" 
              v-model="verifyAnswer" 
              placeholder="请输入安全问题答案"
              required
            />
          </div>
        </template>
        
        <!-- 重置密码模式 -->
        <template v-else-if="isResetPassword">
          <div class="form-group">
            <label class="label">新密码</label>
            <input 
              type="password" 
              class="input" 
              v-model="newPassword" 
              placeholder="请输入新密码"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="label">确认新密码</label>
            <input 
              type="password" 
              class="input" 
              v-model="confirmNewPassword" 
              placeholder="请再次输入新密码"
              required
            />
            <div v-if="!isNewPasswordMatch && newPassword && confirmNewPassword" class="error-message small">
              两次输入的密码不一致
            </div>
          </div>
        </template>
        
        <!-- 错误和成功消息 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
        
        <!-- 提交按钮 -->
        <button type="submit" class="submit-btn">
          <template v-if="isLogin">登录</template>
          <template v-else-if="isVerifyQuestion">验证</template>
          <template v-else-if="isResetPassword">重置密码</template>
          <template v-else>注册</template>
        </button>
      </form>
      
      <!-- 返回链接 -->
      <div class="back-links">
        <a href="/" class="back-link" @click.prevent="$router.push('/')">返回首页</a>
        <a href="#" class="back-link" @click.prevent="switchToLogin" v-if="(isVerifyQuestion || isResetPassword)">
          返回登录
        </a>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.login-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
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
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
}

.tabs {
  display: flex;
  margin-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background-color: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

.success-message {
  color: #10b981;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
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
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  font-size: 14px;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-password a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.security-question-display {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9fafb;
  color: #374151;
}

.error-message.small {
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
  text-align: left;
}

.back-links {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.back-link {
  display: inline-block;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: #2563eb;
}
</style>
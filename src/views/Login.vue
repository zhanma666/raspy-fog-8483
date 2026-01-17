<template>
  <div class="login-container">
    <div class="login-form card">
      <h2 class="title text-center mb-md">用户登录</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group mb-md">
          <label class="form-label">用户名</label>
          <input 
            v-model="loginForm.username" 
            type="text" 
            class="form-input" 
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group mb-lg">
          <label class="form-label">密码</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            class="form-input" 
            placeholder="请输入密码"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary w-100 mb-md">登录</button>
        
        <div class="text-center">
          <a href="#" class="link">忘记密码？</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
});

// 处理登录
const handleLogin = () => {
  // 这里应该调用实际的登录API
  console.log('登录信息:', loginForm);
  
  // 模拟登录成功，跳转到首页
  setTimeout(() => {
    // 在真实应用中，这里会保存用户token等信息
    alert('登录成功！');
    router.push('/');
  }, 500);
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  padding: var(--spacing-md);
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.w-100 {
  width: 100%;
}

.text-center {
  text-align: center;
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover-color);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
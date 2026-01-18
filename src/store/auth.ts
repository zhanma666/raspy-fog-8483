import { ref } from 'vue';

// 简单的状态管理
const isLoggedIn = ref(false);
const username = ref('');

// 问题选项
const securityQuestions = [
  '您的出生地是哪里？',
  '您母亲的姓名是？',
  '您父亲的姓名是？',
  '您的小学名称是？',
  '您的宠物名字是？'
];

// 获取安全问题
export const getSecurityQuestions = () => {
  return securityQuestions;
};

// 注册函数
export const register = (user: string, password: string, securityQuestion: string, securityAnswer: string) => {
  // 模拟注册验证
  if (user && password && securityQuestion && securityAnswer) {
    // 保存用户信息到本地存储
    localStorage.setItem('user', JSON.stringify({ 
      username: user, 
      password: password,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer
    }));
    return true;
  }
  return false;
};

// 登录函数
export const login = (user: string, password: string) => {
  // 模拟登录验证
  if (user && password) {
    // 从本地存储获取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username === user && parsedUser.password === password) {
          isLoggedIn.value = true;
          username.value = user;
          return true;
        }
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        return false;
      }
    }
    // 注意：这里不再允许未经注册的用户登录
  }
  return false;
};

// 验证安全问题
export const verifySecurityQuestion = (user: string, securityAnswer: string) => {
  // 从本地存储获取用户信息
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.username === user && parsedUser.securityAnswer === securityAnswer) {
        return true;
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      return false;
    }
  }
  return false;
};

// 重置密码
export const resetPassword = (user: string, newPassword: string) => {
  // 从本地存储获取用户信息
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.username === user) {
        // 更新密码
        parsedUser.password = newPassword;
        localStorage.setItem('user', JSON.stringify(parsedUser));
        return true;
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      return false;
    }
  }
  return false;
};

// 获取用户安全问题
export const getUserSecurityQuestion = (user: string) => {
  // 从本地存储获取用户信息
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.username === user) {
        return parsedUser.securityQuestion;
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      return null;
    }
  }
  return null;
};

// 登出函数
export const logout = () => {
  isLoggedIn.value = false;
  username.value = '';
};

// 获取登录状态
export const getLoginStatus = () => {
  return isLoggedIn.value;
};

// 获取用户名
export const getUsername = () => {
  return username.value;
};

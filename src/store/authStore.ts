import { defineStore } from 'pinia';

// 定义认证状态的类型
interface AuthState {
  isLoggedIn: boolean;
  username: string;
}

// 安全问题列表
const securityQuestions = [
  '您的出生地是哪里？',
  '您母亲的姓名是？',
  '您父亲的姓名是？',
  '您的小学名称是？',
  '您的宠物名字是？'
];

// 创建Pinia store
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    username: ''
  }),
  
  getters: {
    getLoginStatus: (state) => state.isLoggedIn,
    getUsername: (state) => state.username,
    getSecurityQuestions: () => securityQuestions
  },

  actions: {
    // 注册函数
    register(user: string, password: string, securityQuestion: string, securityAnswer: string): boolean {
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
    },

    // 登录函数
    login(user: string, password: string): boolean {
      // 模拟登录验证
      if (user && password) {
        // 从本地存储获取用户信息
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.username === user && parsedUser.password === password) {
              this.isLoggedIn = true;
              this.username = user;
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
    },

    // 验证安全问题
    verifySecurityQuestion(user: string, securityAnswer: string): boolean {
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
    },

    // 重置密码
    resetPassword(user: string, newPassword: string): boolean {
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
    },

    // 获取用户安全问题
    getUserSecurityQuestion(user: string): string | null {
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
    },

    // 登出函数
    logout(): void {
      this.isLoggedIn = false;
      this.username = '';
    }
  }
});
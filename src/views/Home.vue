<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
  // 初始化登录状态
  const authStore = useAuthStore();
  isLoggedIn.value = authStore.getLoginStatus;
});

// 处理功能按钮点击
const handleFeatureClick = (action?: string) => {
  if (!isLoggedIn.value) {
    // 未登录状态，跳转到登录页面
    router.push('/login');
  } else {
    // 已登录状态，根据action跳转到对应的功能页面
    if (action === 'browse_questions') {
      router.push('/question-bank');
    } else {
      router.push('/writing');
    }
  }
};

// 处理导航菜单项点击
const handleNavClick = (route: string) => {
  if (!isLoggedIn.value) {
    // 未登录状态，跳转到登录页面
    router.push('/login');
  } else {
    // 已登录状态，跳转到对应的功能页面
    switch (route) {
      case '智能校验':
      case '背景段分析':
      case '智能检查':
        router.push('/smart-check');
        break;
      case '考试写作':
        router.push('/writing');
        break;
      case '真题题库':
        router.push('/question-bank');
        break;
      case '首页':
        router.push('/');
        break;
      default:
        // 其他功能页面尚未实现，暂时跳转到首页
        router.push('/');
    }
  }
};

// 处理登出
const handleLogout = () => {
  const authStore = useAuthStore();
  authStore.logout();
  isLoggedIn.value = false;
};
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="navbar-brand flex-center">
        <div class="logo flex-center">软</div>
        <span class="brand-name">软考高级论文写作系统</span>
      </div>
      <div class="nav-menu">
        <a href="#" class="nav-item active" @click="handleNavClick('首页')">首页</a>
        <a href="#" class="nav-item" @click="handleNavClick('智能校验')">智能校验</a>
        <a href="#" class="nav-item" @click="handleNavClick('背景段分析')">背景段分析</a>
        <a href="#" class="nav-item" @click="handleNavClick('考试写作')">考试写作</a>
        <a href="#" class="nav-item" @click="handleNavClick('模板管理')">模板管理</a>
        <a href="#" class="nav-item" @click="handleNavClick('真题题库')">真题题库</a>
        <a href="#" class="nav-item" @click="handleNavClick('练习管理')">练习管理</a>
        <a href="#" class="nav-item" @click="handleNavClick('智能检查')">智能检查</a>
      </div>
      <div class="nav-actions">
        <template v-if="isLoggedIn">
          <button class="btn btn-secondary" @click="handleLogout">登出</button>
        </template>
        <template v-else>
          <button class="btn btn-primary" @click="$router.push('/login')">登录</button>
        </template>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section class="hero pt-xl pb-xl">
      <div class="container text-center">
        <h1 class="hero-title title">让软考论文不再成为拦路虎！</h1>
        <p class="hero-subtitle subtitle">专业的软考高级论文写作辅助系统，提供智能校验、智能生成、真题题库、练习管理、智能检查五大核心功能</p>
      </div>
    </section>

    <!-- 功能卡片区域 -->
    <section class="features container pt-xl pb-xl">
      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3 class="feature-title">项目规模智能校验</h3>
        <p class="feature-desc">针对没有项目经验的同学，能够快速建立查自己已经造的项目背景金额以及人数配比是否合理，对于有数据可以参考</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📄</div>
        <h3 class="feature-title">项目背景段检查</h3>
        <p class="feature-desc">重点检查项目背景是否新颖，发起单位性质与项目表述是否匹配，技术架构是否合理，文字表述是否存在病病句等</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📑</div>
        <h3 class="feature-title">过渡段检查</h3>
        <p class="feature-desc">重点检查过渡段对于项目特点的表述是否合理，对于上下文的衔接是否自然</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3 class="feature-title">结尾段检查</h3>
        <p class="feature-desc">重点检查结尾段对于建设收益、实施过程反思、未来展望的完整性</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
      <div class="feature-card">
        <div class="feature-icon">✅</div>
        <h3 class="feature-title">十大管理检查</h3>
        <p class="feature-desc">重点检查十大管理领域的过程是否选对写作，是否包含作用，重要性(工具)，实施过程(输入)，如何做(工具与技术)，产出哪些成果(输出)</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📚</div>
        <h3 class="feature-title">子题目发散练习</h3>
        <p class="feature-desc">提供八大绩效域及八大绩效域的子题目，大家可以出完整论文，能够列出提纲，写出段落即可</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📂</div>
        <h3 class="feature-title">素材复用提示</h3>
        <p class="feature-desc">为了帮助大家节省考试时间，掌握必要的写作素材复用技巧，系统会提示你哪些素材复用到其他题目当中</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💻</div>
        <h3 class="feature-title">考试写作环境</h3>
        <p class="feature-desc">模拟真实考试环境，提供计时、字数统计、自动保存等功能</p>
        <button class="feature-btn" @click="() => handleFeatureClick()">开始使用 →</button>
      </div>
    </section>

    <!-- 注册区域 -->
    <section class="register-section">
      <div class="register-content">
        <h2 class="register-title">开始你的论文写作之旅</h2>
        <p class="register-desc">立即注册，体验专业的论文写作辅助功能，让你的软考之路更加顺畅</p>
        <div class="register-buttons">
          <button class="btn btn-primary" @click="() => handleFeatureClick()">开始写作</button>
          <button class="btn btn-secondary" @click="() => handleFeatureClick('browse_questions')">浏览真题</button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2026 软考高级论文写作系统. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: #fff;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.nav-menu {
  display: flex;
  gap: var(--spacing-xl);
}

.nav-item {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: color 0.2s;
  cursor: pointer;
}

.nav-item:hover,
.nav-item.active {
  color: var(--primary-color);
}

.nav-actions {
  margin-left: var(--spacing-md);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover-color);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--border-hover);
}

.hero {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  background-color: var(--bg-secondary);
}

.hero-title {
  font-size: var(--font-size-xxl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.features {
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
  display: block;
}

.feature-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.feature-desc {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.6;
}

.feature-btn {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.feature-btn:hover {
  background-color: var(--primary-hover-color);
}

.register-section {
  background-color: var(--bg-primary);
  padding: var(--spacing-xl) var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.register-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.register-title {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.register-desc {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.register-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: var(--primary-hover-color);
}

.secondary-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background-color: #f5f5f5;
  border-color: #c9c9c9;
}

.footer {
  text-align: center;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--border-light);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .hero-title {
    font-size: var(--font-size-xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-size-base);
  }
  
  .features {
    grid-template-columns: 1fr;
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .register-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-btn,
  .secondary-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// 软考高级科目映射
const examTypeMap: Record<string, string> = {
  'system_arch': '系统架构设计师',
  'sys_analyst': '系统分析师',
  'project_manager': '信息系统项目管理师'
};

// 考试时间映射
const examTimeMap: Record<string, string> = {
  '202605': '2026年上半年（5月下旬）',
  '202611': '2026年下半年（11月上旬）'
};

// 获取当前考试时间
const currentExamTime = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // 简化逻辑：上半年（< 6月）和下半年（>= 6月）
  // 使用当前年份动态生成考试时间键
  const currentYear = year.toString().slice(-2);
  const period = month < 5 ? `${currentYear}05` : `${currentYear}11`;
  return examTimeMap[period] || `待定 ${year}年`;
});

// 初始考生信息
const examInfo = ref({
  name: 'XXX',
  gender: '男',
  examId: '011440301001001',
  idCard: 'XXXXXXXXXXXXXXXXX',
  examType: '正常考试',
  examTime: '120分钟', // 论文考试标准时间
  examStatus: '已加载',
  paperLoaded: '100%'
});

// 从localStorage获取考试信息
const loadExamInfo = () => {
  const storedInfo = localStorage.getItem('examInfo');
  if (storedInfo) {
    try {
      const parsedInfo = JSON.parse(storedInfo);
      // 验证解析的数据结构
      if (typeof parsedInfo === 'object' && parsedInfo !== null) {
        examInfo.value.name = parsedInfo.name;
        examInfo.value.gender = parsedInfo.gender || '男';
        examInfo.value.idCard = parsedInfo.idCard;
        examInfo.value.examType = examTypeMap[parsedInfo.examType] || '系统架构设计师';
      }
    } catch (error) {
      console.error('Failed to parse examInfo from localStorage:', error);
    }
    examInfo.value.examTime = '120分钟'; // 论文考试标准时间
  }
};

// 倒计时（秒）- 120分钟 = 7200秒
const countdown = ref(7200);
// 当前激活的标签页
const activeTab = ref('操作指南');
// 是否显示"我已阅读"按钮
const showReadButton = ref(true);
// 模拟内容
const examRules = `
一、考生必须凭本人有效身份证件和准考证进入考场，对号入座。
二、考生进入考场后，必须将手机等通讯工具关闭并放在指定位置。
三、考试开始前，考生必须仔细阅读《考场规则》和《操作指南》。
四、考试开始后，考生不得随意离开考场，如有特殊情况必须向监考人员报告。
五、考试结束后，考生必须立即停止答题，不得继续操作电脑。
六、考生必须严格遵守考场纪律，如有违纪行为，将按照相关规定处理。
`;

const operationGuide = `
一、等待开考
在等待开考界面，请应试人员利用考前等待时间认真阅读《考场规则》和《操作指南》。阅读完毕后，点击"我已阅读"按钮。

机考系统将在开考时间到达时自动跳转至作答界面。

重要提示：
只有点击"我已阅读"按钮后，应试人员才能进入作答界面。考试开始时间到达后，计时器开始计时，请及时点击"我已阅读"按钮，避免影响作答时间。

二、开始作答
1. 考试开始后，系统将自动进入作答界面。
2. 作答界面分为题目区和作答区，请考生仔细阅读题目后在作答区进行作答。
3. 考生可以使用系统提供的各种编辑工具进行作答。
4. 作答过程中，系统会自动保存考生的作答内容。

三、交卷
1. 考试结束前30分钟，考生可以提前交卷。
2. 考试结束时间到达后，系统将自动交卷。
3. 交卷后，考生不能再进行任何操作。
`;

// 格式化倒计时
const formattedCountdown = ref('00:02:56');

// 格式化倒计时函数
const formatCountdown = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 倒计时定时器
let countdownTimer: number | null = null;

// 开始倒计时
const startCountdown = () => {
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
      formattedCountdown.value = formatCountdown(countdown.value);
    } else {
      // 倒计时结束 - 自动交卷
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
      alert('考试时间结束，系统将自动交卷！');
      // 跳转到首页或成绩页面
      window.location.href = '/';
    }
  }, 1000);
};

// 我已阅读按钮点击
const handleReadClick = () => {
  showReadButton.value = false;
  // 跳转到写作界面
  console.log('已阅读，进入作答界面');
  window.location.href = '/writing';
};

// 标签页切换
const switchTab = (tab: string) => {
  activeTab.value = tab;
};

onMounted(() => {
  // 加载考试信息
  loadExamInfo();
  // 初始化倒计时
  formattedCountdown.value = formatCountdown(countdown.value);
  // 开始倒计时
  startCountdown();
});
</script>

<template>
  <div class="exam-container">
    <!-- 顶部信息栏 -->
    <header class="exam-header">
      <div class="exam-info">
        <div class="user-info">
          <div class="avatar">👨‍🎓</div>
          <div class="info">
            <div><strong>姓 名:</strong> {{ examInfo.name }}</div>
            <div><strong>性 别:</strong> {{ examInfo.gender }}</div>
            <div><strong>准考证号:</strong> {{ examInfo.examId }}</div>
            <div><strong>证件号码:</strong> {{ examInfo.idCard }}</div>
          </div>
        </div>
        <div class="exam-details">
          <div><strong>考试类型:</strong> {{ examInfo.examType }}</div>
          <div><strong>考试时间:</strong> {{ currentExamTime }}</div>
          <div><strong>试卷加载:</strong> {{ examInfo.examStatus }}</div>
        </div>
        <div class="countdown">
          <div class="countdown-title">倒计时:</div>
          <div class="countdown-time">{{ formattedCountdown }}</div>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-label">试卷加载完成</div>
        <div class="progress">
          <div class="progress-fill" :style="{ width: examInfo.paperLoaded }"></div>
        </div>
        <div class="progress-percent">{{ examInfo.paperLoaded }}</div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="exam-main">
      <!-- 标签页 -->
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === '考场规则' }" 
          @click="switchTab('考场规则')"
        >
          考场规则
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === '操作指南' }" 
          @click="switchTab('操作指南')"
        >
          操作指南
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="content">
        <h2 class="content-title">{{ activeTab }}</h2>
        <div class="content-text" v-if="activeTab === '考场规则'">
          {{ examRules }}
        </div>
        <div class="content-text" v-else>
          {{ operationGuide }}
        </div>
      </div>

      <!-- 示例图片 -->
      <div class="example-image">
        <img src="https://via.placeholder.com/800x400?text=考试界面示例" alt="考试界面示例" />
      </div>

      <!-- 我已阅读按钮 -->
      <div class="read-button-container" v-if="showReadButton">
        <button class="read-button" @click="handleReadClick">我已阅读</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.exam-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.exam-header {
  background-color: #007bff;
  color: white;
  padding: 15px 20px;
}

.exam-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  font-size: 48px;
}

.info div {
  margin-bottom: 5px;
  font-size: 14px;
}

.exam-details div {
  margin-bottom: 5px;
  font-size: 14px;
  text-align: center;
}

.countdown {
  text-align: center;
  background-color: #ff6b6b;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
}

.countdown-title {
  font-size: 14px;
  margin-bottom: 5px;
}

.countdown-time {
  font-size: 24px;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-label {
  font-size: 14px;
  font-weight: bold;
}

.progress {
  flex: 1;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #28a745;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-percent {
  font-size: 14px;
  font-weight: bold;
}

.exam-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 180px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.tab-btn {
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  margin-right: 20px;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
  font-weight: 600;
}

.content {
  margin-bottom: 30px;
}

.content-title {
  font-size: 24px;
  color: #343a40;
  margin-bottom: 20px;
  font-weight: 600;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
  white-space: pre-line;
}

.example-image {
  margin-bottom: 30px;
  text-align: center;
}

.example-image img {
  max-width: 100%;
  height: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.read-button-container {
  text-align: center;
  margin-top: 30px;
}

.read-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.read-button:hover {
  background-color: #0056b3;
}
</style>
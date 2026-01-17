import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Exam from '../views/Exam.vue';
import ExamInfo from '../views/ExamInfo.vue';
import Writing from '../views/Writing.vue';
import SmartCheck from '../views/SmartCheck.vue';
import QuestionBank from '../views/QuestionBank.vue';
import TemplateManager from '../views/TemplateManager.vue';
import PaperSubmitSuccess from '../views/PaperSubmitSuccess.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/exam-info',
    name: 'ExamInfo',
    component: ExamInfo
  },
  {
    path: '/exam',
    name: 'Exam',
    component: Exam
  },
  {
    path: '/writing',
    name: 'Writing',
    component: Writing
  },
  {
    path: '/smart-check',
    name: 'SmartCheck',
    component: SmartCheck
  },
  {
    path: '/question-bank',
    name: 'QuestionBank',
    component: QuestionBank
  },
  {
    path: '/templates',
    name: 'TemplateManager',
    component: TemplateManager
  },
  {
    path: '/paper-submit-success',
    name: 'PaperSubmitSuccess',
    component: PaperSubmitSuccess
  },
  // 重定向所有未匹配的路由到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
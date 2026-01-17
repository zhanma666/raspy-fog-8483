// 用户等级管理

export interface UserLevel {
  id: string;
  name: string;
  description: string;
  features: string[];
}

// 基础用户等级功能
const beginnerFeatures = ['基础模板库', '简单智能校验', '考试大纲指导', '字数统计', '自动保存'];
const intermediateFeatures = [...beginnerFeatures, '进阶模板库', '高级智能校验', '真题解析', '结构优化建议'];
const advancedFeatures = [...intermediateFeatures, '个性化模板定制', '深度内容分析', '专家点评', '模拟考试环境'];

// 用户等级定义
export const userLevels: UserLevel[] = [
  {
    id: 'beginner',
    name: '初级用户',
    description: '适合首次参加软考论文写作的用户',
    features: beginnerFeatures
  },
  {
    id: 'intermediate',
    name: '中级用户',
    description: '适合有一定写作经验的用户',
    features: intermediateFeatures
  },
  {
    id: 'advanced',
    name: '高级用户',
    description: '适合希望获得高分的用户',
    features: advancedFeatures
  }
];

// 默认用户等级
export const DEFAULT_USER_LEVEL: UserLevel = userLevels[0] as UserLevel;

// 获取用户等级
export const getUserLevel = (): UserLevel => {
  const storedLevel = localStorage.getItem('userLevel');
  if (storedLevel) {
    return JSON.parse(storedLevel);
  }
  return DEFAULT_USER_LEVEL;
};

// 设置用户等级
export const setUserLevel = (levelId: string): void => {
  const level = userLevels.find(l => l.id === levelId);
  if (level) {
    localStorage.setItem('userLevel', JSON.stringify(level));
  }
};

// 检查用户是否有权限使用某个功能
export const hasFeatureAccess = (feature: string): boolean => {
  const userLevel = getUserLevel();
  return userLevel.features.includes(feature);
};
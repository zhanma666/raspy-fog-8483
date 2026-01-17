// 软考考试大纲管理

export interface ExamSyllabus {
  id: string;
  title: string;
  subject: string;
  version: string;
  requirements: ExamRequirement[];
  scoringCriteria: ScoringCriterion[];
  paperStructure: PaperSection[];
}

export interface ExamRequirement {
  id: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ScoringCriterion {
  id: string;
  category: string;
  description: string;
  weight: number;
}

export interface PaperSection {
  id: string;
  title: string;
  description: string;
  minWordCount: number;
  maxWordCount: number;
}

// 系统架构设计师考试大纲
export const sysArchSyllabus: ExamSyllabus = {
  id: 'sys_arch_2024',
  title: '系统架构设计师考试大纲',
  subject: '系统架构设计师',
  version: '2024版',
  requirements: [
    {
      id: 'req_1',
      title: '项目背景与需求分析',
      description: '考生需清晰描述项目背景、目标、规模和需求，体现对项目的全面理解',
      importance: 'high'
    },
    {
      id: 'req_2',
      title: '架构设计与实现',
      description: '考生需详细阐述架构设计思路、技术选型和实现方案，体现架构设计能力',
      importance: 'high'
    },
    {
      id: 'req_3',
      title: '质量保证与风险控制',
      description: '考生需说明如何保证架构质量和控制项目风险，体现质量意识和风险管理能力',
      importance: 'medium'
    },
    {
      id: 'req_4',
      title: '经验总结与展望',
      description: '考生需总结项目经验教训，并对未来发展进行展望，体现反思和创新能力',
      importance: 'medium'
    }
  ],
  scoringCriteria: [
    {
      id: 'score_1',
      category: '项目背景与需求分析',
      description: '项目背景描述清晰，需求分析全面准确',
      weight: 20
    },
    {
      id: 'score_2',
      category: '架构设计与实现',
      description: '架构设计合理，技术选型适当，实现方案可行',
      weight: 40
    },
    {
      id: 'score_3',
      category: '质量保证与风险控制',
      description: '质量保证措施有效，风险控制得当',
      weight: 20
    },
    {
      id: 'score_4',
      category: '写作质量与规范性',
      description: '结构清晰，逻辑严谨，语言通顺，符合规范',
      weight: 20
    }
  ],
  paperStructure: [
    {
      id: 'sec_1',
      title: '论文标题',
      description: '简洁明了，反映论文核心内容',
      minWordCount: 10,
      maxWordCount: 50
    },
    {
      id: 'sec_2',
      title: '项目背景',
      description: '介绍项目的起源、目标、规模、周期等',
      minWordCount: 300,
      maxWordCount: 800
    },
    {
      id: 'sec_3',
      title: '问题分析',
      description: '分析项目中遇到的主要问题和挑战',
      minWordCount: 200,
      maxWordCount: 500
    },
    {
      id: 'sec_4',
      title: '解决方案',
      description: '阐述架构设计思路和解决方案',
      minWordCount: 500,
      maxWordCount: 1200
    },
    {
      id: 'sec_5',
      title: '实施过程',
      description: '描述方案的实施过程和关键技术点',
      minWordCount: 400,
      maxWordCount: 1000
    },
    {
      id: 'sec_6',
      title: '实施效果',
      description: '分析项目实施后的效果和效益',
      minWordCount: 300,
      maxWordCount: 700
    },
    {
      id: 'sec_7',
      title: '结论与展望',
      description: '总结经验教训，对未来发展进行展望',
      minWordCount: 200,
      maxWordCount: 500
    }
  ]
};

// 信息系统项目管理师考试大纲
export const projMgrSyllabus: ExamSyllabus = {
  id: 'proj_mgr_2024',
  title: '信息系统项目管理师考试大纲',
  subject: '信息系统项目管理师',
  version: '2024版',
  requirements: [
    {
      id: 'req_1',
      title: '项目管理知识应用',
      description: '考生需熟练应用项目管理知识，体现对十大管理领域的掌握',
      importance: 'high'
    },
    {
      id: 'req_2',
      title: '项目案例分析',
      description: '考生需结合实际项目案例，深入分析项目管理问题',
      importance: 'high'
    },
    {
      id: 'req_3',
      title: '项目管理工具与技术',
      description: '考生需说明如何应用项目管理工具和技术解决实际问题',
      importance: 'medium'
    },
    {
      id: 'req_4',
      title: '项目管理经验总结',
      description: '考生需总结项目管理经验教训，体现持续改进能力',
      importance: 'medium'
    }
  ],
  scoringCriteria: [
    {
      id: 'score_1',
      category: '项目管理知识应用',
      description: '项目管理知识应用准确，覆盖主要管理领域',
      weight: 35
    },
    {
      id: 'score_2',
      category: '项目案例分析',
      description: '案例分析深入，问题定位准确',
      weight: 30
    },
    {
      id: 'score_3',
      category: '项目管理工具与技术',
      description: '工具与技术应用得当，解决实际问题',
      weight: 20
    },
    {
      id: 'score_4',
      category: '写作质量与规范性',
      description: '结构清晰，逻辑严谨，语言通顺',
      weight: 15
    }
  ],
  paperStructure: [
    {
      id: 'sec_1',
      title: '论文标题',
      description: '简洁明了，反映论文核心内容',
      minWordCount: 10,
      maxWordCount: 50
    },
    {
      id: 'sec_2',
      title: '项目背景',
      description: '介绍项目的基本情况、规模、周期等',
      minWordCount: 300,
      maxWordCount: 800
    },
    {
      id: 'sec_3',
      title: '项目管理问题',
      description: '分析项目中遇到的主要管理问题',
      minWordCount: 200,
      maxWordCount: 600
    },
    {
      id: 'sec_4',
      title: '管理措施与方法',
      description: '阐述采取的管理措施和方法',
      minWordCount: 600,
      maxWordCount: 1500
    },
    {
      id: 'sec_5',
      title: '实施效果',
      description: '分析管理措施的实施效果',
      minWordCount: 300,
      maxWordCount: 800
    },
    {
      id: 'sec_6',
      title: '经验与教训',
      description: '总结项目管理经验教训',
      minWordCount: 200,
      maxWordCount: 600
    }
  ]
};

// 系统分析师考试大纲
export const sysAnalystSyllabus: ExamSyllabus = {
  id: 'sys_analyst_2024',
  title: '系统分析师考试大纲',
  subject: '系统分析师',
  version: '2024版',
  requirements: [
    {
      id: 'req_1',
      title: '系统分析与设计能力',
      description: '考生需体现系统分析与设计的核心能力',
      importance: 'high'
    },
    {
      id: 'req_2',
      title: '业务理解与建模',
      description: '考生需深入理解业务需求，进行有效的业务建模',
      importance: 'high'
    },
    {
      id: 'req_3',
      title: '技术方案评估',
      description: '考生需具备技术方案评估和选择能力',
      importance: 'medium'
    },
    {
      id: 'req_4',
      title: '系统优化与改进',
      description: '考生需体现系统优化和持续改进能力',
      importance: 'medium'
    }
  ],
  scoringCriteria: [
    {
      id: 'score_1',
      category: '系统分析与设计',
      description: '系统分析深入，设计方案合理',
      weight: 35
    },
    {
      id: 'score_2',
      category: '业务理解与建模',
      description: '业务理解准确，建模方法得当',
      weight: 30
    },
    {
      id: 'score_3',
      category: '技术方案评估',
      description: '技术方案评估全面，选择合理',
      weight: 20
    },
    {
      id: 'score_4',
      category: '写作质量',
      description: '结构清晰，逻辑严谨，表达准确',
      weight: 15
    }
  ],
  paperStructure: [
    {
      id: 'sec_1',
      title: '论文标题',
      description: '简洁明了，反映论文核心内容',
      minWordCount: 10,
      maxWordCount: 50
    },
    {
      id: 'sec_2',
      title: '项目背景与业务需求',
      description: '介绍项目背景和业务需求',
      minWordCount: 300,
      maxWordCount: 800
    },
    {
      id: 'sec_3',
      title: '系统分析与建模',
      description: '阐述系统分析过程和建模方法',
      minWordCount: 500,
      maxWordCount: 1200
    },
    {
      id: 'sec_4',
      title: '系统设计与实现',
      description: '描述系统设计方案和实现过程',
      minWordCount: 400,
      maxWordCount: 1000
    },
    {
      id: 'sec_5',
      title: '系统测试与优化',
      description: '介绍系统测试和优化措施',
      minWordCount: 300,
      maxWordCount: 700
    },
    {
      id: 'sec_6',
      title: '总结与展望',
      description: '总结项目经验，展望未来发展',
      minWordCount: 200,
      maxWordCount: 500
    }
  ]
};

// 考试大纲列表
export const examSyllabuses = [sysArchSyllabus, projMgrSyllabus, sysAnalystSyllabus];

// 根据科目获取考试大纲
export const getSyllabusBySubject = (subject: string): ExamSyllabus | undefined => {
  return examSyllabuses.find(syllabus => syllabus.subject.toLowerCase().includes(subject.toLowerCase()));
};

// 获取所有考试大纲
export const getAllSyllabuses = (): ExamSyllabus[] => {
  return examSyllabuses;
};
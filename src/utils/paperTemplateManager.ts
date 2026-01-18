/**
 * 软考论文模板管理工具
 * 用于管理和应用不同类型的论文模板
 */

// 论文模板接口定义
export interface PaperTemplate {
  id: string;
  title: string;
  subject: string; // 考试科目
  level: string; // 考试级别
  description: string;
  sections: TemplateSection[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 模板章节接口定义
export interface TemplateSection {
  id: string;
  title: string;
  placeholder: string;
  required: boolean;
  wordLimit?: number;
  guidance?: string; // 写作指导
}

// 软考论文模板库
export class PaperTemplateManager {
  // 默认模板库
  private static defaultTemplates: PaperTemplate[] = [
    {
      id: 'pm-template-1',
      title: '项目管理师经典模板',
      subject: '信息系统项目管理师',
      level: '高级',
      description: '适用于信息系统项目管理师论文的经典模板，包含十大管理领域',
      tags: ['十大管理', '项目管理', '经典'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      sections: [
        {
          id: 'title',
          title: '论文标题',
          placeholder: '基于XXX的项目管理实践与思考',
          required: true,
          wordLimit: 30,
          guidance: '标题应简洁明了，体现项目特色和管理重点'
        },
        {
          id: 'abstract',
          title: '摘要',
          placeholder: '简要概述项目背景、实施过程和取得的效果...',
          required: true,
          wordLimit: 400,
          guidance: '摘要需包含项目背景、核心技术、实施效果和总结'
        },
        {
          id: 'background',
          title: '项目背景',
          placeholder: '介绍项目来源、目标、规模、技术特点等...',
          required: true,
          wordLimit: 600,
          guidance: '重点描述项目的目标、规模、技术难点和约束条件'
        },
        {
          id: 'problem',
          title: '问题分析',
          placeholder: '分析项目中存在的主要问题和挑战...',
          required: true,
          wordLimit: 400,
          guidance: '从十大管理角度分析项目中遇到的问题'
        },
        {
          id: 'solution',
          title: '解决方案',
          placeholder: '详细描述针对问题采取的解决方案...',
          required: true,
          wordLimit: 1500,
          guidance: '重点体现十大管理理论在项目中的应用'
        },
        {
          id: 'implementation',
          title: '实施过程',
          placeholder: '描述解决方案的具体实施过程...',
          required: true,
          wordLimit: 800,
          guidance: '突出关键实施步骤和里程碑'
        },
        {
          id: 'results',
          title: '实施效果',
          placeholder: '分析项目实施后的效果和效益...',
          required: true,
          wordLimit: 500,
          guidance: '用数据说话，体现项目价值'
        },
        {
          id: 'conclusion',
          title: '总结与展望',
          placeholder: '总结经验教训，对未来发展进行展望...',
          required: true,
          wordLimit: 400,
          guidance: '总结经验和不足，提出改进建议'
        }
      ]
    },
    {
      id: 'arch-template-1',
      title: '系统架构设计师模板',
      subject: '系统架构设计师',
      level: '高级',
      description: '适用于系统架构设计师论文的专业模板',
      tags: ['架构设计', '系统设计', '技术方案'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      sections: [
        {
          id: 'title',
          title: '论文标题',
          placeholder: '基于XXX的系统架构设计与实践',
          required: true,
          wordLimit: 30,
          guidance: '标题应体现架构特色和技术亮点'
        },
        {
          id: 'intro',
          title: '引言',
          placeholder: '介绍系统建设的背景和意义...',
          required: true,
          wordLimit: 300,
          guidance: '阐述项目背景和架构设计的重要性'
        },
        {
          id: 'requirements',
          title: '需求分析',
          placeholder: '分析系统功能需求和非功能需求...',
          required: true,
          wordLimit: 500,
          guidance: '从功能性、性能、安全等角度分析需求'
        },
        {
          id: 'design',
          title: '架构设计',
          placeholder: '详细描述系统架构设计方案...',
          required: true,
          wordLimit: 1200,
          guidance: '包括总体架构、技术选型、核心模块设计'
        },
        {
          id: 'implementation',
          title: '实现与验证',
          placeholder: '描述架构实现过程和验证结果...',
          required: true,
          wordLimit: 600,
          guidance: '重点说明关键技术实现和测试验证'
        },
        {
          id: 'evaluation',
          title: '效果评估',
          placeholder: '评估架构设计的效果和优势...',
          required: true,
          wordLimit: 400,
          guidance: '从性能、扩展性、维护性等方面评估'
        },
        {
          id: 'conclusion',
          title: '总结与展望',
          placeholder: '总结架构设计经验，展望未来发展...',
          required: true,
          wordLimit: 300,
          guidance: '总结设计经验和技术收获'
        }
      ]
    }
  ];

  /**
   * 获取所有模板
   */
  static getAllTemplates(): PaperTemplate[] {
    // 从localStorage获取用户自定义模板
    const customTemplates = this.getCustomTemplates();
    return [...this.defaultTemplates, ...customTemplates];
  }

  /**
   * 根据ID获取特定模板
   */
  static getTemplateById(id: string): PaperTemplate | undefined {
    const allTemplates = this.getAllTemplates();
    return allTemplates.find(template => template.id === id);
  }

  /**
   * 根据科目和级别筛选模板
   */
  static getTemplatesByFilters(subject?: string, level?: string, tags?: string[]): PaperTemplate[] {
    let templates = this.getAllTemplates();
    
    if (subject) {
      templates = templates.filter(template => template.subject === subject);
    }
    
    if (level) {
      templates = templates.filter(template => template.level === level);
    }
    
    if (tags && tags.length > 0) {
      templates = templates.filter(template => 
        tags.every(tag => template.tags.includes(tag))
      );
    }
    
    return templates;
  }

  /**
   * 创建新模板
   */
  static createTemplate(template: Omit<PaperTemplate, 'id' | 'createdAt' | 'updatedAt'>): PaperTemplate {
    const newTemplate: PaperTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 保存到localStorage
    this.saveCustomTemplate(newTemplate);
    
    return newTemplate;
  }

  /**
   * 更新模板
   */
  static updateTemplate(updatedTemplate: PaperTemplate): boolean {
    const allTemplates = this.getAllTemplates();
    const templateIndex = allTemplates.findIndex(t => t.id === updatedTemplate.id);
    
    if (templateIndex === -1) {
      return false; // 模板不存在
    }

    // 如果是默认模板，创建一个副本进行修改
    if (this.defaultTemplates.some(t => t.id === updatedTemplate.id)) {
      // 复制模板并修改
      const customTemplate = { ...updatedTemplate, id: this.generateId() };
      this.saveCustomTemplate(customTemplate);
      return true;
    }

    // 如果是自定义模板，直接更新
    const customTemplates = this.getCustomTemplates();
    const customIndex = customTemplates.findIndex(t => t.id === updatedTemplate.id);
    
    if (customIndex !== -1) {
      customTemplates[customIndex] = {
        ...updatedTemplate,
        updatedAt: new Date().toISOString()
      };
      this.saveAllCustomTemplates(customTemplates);
      return true;
    }

    return false;
  }

  /**
   * 删除自定义模板
   */
  static deleteTemplate(id: string): boolean {
    const customTemplates = this.getCustomTemplates();
    const filteredTemplates = customTemplates.filter(template => template.id !== id);
    
    if (filteredTemplates.length === customTemplates.length) {
      return false; // 模板不存在或为默认模板
    }

    this.saveAllCustomTemplates(filteredTemplates);
    return true;
  }

  /**
   * 获取自定义模板
   */
  private static getCustomTemplates(): PaperTemplate[] {
    const stored = localStorage.getItem('customPaperTemplates');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse custom paper templates from localStorage:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * 保存单个自定义模板
   */
  private static saveCustomTemplate(template: PaperTemplate): void {
    const customTemplates = this.getCustomTemplates();
    const existingIndex = customTemplates.findIndex(t => t.id === template.id);
    
    if (existingIndex !== -1) {
      customTemplates[existingIndex] = template;
    } else {
      customTemplates.push(template);
    }
    
    localStorage.setItem('customPaperTemplates', JSON.stringify(customTemplates));
  }

  /**
   * 保存所有自定义模板
   */
  private static saveAllCustomTemplates(templates: PaperTemplate[]): void {
    localStorage.setItem('customPaperTemplates', JSON.stringify(templates));
  }

  /**
   * 生成唯一ID
   */
  private static generateId(): string {
    return 'tmpl_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * 导出模板
   */
  static exportTemplate(id: string): string | null {
    const template = this.getTemplateById(id);
    if (!template) return null;
    
    return JSON.stringify(template, null, 2);
  }

  /**
   * 导入模板
   */
  static importTemplate(jsonString: string): boolean {
    try {
      const template: PaperTemplate = JSON.parse(jsonString);
      
      // 验证模板结构
      if (typeof template !== 'object' || template === null || !template.id || !template.title || !template.sections) {
        return false;
      }
      
      // 生成新ID避免冲突
      template.id = this.generateId();
      template.createdAt = new Date().toISOString();
      template.updatedAt = new Date().toISOString();
      
      this.saveCustomTemplate(template);
      return true;
    } catch (error) {
      console.error('模板导入失败:', error);
      return false;
    }
  }
}

export default PaperTemplateManager;
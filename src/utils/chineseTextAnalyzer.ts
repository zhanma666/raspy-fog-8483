/**
 * 中文文本分析工具
 * 用于软考论文写作的智能校验
 */

// 常见中文标点符号
const CHINESE_PUNCTUATIONS = ['，', '。', '！', '？', '；', '：', '"', '"', '\'', '\'', '（', '）', '【', '】', '《', '》', '、'];

// 常见错误模式
const ERROR_PATTERNS = {
  // 重复字符（如：的的、是是）
  repeatedChars: /([一-龯])\1+/g,
  
  // 过长句子（超过50个字符）
  longSentences: /[^。！？]{50,}[,，]/g,
  
  // 错误的连接词使用
  wrongTransitions: /\b(但是|然而|因此|所以)\b(?!\s+[一-龯])/g,
  
  // 语病模式
  grammarIssues: [
    /(?:进行|实施|开展)\s*(?:了)?\s*(?:了|的)/, // 例如："进行了了"
    /(?:的|地|得)\s+(?:的|地|得)/, // 例如："的地得"连用
    /(?:是|为)\s+(?:是|为)/, // 例如："是是"重复
  ]
};

// 建议词汇库
const RECOMMENDED_WORDS = {
  // 软考相关术语
  softEngTerms: [
    '架构设计', '系统集成', '需求分析', '软件工程', '项目管理', 
    '质量保证', '风险控制', '配置管理', '变更管理', '测试管理'
  ],
  
  // 过渡词
  transitions: [
    '首先', '其次', '再次', '最后', '综上所述', '总而言之', 
    '一方面', '另一方面', '在此基础上', '相应地', '进一步地'
  ],
  
  // 描述词
  descriptors: [
    '有效地', '显著地', '全面地', '系统地', '科学地', '合理地',
    '创新性', '实用性', '可操作性', '前瞻性', '可靠性', '稳定性'
  ]
};

/**
 * 文本错误
 */
export interface TextError {
  type: 'repeated' | 'grammar' | 'style' | 'length';
  message: string;
  position: number;
  length: number;
  suggestion: string;
}

/**
 * 文本建议
 */
export interface TextSuggestion {
  type: 'improvement' | 'enhancement' | 'recommendation';
  message: string;
  position: number;
  relatedText: string;
}

/**
 * 文本分析结果
 */
export interface AnalysisResult {
  wordCount: number;           // 总字数
  charCount: number;           // 字符数（不含空格）
  sentenceCount: number;       // 句子数量
  paragraphCount: number;      // 段落数量
  avgSentenceLength: number;   // 平均句长
  errors: TextError[];         // 发现的错误
  suggestions: TextSuggestion[]; // 建议
  keywords: string[];          // 关键词
  readability: number;         // 可读性评分
}

/**
 * 中文文本分析器
 */
class ChineseTextAnalyzer {
  /**
   * 分析文本
   */
  static analyze(text: string): AnalysisResult {
    const wordCount = this.countWords(text);
    const charCount = this.countCharacters(text);
    const sentenceCount = this.countSentences(text);
    const paragraphCount = this.countParagraphs(text);
    const avgSentenceLength = sentenceCount > 0 ? Math.round(charCount / sentenceCount) : 0;
    
    const errors = this.findErrors(text);
    const suggestions = this.generateSuggestions(text);
    const keywords = this.extractKeywords(text);
    const readability = this.calculateReadability(text);
    
    return {
      wordCount,
      charCount,
      sentenceCount,
      paragraphCount,
      avgSentenceLength,
      errors,
      suggestions,
      keywords,
      readability
    };
  }
  
  /**
   * 计算字数（包含中文字符、英文单词、数字）
   */
  static countWords(text: string): number {
    if (!text) return 0;
    
    // 匹配中文字符、英文单词、数字
    const matches = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+\d*|\d+/g);
    if (!matches) return 0;
    
    let count = 0;
    for (const match of matches) {
      if (/[\u4e00-\u9fa5]/.test(match)) {
        // 中文字符按字数计算
        count += match.length;
      } else if (/[a-zA-Z]+/.test(match)) {
        // 英文单词按词计算
        count += 1;
      } else {
        // 数字按个数计算
        count += match.length;
      }
    }
    
    return count;
  }
  
  /**
   * 计算字符数（不含标点和空格）
   */
  static countCharacters(text: string): number {
    if (!text) return 0;
    
    // 移除空格和常见标点符号
    const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
    return cleanText.length;
  }
  
  /**
   * 计算句子数
   */
  static countSentences(text: string): number {
    if (!text) return 0;
    
    // 使用中文句号、感叹号、问号分割
    const sentences = text.split(/[。！？!?]+/).filter(s => s.trim().length > 0);
    return sentences.length;
  }
  
  /**
   * 计算段落数
   */
  static countParagraphs(text: string): number {
    if (!text) return 0;
    
    // 按换行符分割段落
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    return paragraphs.length;
  }
  
  /**
   * 查找文本错误
   */
  static findErrors(text: string): TextError[] {
    const errors: TextError[] = [];
    
    // 检查重复字符
    let match;
    while ((match = ERROR_PATTERNS.repeatedChars.exec(text)) !== null) {
      errors.push({
        type: 'repeated',
        message: `发现重复字符: "${match[0]}"`,
        position: match.index,
        length: match[0].length,
        suggestion: `建议删除重复字符，改为"${match[1]}"`
      });
    }
    
    // 检查过长句子
    while ((match = ERROR_PATTERNS.longSentences.exec(text)) !== null) {
      errors.push({
        type: 'length',
        message: `句子过长，建议拆分`,
        position: match.index,
        length: match[0].length,
        suggestion: '建议将长句拆分为多个短句，提高可读性'
      });
    }
    
    // 检查语法错误
    for (const pattern of ERROR_PATTERNS.grammarIssues) {
      while ((match = pattern.exec(text)) !== null) {
        errors.push({
          type: 'grammar',
          message: '发现语法错误',
          position: match.index,
          length: match[0].length,
          suggestion: '请检查语法结构，修正错误'
        });
      }
    }
    
    return errors;
  }
  
  /**
   * 生成文本建议
   */
  static generateSuggestions(text: string): TextSuggestion[] {
    const suggestions: TextSuggestion[] = [];
    
    // 检查是否使用了推荐的软考术语
    for (const term of RECOMMENDED_WORDS.softEngTerms) {
      if (text.includes(term)) {
        suggestions.push({
          type: 'enhancement',
          message: `很好！您使用了专业术语"${term}"`,
          position: text.indexOf(term),
          relatedText: term
        });
      }
    }
    
    // 检查是否使用了过渡词
    for (const transition of RECOMMENDED_WORDS.transitions) {
      if (text.includes(transition)) {
        suggestions.push({
          type: 'improvement',
          message: `使用了良好的过渡词"${transition}"，有助于文章连贯性`,
          position: text.indexOf(transition),
          relatedText: transition
        });
      }
    }
    
    // 检查是否使用了描述词
    for (const descriptor of RECOMMENDED_WORDS.descriptors) {
      if (text.includes(descriptor)) {
        suggestions.push({
          type: 'recommendation',
          message: `使用了合适的描述词"${descriptor}"`,
          position: text.indexOf(descriptor),
          relatedText: descriptor
        });
      }
    }
    
    // 检查段落结构
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length < 3) {
      suggestions.push({
        type: 'recommendation',
        message: '建议增加段落数量，通常一篇好的论文应包含引言、正文、结论等多个段落',
        position: 0,
        relatedText: '段落结构'
      });
    }
    
    return suggestions;
  }
  
  /**
   * 提取关键词
   */
  static extractKeywords(text: string): string[] {
    // 简单的关键词提取 - 实际应用中可以使用更复杂的算法
    const words = text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    
    // 统计词频
    const wordFreq: { [key: string]: number } = {};
    for (const word of words) {
      if (word.length >= 2 && !CHINESE_PUNCTUATIONS.includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    }
    
    // 按频率排序并返回前10个
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }
  
  /**
   * 计算可读性评分
   */
  static calculateReadability(text: string): number {
    if (!text) return 0;
    
    const sentences = this.countSentences(text);
    const words = this.countWords(text);
    const chars = this.countCharacters(text);
    
    if (sentences === 0 || words === 0) return 0;
    
    // 简化的可读性公式（基于中文特点调整）
    // 考虑平均句长和平均词长
    const avgSentenceLength = chars / sentences;
    const avgWordLength = chars / words;
    
    // 可读性评分（0-100），数值越高越易读
    let score = 100;
    
    // 句子过长扣分
    if (avgSentenceLength > 30) {
      score -= (avgSentenceLength - 30) * 0.5;
    }
    
    // 词语过短扣分（可能表示内容不够专业）
    if (avgWordLength < 1.2) {
      score -= 10;
    }
    
    // 有错误扣分
    const errors = this.findErrors(text);
    score -= errors.length * 2;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  /**
   * 评估论文结构
   */
  static evaluateStructure(text: string): {
    hasIntroduction: boolean;
    hasBody: boolean;
    hasConclusion: boolean;
    structureScore: number;
  } {
    const lowerText = text.toLowerCase();
    
    // 检查是否包含论文结构关键词
    const hasIntroduction = /(?:引言|背景|概述|介绍|开头)/.test(lowerText);
    const hasBody = /(?:正文|分析|讨论|实施|过程|解决方案)/.test(lowerText);
    const hasConclusion = /(?:结论|总结|收尾|展望|反思)/.test(lowerText);
    
    // 计算结构完整性得分
    let structureScore = 0;
    if (hasIntroduction) structureScore += 30;
    if (hasBody) structureScore += 40;
    if (hasConclusion) structureScore += 30;
    
    return {
      hasIntroduction,
      hasBody,
      hasConclusion,
      structureScore
    };
  }
}

export default ChineseTextAnalyzer;
/**
 * 高级中文文本分析工具
 * 集成分词、语法分析、语义理解等功能
 */

// 引入或模拟中文分词功能
// 注意：在实际项目中，可以引入jieba-js或其他中文分词库
class ChineseSegmenter {
  /**
   * 简单的中文分词实现（基于词典匹配）
   */
  static segment(text: string): string[] {
    // 这里只是示例，实际项目中应使用成熟的分词库
    // 模拟一些常见词汇的识别
    const commonWords = [
      '项目管理', '架构设计', '需求分析', '系统集成', '软件工程',
      '质量保证', '风险控制', '配置管理', '变更管理', '测试管理',
      '十大管理', '范围管理', '进度管理', '成本管理', '质量管理',
      '人力资源管理', '沟通管理', '风险管理', '采购管理', '干系人管理',
      '生命周期', '可行性分析', '技术方案', '实施方案', '效果评估',
      '经验总结', '问题解决', '持续改进', '团队协作', '绩效考核'
    ];

    // 按照常见词汇和字符进行分词
    let tokens: string[] = [];
    let remainingText = text;

    while (remainingText.length > 0) {
      let matched = false;

      // 尝试匹配长词
      for (let word of commonWords.sort((a, b) => b.length - a.length)) {
        if (remainingText.startsWith(word)) {
          tokens.push(word);
          remainingText = remainingText.substring(word.length);
          matched = true;
          break;
        }
      }

      // 如果没有匹配到词汇，则按字符分割
      if (!matched) {
        const char = remainingText.charAt(0);
        tokens.push(char);
        remainingText = remainingText.substring(1);
      }
    }

    // 过滤掉标点符号和空白字符
    return tokens.filter(token => !this.isPunctuationOrSpace(token));
  }

  private static isPunctuationOrSpace(char: string): boolean {
    const punctuations = [' ', '　', '，', '。', '！', '？', '；', '：', '"', '"', '\'', '\'', '（', '）', '【', '】', '《', '》', '、', '\n', '\t'];
    return punctuations.includes(char);
  }
}

// 高级分析器类
// 定义高级分析结果接口
export interface AdvancedAnalysisResult {
  basic: {
    charCount: number;
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgSentenceLength: number;
    textLength: number;
  };
  segments: string[];
  wordFrequency: Record<string, number>;
  readability: number;
  coherence: number;
  topicRelevance: number;
  suggestions: string[];
}

export class AdvancedChineseAnalyzer {
  /**
   * 执行全面的文本分析
   */
  static analyze(text: string) {
    const segments = ChineseSegmenter.segment(text);
    const wordFrequency = this.calculateWordFrequency(segments);
    
    // 使用 segments 来计算各项指标
    const readability = this.calculateReadability(text, segments);
    const coherence = this.assessCoherence(segments);
    const topicRelevance = this.assessTopicRelevance(text, segments);
    const suggestions = this.generateSuggestions(text, segments);
    
    return {
      basic: this.basicAnalysis(text),
      segments, // 直接使用 segments 变量，这是对变量的有效使用
      wordFrequency,
      readability,
      coherence,
      topicRelevance,
      suggestions
    };
  }

  /**
   * 基础文本分析
   */
  private static basicAnalysis(text: string) {
    // 计算字数（排除标点符号）
    const charCount = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').length;
    
    // 计算词数
    const words = text.split(/[\s\u2000-\u206F\u2E00-\u2E7F\\!"#$%&'()*+,\-.\/:;\<=>?@\[\]^_`{|}~]/);
    const wordCount = words.filter(w => w.trim() !== '').length;
    
    // 计算句子数
    const sentences = text.split(/[。！？\n]/).filter(s => s.trim() !== '');
    const sentenceCount = sentences.length;
    
    // 计算段落数
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
    const paragraphCount = paragraphs.length;
    
    // 计算平均句长
    const avgSentenceLength = sentenceCount > 0 ? Math.round(charCount / sentenceCount) : 0;
    
    return {
      charCount,
      wordCount,
      sentenceCount,
      paragraphCount,
      avgSentenceLength,
      textLength: text.length
    };
  }

  /**
   * 计算词频
   */
  private static calculateWordFrequency(segments: string[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    for (const token of segments) {
      if (token.trim()) {
        frequency[token] = (frequency[token] || 0) + 1;
      }
    }
    
    // 按频率排序并返回前20个
    const sortedEntries = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    const result: Record<string, number> = {};
    for (const [word, count] of sortedEntries) {
      result[word] = count;
    }
    
    return result;
  }

  /**
   * 计算可读性分数
   */
  private static calculateReadability(text: string, segments: string[]): number {
    const basic = this.basicAnalysis(text);
    
    // 中文可读性计算公式（简化版）
    // 基于句子长度和词汇复杂度
    const avgSentenceLength = basic.avgSentenceLength;
    const uniqueWordsRatio = new Set(segments).size / segments.length;
    
    // 简化的可读性计算
    let score = 100;
    
    // 句子太长扣分
    if (avgSentenceLength > 30) {
      score -= (avgSentenceLength - 30) * 1.5;
    }
    
    // 词汇多样性低扣分
    if (uniqueWordsRatio < 0.4) {
      score -= (0.4 - uniqueWordsRatio) * 50;
    }
    
    // 确保分数在0-100范围内
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * 评估文本连贯性
   */
  private static assessCoherence(segments: string[]): number {
    // 简化的连贯性评估
    // 检查是否使用了适当的过渡词
    
    const transitionWords = [
      '首先', '其次', '然后', '接着', '最后',
      '另外', '此外', '而且', '同时', '然而',
      '但是', '尽管', '虽然', '因此', '所以',
      '综上所述', '总而言之', '总的来说', '总体而言'
    ];
    
    let transitionCount = 0;
    for (const word of transitionWords) {
      if (segments.includes(word)) {
        transitionCount++;
      }
    }
    
    // 连贯性分数（0-100）
    // 假设每100个词至少需要2个过渡词才算良好
    const expectedTransitions = Math.max(1, Math.floor(segments.length / 50) * 2);
    const coherenceScore = Math.min(100, Math.round((transitionCount / expectedTransitions) * 100));
    
    return Math.max(0, coherenceScore);
  }

  /**
   * 评估主题相关性
   */
  private static assessTopicRelevance(text: string, segments: string[]): number {
    // 检查是否包含软考论文相关关键词
    const relevantKeywords = [
      '项目', '管理', '系统', '架构', '设计', '分析', '实施', '方案',
      '十大管理', '范围', '进度', '成本', '质量', '人力', '沟通',
      '风险', '采购', '干系人', '生命周期', '需求', '解决方案'
    ];
    
    let keywordCount = 0;
    for (const keyword of relevantKeywords) {
      if (text.includes(keyword)) {
        keywordCount++;
      }
    }
    
    // 使用segments计算相关性
    const segmentKeywordMatches = segments.filter(segment => 
      relevantKeywords.some(keyword => segment.includes(keyword))
    ).length;
    
    // 主题相关性分数（0-100）
    const relevanceScore = Math.min(100, Math.round(((keywordCount + segmentKeywordMatches) / relevantKeywords.length) * 100));
    
    return Math.max(0, relevanceScore);
  }

  /**
   * 生成改进建议
   */
  private static generateSuggestions(text: string, segments: string[]): string[] {
    const suggestions: string[] = [];
    const basic = this.basicAnalysis(text);
    
    // 检查句子长度
    if (basic.avgSentenceLength > 30) {
      suggestions.push(`当前平均句长为${basic.avgSentenceLength}字符，建议将长句拆分为短句以提高可读性`);
    }
    
    // 检查段落数量
    if (basic.paragraphCount < 3) {
      suggestions.push('段落数较少，建议按主题分段以改善结构');
    }
    
    // 检查词汇多样性
    const uniqueSegments = new Set(segments);
    const diversityRatio = uniqueSegments.size / segments.length;
    if (diversityRatio < 0.5) {
      suggestions.push('词汇重复率较高，建议丰富词汇表达');
    }
    
    // 检查过渡词使用
    const transitionWords = [
      '首先', '其次', '然后', '接着', '最后',
      '另外', '此外', '而且', '同时', '然而',
      '但是', '尽管', '虽然', '因此', '所以'
    ];
    
    const hasTransitions = transitionWords.some(word => text.includes(word));
    if (!hasTransitions) {
      suggestions.push('缺少过渡词，建议添加如"首先"、"其次"、"因此"等连接词以提高连贯性');
    }
    
    // 检查专业术语使用
    const professionalTerms = [
      '十大管理', '范围管理', '进度管理', '成本管理', '质量管理',
      '人力资源管理', '沟通管理', '风险管理', '采购管理', '干系人管理'
    ];
    
    const hasProfessionalTerms = professionalTerms.some(term => text.includes(term));
    if (!hasProfessionalTerms) {
      suggestions.push('缺少项目管理专业术语，建议融入"十大管理"等相关概念');
    }
    
    // 检查结论相关词汇
    const conclusionTerms = ['总结', '结论', '经验', '展望', '反思'];
    const hasConclusions = conclusionTerms.some(term => text.includes(term));
    if (!hasConclusions) {
      suggestions.push('缺少总结性词汇，建议在结尾处使用"总结"、"结论"、"经验"等词汇');
    }
    
    return suggestions;
  }
}

export default AdvancedChineseAnalyzer;
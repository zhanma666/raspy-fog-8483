/// <reference types="vite/client" />

// 类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 中文文本分析器类型声明
declare module '@/utils/chineseTextAnalyzer' {
  export interface TextError {
    type: 'repeated' | 'grammar' | 'style' | 'length';
    message: string;
    position: number;
    length: number;
    suggestion: string;
  }

  export interface TextSuggestion {
    type: 'improvement' | 'enhancement' | 'recommendation';
    message: string;
    position: number;
    relatedText: string;
  }

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

  class ChineseTextAnalyzer {
    static analyze(text: string): AnalysisResult;
    static countWords(text: string): number;
    static countCharacters(text: string): number;
    static countSentences(text: string): number;
    static countParagraphs(text: string): number;
    static findErrors(text: string): TextError[];
    static generateSuggestions(text: string): TextSuggestion[];
    static extractKeywords(text: string): string[];
    static calculateReadability(text: string): number;
    static evaluateStructure(text: string): {
      hasIntroduction: boolean;
      hasBody: boolean;
      hasConclusion: boolean;
      structureScore: number;
    };
  }

  export default ChineseTextAnalyzer;
}

// 高级中文分析器类型声明
declare module '@/utils/advancedChineseAnalyzer' {
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
    static analyze(text: string): AdvancedAnalysisResult;
    private static basicAnalysis(text: string): {
      charCount: number;
      wordCount: number;
      sentenceCount: number;
      paragraphCount: number;
      avgSentenceLength: number;
      textLength: number;
    };
    private static calculateWordFrequency(segments: string[]): Record<string, number>;
    private static calculateReadability(text: string, segments: string[]): number;
    private static assessCoherence(segments: string[]): number;
    private static assessTopicRelevance(text: string, segments: string[]): number;
    private static generateSuggestions(text: string, segments: string[]): string[];
  }

  export default AdvancedChineseAnalyzer;
}

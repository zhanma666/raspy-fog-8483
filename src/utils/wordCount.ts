// 字数统计工具

/**
 * 统计文本的字数
 * @param text 要统计的文本
 * @returns 字数统计结果
 */
export const countWords = (text: string): number => {
  // 移除空格、换行符等空白字符，只统计实际字符
  return text.replace(/\s/g, '').length;
};

/**
 * 检查文本是否在指定的字数范围内
 * @param text 要检查的文本
 * @param min 最小字数
 * @param max 最大字数
 * @returns 是否在范围内
 */
export const isWordCountValid = (text: string, min: number, max: number): boolean => {
  const count = countWords(text);
  return count >= min && count <= max;
};

/**
 * 获取字数统计信息
 * @param text 要统计的文本
 * @returns 包含字数和详细信息的对象
 */
export const getWordCountInfo = (text: string) => {
  const total = countWords(text);
  const chars = text.length;
  const spaces = (text.match(/\s/g) || []).length;
  const lines = (text.match(/\n/g) || []).length + 1;

  return {
    total,
    chars,
    spaces,
    lines,
    perLine: Math.round(total / lines) || 0
  };
};

/**
 * 格式化字数统计结果
 * @param info 字数统计信息
 * @returns 格式化的字符串
 */
export const formatWordCount = (info: ReturnType<typeof getWordCountInfo>): string => {
  return `总字数: ${info.total} | 字符数: ${info.chars} | 空格数: ${info.spaces} | 行数: ${info.lines} | 平均每行: ${info.perLine}字`;
};
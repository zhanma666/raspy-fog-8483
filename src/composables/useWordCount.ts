import { ref, watch } from 'vue';

/**
 * 字数统计 Composable
 * 用于处理表单对象的字数统计，支持自动更新和监听
 */
export const useWordCount = <T extends Record<string, string>>(initialData: T) => {
  // 存储表单数据
  const formData = ref<T>({ ...initialData });
  
  // 存储字数统计结果
  const wordCount = ref<number>(0);
  
  // 存储各个字段的字数
  const fieldCounts = ref<{ [K in keyof T]: number }>({} as { [K in keyof T]: number });
  
  // 计算总字数
  const calculateTotalWordCount = (): number => {
    let total = 0;
    const counts = {} as { [K in keyof T]: number };
    
    for (const key in formData.value) {
      const value = formData.value[key] || '';
      const count = value.length;
      (counts as any)[key] = count;
      total += count;
    }
    
    fieldCounts.value = counts;
    return total;
  };
  
  // 更新字数统计
  const updateWordCount = () => {
    wordCount.value = calculateTotalWordCount();
  };
  
  // 设置表单数据
  const setFormData = (data: Partial<T>) => {
    formData.value = { ...formData.value, ...data } as T;
    updateWordCount();
  };
  
  // 更新特定字段
  const updateField = (field: keyof T, value: string) => {
    (formData.value[field] as string) = value;
    updateWordCount();
  };
  
  // 监听表单数据变化，自动更新字数统计
  watch(formData, () => {
    updateWordCount();
  }, { deep: true });
  
  // 初始化字数统计
  updateWordCount();
  
  return {
    formData,
    wordCount,
    fieldCounts,
    calculateTotalWordCount,
    updateWordCount,
    setFormData,
    updateField
  };
};
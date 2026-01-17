// 检查论文案例字数是否符合考试大纲要求
import { paperCases, PaperCase } from '../src/store/paperCases';
import { examSyllabuses } from '../src/store/examSyllabus';
import { countWords } from '../src/utils/wordCount';

// 获取科目对应的考试大纲
const getSyllabusBySubject = (subject: string) => {
  return examSyllabuses.find(syllabus => syllabus.subject === subject);
};

// 检查每个案例的字数
const checkPaperCasesWordCount = () => {
  console.log('=== 论文案例字数检查 ===\n');
  
  let allValid = true;
  
  paperCases.forEach((paperCase: PaperCase, index: number) => {
    console.log(`案例 ${index + 1}: ${paperCase.title}`);
    console.log(`科目: ${paperCase.subject}`);
    
    // 获取对应的考试大纲
    const syllabus = getSyllabusBySubject(paperCase.subject);
    if (!syllabus) {
      console.log('❌ 未找到对应的考试大纲');
      allValid = false;
      console.log('\n');
      return;
    }
    
    // 统计各个部分的字数
    const content = paperCase.content;
    const sectionCounts = {
      abstract: countWords(content.abstract),
      background: countWords(content.background),
      problemAnalysis: countWords(content.problemAnalysis),
      solution: countWords(content.solution),
      implementation: countWords(content.implementation),
      results: countWords(content.results),
      conclusion: countWords(content.conclusion)
    };
    
    const totalCount = Object.values(sectionCounts).reduce((sum, count) => sum + count, 0);
    
    console.log(`总字数: ${totalCount}`);
    
    // 检查是否符合大纲要求
    const paperStructure = syllabus.paperStructure;
    let caseValid = true;
    
    // 由于大纲中没有单独的摘要部分，我们检查其他主要部分
    const sectionsToCheck = [
      { name: 'background', title: '项目背景', expectedSection: paperStructure.find(s => s.title.includes('背景')) },
      { name: 'problemAnalysis', title: '问题分析', expectedSection: paperStructure.find(s => s.title.includes('问题')) },
      { name: 'solution', title: '解决方案', expectedSection: paperStructure.find(s => s.title.includes('方案') || s.title.includes('解决') || s.title.includes('设计')) },
      { name: 'implementation', title: '实施过程', expectedSection: paperStructure.find(s => s.title.includes('实施') || s.title.includes('实现')) },
      { name: 'results', title: '实施效果', expectedSection: paperStructure.find(s => s.title.includes('效果') || s.title.includes('结果')) },
      { name: 'conclusion', title: '结论与展望', expectedSection: paperStructure.find(s => s.title.includes('结论') || s.title.includes('展望') || s.title.includes('总结')) }
    ];
    
    sectionsToCheck.forEach(({ name, title, expectedSection }) => {
      if (expectedSection) {
        const count = sectionCounts[name as keyof typeof sectionCounts];
        const { minWordCount, maxWordCount } = expectedSection;
        const isValid = count >= minWordCount && count <= maxWordCount;
        
        console.log(`${isValid ? '✅' : '❌'} ${title}: ${count}字 (要求: ${minWordCount}-${maxWordCount}字)`);
        
        if (!isValid) {
          caseValid = false;
        }
      }
    });
    
    console.log(`整体状态: ${caseValid ? '✅ 符合要求' : '❌ 不符合要求'}`);
    console.log('\n');
    
    if (!caseValid) {
      allValid = false;
    }
  });
  
  console.log('=== 检查完成 ===');
  console.log(`总体结果: ${allValid ? '✅ 所有案例都符合大纲要求' : '❌ 部分案例不符合大纲要求'}`);
  
  return allValid;
};

// 执行检查
checkPaperCasesWordCount();
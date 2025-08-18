/**
 * 日期类型处理最佳实践示例
 * 
 * 这个文件展示了如何在前端正确处理日期类型：
 * 1. 网络传输使用 ISO 字符串 (DTO 类型)
 * 2. UI 组件使用 Date 对象 (UI Model 类型)
 * 3. 在 API 边界进行统一转换
 */

import type { Quiz, QuizDTO } from './types';
import { 
  convertQuizDTOToQuiz, 
  convertQuizToQuizDTO 
} from './types';
import * as quizzesClient from './client';

// ❌ 错误示例：在组件里手动转换日期
function BadExample() {
  const handleQuizData = (quizFromAPI: any) => {
    // 不好：到处都要手动转换，容易出错
    const availableDate = quizFromAPI.availableDate 
      ? new Date(quizFromAPI.availableDate) 
      : null;
    
    const dueDate = quizFromAPI.dueDate 
      ? new Date(quizFromAPI.dueDate) 
      : null;
    
    // 使用转换后的日期...
    console.log('Available:', availableDate?.toLocaleDateString());
    console.log('Due:', dueDate?.toLocaleDateString());
  };
}

// ✅ 正确示例：在 API 边界统一转换
function GoodExample() {
  const handleQuizData = async (quizId: string) => {
    // 好：API client 已经返回了正确的 Date 类型
    const quiz: Quiz = await quizzesClient.findQuizById(quizId);
    
    // 直接使用 Date 对象，无需手动转换
    console.log('Available:', quiz.availableDate?.toLocaleDateString());
    console.log('Due:', quiz.dueDate?.toLocaleDateString());
    
    // 日期计算也很简单
    const now = new Date();
    const isAvailable = quiz.availableDate ? now >= quiz.availableDate : false;
    const isDue = quiz.dueDate ? now >= quiz.dueDate : false;
    
    return { quiz, isAvailable, isDue };
  };
}

// 类型定义的好处展示
function TypeBenefitsExample() {
  // 网络数据 (DTO) - 日期是字符串
  const quizFromAPI: QuizDTO = {
    _id: '123',
    title: 'Test Quiz',
    description: 'A test quiz',
    courseId: 'course-123',
    quizType: 'graded',
    points: 100,
    assignmentGroup: 'Quizzes',
    shuffleAnswers: false,
    timeLimit: 60,
    multipleAttempts: false,
    attemptsAllowed: 1,
    showCorrectAnswers: 'never',
    accessCode: '',
    oneQuestionAtATime: false,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    availableDate: '2024-01-01T00:00:00.000Z', // 字符串
    dueDate: '2024-01-15T23:59:59.999Z',       // 字符串
    untilDate: null,
    questions: [],
    isPublished: true,
    createdAt: '2024-01-01T00:00:00.000Z',    // 字符串
    updatedAt: '2024-01-01T00:00:00.000Z'     // 字符串
  };
  
  // 转换为 UI 模型 - 日期是 Date 对象
  const quiz: Quiz = convertQuizDTOToQuiz(quizFromAPI);
  
  // 现在可以直接使用 Date 方法
  console.log('Quiz available since:', quiz.availableDate?.getFullYear());
  console.log('Days until due:', 
    quiz.dueDate ? Math.ceil((quiz.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 'No due date'
  );
  
  // 保存时转换回 DTO
  const updatedQuiz: Quiz = {
    ...quiz,
    title: 'Updated Quiz Title',
    updatedAt: new Date() // 直接用 Date 对象
  };
  
  const dtoForAPI: QuizDTO = convertQuizToQuizDTO(updatedQuiz);
  // API client 会自动处理转换
}

export { BadExample, GoodExample, TypeBenefitsExample };

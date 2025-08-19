import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addQuiz, updateQuiz } from '../reducer';
import * as quizzesClient from '../client';
import * as coursesClient from '../../client';
import type { Quiz } from '../types';

/**
 * SIMPLIFIED QUIZ EDITOR CUSTOM HOOKS
 * 
 * Simplified version that removes complex state management and Redux dependencies
 */

// Helper functions for date formatting
const formatDateForServer = (dateTimeLocal: string) => {
  if (!dateTimeLocal) return '';
  return new Date(dateTimeLocal).toISOString();
};

const formatDateForInput = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Simplified useQuizEditor Hook
 * 
 * - Fetches quiz data from backend
 * - Manages loading state
 * - No complex Redux store logic
 */
export const useQuizEditor = (qid: string) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isNewQuiz = qid === 'new';
  
  useEffect(() => {
    if (isNewQuiz) {
      setLoading(false);
      return;
    }
    
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizzesClient.findQuizById(qid);
        if (data) {
          setQuiz(data);
        } else {
          setError('Quiz not found');
        }
      } catch (err) {
        setError('Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [qid, isNewQuiz]);
  
  return { 
    quiz, 
    loading, 
    error, 
    isNewQuiz,
    // Keep hasHydratedRef for backward compatibility
    hasHydratedRef: { current: false }
  };
};

/**
 * Simplified useQuizForm Hook
 * 
 * - Simple form state management
 * - No complex hydration logic
 * - Direct form updates
 */
export const useQuizForm = (quiz: Quiz | null, cid: string) => {
  const [quizForm, setQuizForm] = useState<Quiz>({
    _id: quiz?._id,
    title: quiz?.title ?? 'New Quiz',
    description: quiz?.description ?? 'Quiz description',
    courseId: quiz?.courseId || cid || '',
    quizType: quiz?.quizType ?? 'Graded Quiz',
    points: quiz?.points ?? 100,
    assignmentGroup: quiz?.assignmentGroup ?? 'Quizzes',
    shuffleAnswers: quiz?.shuffleAnswers ?? true,
    timeLimit: quiz?.timeLimit ?? 20,
    multipleAttempts: quiz?.multipleAttempts ?? false,
    attemptsAllowed: quiz?.attemptsAllowed ?? 1,
    showCorrectAnswers: quiz?.showCorrectAnswers ?? 'never',
    customShowDate: quiz?.customShowDate || '',
    accessCode: quiz?.accessCode ?? '',
    oneQuestionAtATime: quiz?.oneQuestionAtATime ?? true,
    webcamRequired: quiz?.webcamRequired ?? false,
    lockQuestionsAfterAnswering: quiz?.lockQuestionsAfterAnswering ?? false,
    dueDate: quiz?.dueDate ? formatDateForInput(quiz.dueDate) : '',
    availableDate: quiz?.availableDate ? formatDateForInput(quiz.availableDate) : new Date().toISOString().slice(0, 16),
    untilDate: quiz?.untilDate ? formatDateForInput(quiz.untilDate) : '',
    questions: quiz?.questions ?? [],
    isPublished: quiz?.isPublished ?? false,
    createdAt: quiz?.createdAt ?? new Date().toISOString(),
    updatedAt: quiz?.updatedAt ?? new Date().toISOString(),
  });

  // Update form when quiz changes
  useEffect(() => {
    if (!quiz) return;
    
    setQuizForm({
      _id: quiz._id,
      title: quiz.title ?? 'New Quiz',
      description: quiz.description ?? 'Quiz description',
      courseId: quiz.courseId || cid || '',
      quizType: quiz.quizType ?? 'Graded Quiz',
      points: quiz.points ?? 100,
      assignmentGroup: quiz.assignmentGroup ?? 'Quizzes',
      shuffleAnswers: quiz.shuffleAnswers ?? true,
      timeLimit: quiz.timeLimit ?? 20,
      multipleAttempts: quiz.multipleAttempts ?? false,
      attemptsAllowed: quiz.attemptsAllowed ?? 1,
      showCorrectAnswers: quiz.showCorrectAnswers ?? 'never',
      customShowDate: quiz.customShowDate || '',
      accessCode: quiz.accessCode ?? '',
      oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
      webcamRequired: quiz.webcamRequired ?? false,
      lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering ?? false,
      dueDate: formatDateForInput(quiz.dueDate || ''),
      availableDate: formatDateForInput(quiz.availableDate || ''),
      untilDate: formatDateForInput(quiz.untilDate || ''),
      questions: quiz.questions ?? [],
      isPublished: quiz.isPublished ?? false,
      createdAt: quiz.createdAt ?? new Date().toISOString(),
      updatedAt: quiz.updatedAt ?? new Date().toISOString(),
    });
  }, [quiz, cid]);

  const handleFormChange = (field: keyof Quiz, value: any) => {
    setQuizForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    quizForm,
    handleFormChange,
  };
};

/**
 * Simplified useQuizActions Hook
 * 
 * - Same save/publish logic
 * - No complex state management
 */
export const useQuizActions = (cid: string, qid: string, quizForm: Quiz, isNewQuiz: boolean) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      const quizData = {
        ...quizForm,
        dueDate: quizForm.dueDate ? formatDateForServer(quizForm.dueDate) : '',
        untilDate: quizForm.untilDate ? formatDateForServer(quizForm.untilDate) : '',
        availableDate: quizForm.availableDate ? formatDateForServer(quizForm.availableDate) : '',
      };

      if (isNewQuiz) {
        const newQuiz = await coursesClient.createQuizForCourse(cid, quizData);
        dispatch(addQuiz(newQuiz));
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}`);
      } else {
        const updatedQuiz = await quizzesClient.updateQuiz(qid, quizData);
        dispatch(updateQuiz(updatedQuiz));
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch (error: any) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      const quizData = {
        ...quizForm,
        isPublished: true,
        dueDate: quizForm.dueDate ? formatDateForServer(quizForm.dueDate) : '',
        untilDate: quizForm.untilDate ? formatDateForServer(quizForm.untilDate) : '',
        availableDate: quizForm.availableDate ? formatDateForServer(quizForm.availableDate) : '',
      };

      if (isNewQuiz) {
        const newQuiz = await coursesClient.createQuizForCourse(cid, quizData);
        dispatch(addQuiz(newQuiz));
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } else {
        const updatedQuiz = await quizzesClient.updateQuiz(qid, quizData);
        dispatch(updateQuiz(updatedQuiz));
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
    } catch (error: any) {
      console.error('Error saving and publishing quiz:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  return {
    handleSave,
    handleSaveAndPublish,
    handleCancel,
  };
};
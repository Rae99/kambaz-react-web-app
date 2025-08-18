import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addQuiz, updateQuiz } from '../reducer';
import * as quizzesClient from '../client';
import * as coursesClient from '../../client';
import type { Quiz } from '../types';

/**
 * QUIZ EDITOR CUSTOM HOOKS
 * 
 * This file contains three main custom hooks that separate concerns in the Quiz Editor:
 * 
 * 1. useQuizEditor - Manages quiz fetching, state, and navigation logic
 * 2. useQuizForm - Handles form state management and hydration
 * 3. useQuizActions - Manages save, publish, and cancel actions
 * 
 * Each hook is responsible for a specific aspect of the quiz editing workflow,
 * making the main component cleaner and more maintainable.
 */

// Function to convert datetime-local format to ISO string
const formatDateForServer = (dateTimeLocal: string) => {
  if (!dateTimeLocal) return '';
  return new Date(dateTimeLocal).toISOString();
};

// Function to convert ISO string to datetime-local format
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
 * useQuizEditor Hook
 * 
 * Manages quiz fetching, state, and navigation logic:
 * - Fetches quiz data from the server or Redux store
 * - Manages loading states (idle, loading, ok, notfound, error)
 * - Handles navigation when quiz is not found
 * - Provides quiz data and metadata for the editor
 * 
 * @param cid - Course ID
 * @param qid - Quiz ID (or 'new' for new quizzes)
 * @returns Object containing quiz data, loading state, and metadata
 */
export const useQuizEditor = (cid: string, qid: string) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const isNewQuiz = qid === 'new';

  const [fetchState, setFetchState] = useState<
    'idle' | 'loading' | 'ok' | 'notfound' | 'error'
  >('idle');
  const hasHydratedRef = useRef(false);

  const quiz = isNewQuiz ? null : quizzes.find((q: Quiz) => q._id === qid);

  // Fetch quiz data
  useEffect(() => {
    if (isNewQuiz) {
      setFetchState('ok');
      return;
    }

    if (quiz) {
      setFetchState('ok');
      return;
    }

    let cancelled = false;
    setFetchState('loading');
    (async () => {
      try {
        const data = await quizzesClient.findQuizById(qid!);
        if (cancelled) return;
        if (data) {
          dispatch(updateQuiz(data));
          setFetchState('ok');
        } else {
          setFetchState('notfound');
        }
      } catch {
        setFetchState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isNewQuiz, qid, quiz, dispatch]);

  // Redirect logic
  useEffect(() => {
    if (isNewQuiz) return;
    if (fetchState === 'notfound') {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  }, [isNewQuiz, fetchState, cid, navigate]);

  return {
    quiz,
    isNewQuiz,
    fetchState,
    hasHydratedRef,
  };
};

/**
 * useQuizForm Hook
 * 
 * Handles form state management and hydration:
 * - Initializes quiz form with default values or existing quiz data
 * - Manages form state updates and field changes
 * - Handles one-time form hydration to prevent overwriting user edits
 * - Provides form data and change handlers
 * 
 * @param quiz - Current quiz data (null for new quizzes)
 * @param cid - Course ID
 * @param _qid - Quiz ID (unused, kept for API consistency)
 * @param hasHydratedRef - Ref to track if form has been hydrated
 * @returns Object containing form state and change handlers
 */
export const useQuizForm = (quiz: Quiz | null, cid: string, _qid: string, hasHydratedRef: React.MutableRefObject<boolean>) => {
  const [quizForm, setQuizForm] = useState<Quiz>({
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
    dueDate: quiz?.dueDate
      ? new Date(quiz.dueDate).toISOString().slice(0, 16)
      : '',
    availableDate: quiz?.availableDate
      ? new Date(quiz.availableDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    untilDate: quiz?.untilDate
      ? new Date(quiz.untilDate).toISOString().slice(0, 16)
      : '',
    questions: quiz?.questions ?? [],
    isPublished: quiz?.isPublished ?? false,
    createdAt: quiz?.createdAt ?? new Date().toISOString(),
    updatedAt: quiz?.updatedAt ?? new Date().toISOString(),
  });

  // Hydrate form only once
  useEffect(() => {
    if (!quiz) return;
    if (hasHydratedRef.current) return;

    setQuizForm({
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

    hasHydratedRef.current = true;
  }, [quiz, cid, hasHydratedRef]);

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
 * useQuizActions Hook
 * 
 * Manages save, publish, and cancel actions:
 * - Handles quiz saving (create new or update existing)
 * - Manages quiz publishing workflow
 * - Handles navigation after successful actions
 * - Clears draft data from localStorage
 * - Provides action handlers for the UI
 * 
 * @param cid - Course ID
 * @param qid - Quiz ID (or 'new' for new quizzes)
 * @param quizForm - Current form data to save
 * @param isNewQuiz - Whether this is a new quiz creation
 * @returns Object containing action handlers
 */
export const useQuizActions = (cid: string, qid: string, quizForm: Quiz, isNewQuiz: boolean) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clearDraft = () => {
    const draftKey = qid && qid !== 'new' 
      ? `quiz-draft-${cid}-${qid}` 
      : `quiz-draft-${cid}-new`;
    localStorage.removeItem(draftKey);
  };

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
        clearDraft();
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}`);
      } else {
        const updatedQuiz = await quizzesClient.updateQuiz(qid, quizData);
        dispatch(updateQuiz(updatedQuiz));
        clearDraft();
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
        clearDraft();
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } else {
        const updatedQuiz = await quizzesClient.updateQuiz(qid, quizData);
        dispatch(updateQuiz(updatedQuiz));
        clearDraft();
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

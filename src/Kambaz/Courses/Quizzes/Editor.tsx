import {
  useParams,
  useNavigate,
  Routes,
  Route,
  Navigate,
  NavLink,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { addQuiz, updateQuiz } from './reducer';
import * as quizzesClient from './client';
import QuizDetailsEditor from './QuizDetailsEditor';
import QuizQuestionsEditor from './QuizQuestionsEditor';
import type { Quiz } from './types';
import * as coursesClient from '../client';

// Function to convert datetime-local format to ISO string
const formatDateForServer = (dateTimeLocal: string) => {
  if (!dateTimeLocal) return '';
  // datetime-local gives us "YYYY-MM-DDTHH:MM"
  // We need to add seconds and timezone: "YYYY-MM-DDTHH:MM:00.000Z"
  return new Date(dateTimeLocal).toISOString();
};

// Function to convert ISO string to datetime-local format
const formatDateForInput = (isoString: string) => {
  if (!isoString) return '';
  // ISO string: "2024-01-22T23:59:00.000Z"
  // datetime-local needs: "YYYY-MM-DDTHH:MM"
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function QuizEditor() {
  const params = useParams();
  const { cid, qid } = params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const isNewQuiz = qid === 'new';

  const [fetchState, setFetchState] = useState<
    'idle' | 'loading' | 'ok' | 'notfound' | 'error'
  >('idle');
  const hasHydratedRef = useRef(false);

  const quiz = isNewQuiz ? null : quizzes.find((q: Quiz) => q._id === qid);

  // 1) Fetch + mark loading state
  useEffect(() => {
    if (isNewQuiz) {
      // For new quiz, don't fetch data, just set state to ok
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
          dispatch(updateQuiz(data)); // 或 upsert
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

  // 2) Redirect logic (only redirect when backend confirms no data)
  useEffect(() => {
    if (isNewQuiz) return;
    if (fetchState === 'notfound') {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  }, [isNewQuiz, fetchState, cid, navigate]);

  // State for form fields
  const [quizForm, setQuizForm] = useState<Quiz>({
    title: quiz?.title ?? 'New Quiz',
    description: quiz?.description ?? 'Quiz description',
    courseId: quiz?.courseId || cid || '',
    quizType: quiz?.quizType ?? 'Graded Quiz',
    points: quiz?.points ?? 100,
    assignmentGroup: quiz?.assignmentGroup ?? 'Quizzes',
    shuffleAnswers: quiz?.shuffleAnswers ?? true, // Default: Yes
    timeLimit: quiz?.timeLimit ?? 20, // Default: 20 Minutes
    multipleAttempts: quiz?.multipleAttempts ?? false, // Default: No
    attemptsAllowed: quiz?.attemptsAllowed ?? 1, // Default: 1
    showCorrectAnswers: quiz?.showCorrectAnswers ?? 'never',
    customShowDate: quiz?.customShowDate || '',
    accessCode: quiz?.accessCode ?? '',
    oneQuestionAtATime: quiz?.oneQuestionAtATime ?? true, // Default: Yes
    webcamRequired: quiz?.webcamRequired ?? false, // Default: No
    lockQuestionsAfterAnswering: quiz?.lockQuestionsAfterAnswering ?? false, // Default: No
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

  // 3) Hydrate form only once (avoid being overwritten)
  useEffect(() => {
    if (isNewQuiz) return;
    if (!quiz) return;
    if (hasHydratedRef.current) return;
    // Hydrate the form only once to avoid overwriting user edits.
    // - Start with hasHydratedRef = false.
    // - The first time a quiz loads, copy quiz -> form, then set hasHydratedRef = true.
    // - Later Redux updates or PUT responses may replace the quiz object,
    //   but we DO NOT re-hydrate, so in-progress edits are not blown away.

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
  }, [isNewQuiz, quiz, cid]);

  const handleFormChange = (field: keyof Quiz, value: any) => {
    setQuizForm((prev) => {
      const newForm = {
        ...prev,
        [field]: value,
      };

      return newForm;
    });
  };

  const handleSave = async () => {
    try {
      // Convert date formats before sending to server
      const quizData = {
        ...quizForm,
        dueDate: quizForm.dueDate ? formatDateForServer(quizForm.dueDate) : '',
        untilDate: quizForm.untilDate
          ? formatDateForServer(quizForm.untilDate)
          : '',
        availableDate: quizForm.availableDate
          ? formatDateForServer(quizForm.availableDate)
          : '',
      };
      console.log('Saving quiz data:', quizData);
      console.log('Original dueDate:', quizForm.dueDate);
      console.log('Formatted dueDate:', quizData.dueDate);
      console.log('Original untilDate:', quizForm.untilDate);
      console.log('Formatted untilDate:', quizData.untilDate);

      if (isNewQuiz) {
        const newQuiz = await coursesClient.createQuizForCourse(cid!, quizData);
        dispatch(addQuiz(newQuiz));

        // Clear draft after successful save
        const draftKey =
          qid && qid !== 'new'
            ? `quiz-draft-${cid}-${qid}`
            : `quiz-draft-${cid}-new`;
        localStorage.removeItem(draftKey);

        navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}`);
      } else {
        const updatedQuiz = await quizzesClient.updateQuiz(qid!, quizData);
        console.log('Updated quiz response:', updatedQuiz);
        dispatch(updateQuiz(updatedQuiz));

        // Clear draft after successful save
        const draftKey =
          qid && qid !== 'new'
            ? `quiz-draft-${cid}-${qid}`
            : `quiz-draft-${cid}-new`;
        localStorage.removeItem(draftKey);

        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      // Convert date formats before sending to server
      const quizData = {
        ...quizForm,
        isPublished: true,
        dueDate: quizForm.dueDate ? formatDateForServer(quizForm.dueDate) : '',
        untilDate: quizForm.untilDate
          ? formatDateForServer(quizForm.untilDate)
          : '',
        availableDate: quizForm.availableDate
          ? formatDateForServer(quizForm.availableDate)
          : '',
      };
      console.log('Saving and publishing quiz data:', quizData);
      console.log('Original dueDate:', quizForm.dueDate);
      console.log('Formatted dueDate:', quizData.dueDate);
      console.log('Original untilDate:', quizForm.untilDate);
      console.log('Formatted untilDate:', quizData.untilDate);

      if (isNewQuiz) {
        const newQuiz = await coursesClient.createQuizForCourse(cid!, quizData);
        dispatch(addQuiz(newQuiz));

        // Clear draft after successful save and publish
        const draftKey =
          qid && qid !== 'new'
            ? `quiz-draft-${cid}-${qid}`
            : `quiz-draft-${cid}-new`;
        localStorage.removeItem(draftKey);

        // Navigate to quiz list after save and publish
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } else {
        const updatedQuiz = await quizzesClient.updateQuiz(qid!, quizData);
        console.log('Updated quiz response (save and publish):', updatedQuiz);
        dispatch(updateQuiz(updatedQuiz));

        // Clear draft after successful save and publish
        const draftKey =
          qid && qid !== 'new'
            ? `quiz-draft-${cid}-${qid}`
            : `quiz-draft-${cid}-new`;
        localStorage.removeItem(draftKey);

        // Navigate to quiz list after save and publish
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
    } catch (error: any) {
      console.error('Error saving and publishing quiz:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  // Show loading state while fetching quiz
  if (!isNewQuiz && fetchState === 'loading') {
    return (
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (!isNewQuiz && fetchState === 'error') {
    return (
      <div className="container">
        <div className="alert alert-danger">
          Error loading quiz. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div id="wd-quiz-editor" className="container">
      {/* Header with Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{isNewQuiz ? 'Create New Quiz' : 'Edit Quiz'}</h3>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Points:{' '}
            {quizForm.questions?.reduce(
              (sum: number, q: any) => sum + q.points,
              0
            ) || 0}
          </span>
          <Button
            variant={quizForm.isPublished ? 'success' : 'secondary'}
            size="sm"
            onClick={() =>
              handleFormChange('isPublished', !quizForm.isPublished)
            }
            className="d-flex align-items-center gap-2"
          >
            {quizForm.isPublished ? 'Published' : 'Not Published'}
            <span className="ms-1">{quizForm.isPublished ? '✅' : '🚫'}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <NavLink
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/details`}
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Details
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/questions`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Questions
          </NavLink>
        </li>
      </ul>

      {/* Tab Content */}
      <Routes>
        <Route
          path="details"
          element={
            <QuizDetailsEditor
              quizForm={quizForm}
              onFormChange={handleFormChange}
              onSave={handleSave}
              onSaveAndPublish={handleSaveAndPublish}
              onCancel={handleCancel}
            />
          }
        />
        <Route
          path="questions"
          element={
            <QuizQuestionsEditor
              questions={quizForm.questions}
              quizId={isNewQuiz ? undefined : qid}
              onQuestionsChange={(questions) => {
                handleFormChange('questions', questions);
              }}
              onSave={handleSave}
              onSaveAndPublish={handleSaveAndPublish}
              onCancel={handleCancel}
            />
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/details`}
              replace
            />
          }
        />
        <Route
          path=""
          element={
            <Navigate
              to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/details`}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

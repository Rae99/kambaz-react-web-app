import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import * as quizzesClient from '../client';
import type { Quiz } from '../types';
import {
  getAvailabilityStatusText,
  getAvailabilityColourVariant,
} from '../quiz-rules';
import QuizHeader from './QuizHeader';
import QuizInformationCards from './QuizInformationCards';
import QuizAvailabilityCard from './QuizAvailabilityCard';
import QuizDetailsCardFacultyOnly from './QuizDetailsCardFacultyOnly';
import StudentQuizCards from './StudentQuizCards';
import QuizQuestionsPreview from './QuizQuestionsPreview';

/**
 * Quiz Details Main Component
 * Displays comprehensive quiz information with different views for faculty and students
 */
export default function QuizDetails() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is faculty (has elevated permissions)
  const isFaculty =
    currentUser?.role === 'FACULTY' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'TA';

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        // Special case: if qid is 'new', redirect to editor
        if (qid === 'new') {
          navigate(`/Kambaz/Courses/${cid}/Quizzes/new/edit`);
          return;
        }

        try {
          setLoading(true);
          const quizData = await quizzesClient.findQuizById(qid);
          setQuiz(quizData);
        } catch (error) {
          console.error('Error fetching quiz:', error);
          setError('Failed to fetch quiz details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [qid, cid, navigate]);

  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  const handleDeleteQuiz = async () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizzesClient.deleteQuiz(qid!);
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } catch (error) {
        console.error('Error deleting quiz:', error);
        setError('Failed to delete quiz');
      }
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (quiz) {
        const updatedQuiz = { ...quiz, isPublished: !quiz.isPublished };
        await quizzesClient.updateQuiz(qid!, updatedQuiz);

        const freshQuiz = await quizzesClient.findQuizById(qid!);
        setQuiz(freshQuiz);
      }
    } catch (error) {
      console.error('Error toggling quiz publish status:', error);
      setError('Failed to update quiz publish status');
    }
  };

  const handleEditQuestions = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/questions`);
  };

  const handlePreview = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!quiz) {
    return <Alert variant="warning">Quiz not found</Alert>;
  }

  // Calculate derived values
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
  const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;
  const availabilityStatus = getAvailabilityStatusText(quiz);
  const availabilityColourVariant = getAvailabilityColourVariant(quiz);
  const totalPoints = quiz.points || 0; // Use quiz.points directly - keep it simple

  return (
    <div className="quiz-details">
      {/* Header */}
      <QuizHeader
        quiz={quiz}
        isFaculty={isFaculty}
        onEdit={handleEditQuiz}
        onDelete={handleDeleteQuiz}
        onTogglePublish={handleTogglePublish}
      />

      {/* Quiz Information Cards */}
      <QuizInformationCards quiz={quiz} totalPoints={totalPoints} />

      {/* Availability Status */}
      <QuizAvailabilityCard
        availabilityStatus={availabilityStatus}
        availabilityColourVariant={availabilityColourVariant}
        availableDate={availableDate}
        untilDate={untilDate}
        dueDate={dueDate}
      />

      {/* Faculty View - Quiz Details */}
      {isFaculty && <QuizDetailsCardFacultyOnly quiz={quiz} />}

      {/* Student View - Quiz Cards */}
      {!isFaculty && <StudentQuizCards quiz={quiz} />}

      {/* Questions Preview (Faculty only) */}
      {isFaculty && quiz.questions && quiz.questions.length > 0 && (
        <QuizQuestionsPreview
          quiz={quiz}
          totalPoints={totalPoints}
          onEditQuestions={handleEditQuestions}
          onPreview={handlePreview}
        />
      )}
    </div>
  );
}

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import StudentQuizTaking from './StudentQuizTaking';
import StudentQuizReview from './StudentQuizReview';
import StudentQuizInfo from './StudentQuizInfo';
import { useStudentQuiz } from './StudentQuizHooks';

/**
 * StudentQuiz Main Component
 *
 * This is the main orchestrator component that coordinates all student quiz functionality.
 * It has been refactored from a monolithic component to use specialized sub-components:
 *
 * Component Responsibilities:
 * - StudentQuizTaking - Handles the interactive quiz taking interface
 * - StudentQuizReview - Displays the results after quiz completion
 * - StudentQuizInfo - Shows quiz information and attempt history
 *
 * Custom Hook Responsibilities:
 * - useStudentQuiz - Manages quiz data, state, and business logic
 *
 * The main component focuses purely on orchestrating these concerns through
 * component composition, making it much more maintainable.
 */

interface StudentQuizProps {
  mode: 'take' | 'review';
  attemptId?: string;
}

export default function StudentQuiz({ mode: initialMode }: StudentQuizProps) {
  const { qid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Check if user is student
  const isStudent = currentUser?.role === 'STUDENT';

  // Use custom hook for student quiz logic
  const {
    mode,
    quiz,
    loading,
    error,
    currentQuestionIndex,
    quizAttempt,
    existingAttempts,
    getTimeSpent,
    getRemainingTime,
    isQuestionAnswered,
    areAllQuestionsAnswered,
    handleAnswerChange,
    handleBlankAnswerChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitQuiz,
    handleTakeQuiz,
    handleReviewAttempt,
  } = useStudentQuiz(qid!, initialMode);

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

  if (!isStudent) {
    return <Alert variant="warning">Access denied. Students only.</Alert>;
  }

  // If reviewing, show the attempt results
  if (mode === 'review' && quizAttempt.isCompleted) {
    return (
      <StudentQuizReview
        quiz={quiz}
        quizAttempt={quizAttempt}
        existingAttempts={existingAttempts}
        onTakeQuiz={handleTakeQuiz}
        onReviewAttempt={handleReviewAttempt}
      />
    );
  }

  // If taking quiz, show the quiz interface
  if (mode === 'take') {
    return (
      <StudentQuizTaking
        quiz={quiz}
        currentQuestionIndex={currentQuestionIndex}
        quizAttempt={quizAttempt}
        existingAttempts={existingAttempts}
        onAnswerChange={handleAnswerChange}
        onBlankAnswerChange={handleBlankAnswerChange}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        onSubmitQuiz={handleSubmitQuiz}
        areAllQuestionsAnswered={areAllQuestionsAnswered}
        getTimeSpent={getTimeSpent}
        getRemainingTime={getRemainingTime}
        isQuestionAnswered={isQuestionAnswered}
      />
    );
  }

  // Default view - show quiz info and options
  return (
    <StudentQuizInfo
      quiz={quiz}
      existingAttempts={existingAttempts}
      onTakeQuiz={handleTakeQuiz}
      onReviewAttempt={handleReviewAttempt}
    />
  );
}

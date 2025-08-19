import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import QuizPreviewInterface from './QuizPreviewInterface';
import QuizPreviewResults from './QuizPreviewResults';
import { useQuizPreview } from './QuizPreviewHooks';

/**
 * QuizPreview Main Component
 *
 * This is the main orchestrator component that coordinates all quiz preview functionality.
 * It has been refactored from a monolithic component to use specialized sub-components:
 *
 * Component Responsibilities:
 * - QuizPreviewInterface - Handles the interactive quiz taking interface
 * - QuizPreviewResults - Displays the results after quiz completion
 *
 * Custom Hook Responsibilities:
 * - useQuizPreview - Manages quiz data, state, and business logic
 *
 * The main component focuses purely on orchestrating these concerns through
 * component composition, making it much more maintainable.
 */

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Check if user is faculty
  const isFaculty =
    currentUser?.role === 'FACULTY' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'TA';

  // Use custom hook for quiz preview logic
  const {
    quiz,
    loading,
    error,
    currentQuestionIndex,
    quizAttempt,
    areAllQuestionsAnswered,
    handleAnswerChange,
    handleBlankAnswerChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleJumpToQuestion,
    handleSubmitQuiz,
  } = useQuizPreview(qid!);

  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
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

  if (!isFaculty) {
    return <Alert variant="warning">Access denied. Faculty only.</Alert>;
  }

  if (quizAttempt.isCompleted) {
    // Show results
    return (
      <QuizPreviewResults
        quiz={quiz}
        quizAttempt={quizAttempt}
        onEditQuiz={handleEditQuiz}
      />
    );
  }

  // Show quiz taking interface
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quiz Preview - {quiz.title}</h1>
        <Button variant="outline-primary" onClick={handleEditQuiz}>
          <FaEdit className="me-2" />
          Edit Quiz
        </Button>
      </div>

      <QuizPreviewInterface
        quiz={quiz}
        currentQuestionIndex={currentQuestionIndex}
        quizAttempt={quizAttempt}
        onAnswerChange={handleAnswerChange}
        onBlankAnswerChange={handleBlankAnswerChange}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        onJumpToQuestion={handleJumpToQuestion}
        onSubmitQuiz={handleSubmitQuiz}
        areAllQuestionsAnswered={areAllQuestionsAnswered}
      />
    </div>
  );
}

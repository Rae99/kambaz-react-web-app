/**
 * LoadingStates Component
 *
 * Manages loading and error state displays:
 * - Shows loading spinner while fetching quiz data
 * - Displays error messages when quiz loading fails
 * - Returns null when no loading/error state is needed
 * - Handles different states for new vs existing quizzes
 *
 * This component provides user feedback during asynchronous operations
 * and error handling in the quiz editor workflow.
 */

interface LoadingStatesProps {
  loading: boolean;
  error: string | null;
  isNewQuiz: boolean;
}

export default function LoadingStates({
  loading,
  error,
  isNewQuiz,
}: LoadingStatesProps) {
  // Show loading state while fetching quiz
  if (!isNewQuiz && loading) {
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
  if (!isNewQuiz && error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return null;
}

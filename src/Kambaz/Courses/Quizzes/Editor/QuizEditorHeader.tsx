import { Button } from 'react-bootstrap';
import type { Quiz } from '../types';
import { calculateQuizTotalPoints } from '../quiz-rules';

/**
 * QuizEditorHeader Component
 *
 * Handles the header with title, points display, and publish toggle:
 * - Displays quiz title (Create New Quiz / Edit Quiz)
 * - Shows total points calculated from quiz questions
 * - Provides publish/unpublish toggle button with visual indicators
 * - Uses helper functions from quiz-rules for point calculations
 *
 * This component is responsible for the top section of the quiz editor,
 * giving users a clear overview of the quiz status and basic actions.
 */

interface QuizEditorHeaderProps {
  isNewQuiz: boolean;
  quizForm: Quiz;
  onPublishToggle: (isPublished: boolean) => void;
}

export default function QuizEditorHeader({
  isNewQuiz,
  quizForm,
  onPublishToggle,
}: QuizEditorHeaderProps) {
  const totalPoints = calculateQuizTotalPoints(quizForm);

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3>{isNewQuiz ? 'Create New Quiz' : 'Edit Quiz'}</h3>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted">Points: {totalPoints}</span>
        <Button
          variant={quizForm.isPublished ? 'success' : 'secondary'}
          size="sm"
          onClick={() => onPublishToggle(!quizForm.isPublished)}
          className="d-flex align-items-center gap-2"
        >
          {quizForm.isPublished ? 'Published' : 'Not Published'}
          <span className="ms-1">{quizForm.isPublished ? '✅' : '🚫'}</span>
        </Button>
      </div>
    </div>
  );
}

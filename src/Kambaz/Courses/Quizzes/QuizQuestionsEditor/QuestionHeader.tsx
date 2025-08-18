import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

/**
 * QuestionHeader Component
 *
 * Handles the question editor header section:
 * - Displays "Quiz Questions" title
 * - Shows total points
 * - Provides "Add Question" button
 *
 * This component manages the header area of the questions editor
 * with the title, points display, and primary action button.
 */

interface QuestionHeaderProps {
  totalPoints: number;
  onAddQuestion: () => void;
}

export default function QuestionHeader({
  totalPoints,
  onAddQuestion,
}: QuestionHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4>Quiz Questions</h4>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted fw-bold">Points {totalPoints}</span>
        <Button variant="primary" onClick={onAddQuestion}>
          <FaPlus className="me-2" />
          Add Question
        </Button>
      </div>
    </div>
  );
}

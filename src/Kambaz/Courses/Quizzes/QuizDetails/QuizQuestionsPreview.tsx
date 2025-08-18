import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaEye } from 'react-icons/fa';
import type { Quiz } from '../types';

interface QuizQuestionsPreviewProps {
  quiz: Quiz;
  totalPoints: number;
  onEditQuestions: () => void;
  onPreview: () => void;
}

/**
 * Questions Preview (Faculty only)
 * Displays question count and total points with edit/preview buttons
 */
export default function QuizQuestionsPreview({
  quiz,
  totalPoints,
  onEditQuestions,
  onPreview,
}: QuizQuestionsPreviewProps) {
  return (
    <Card>
      <Card.Body>
        <h5 className="card-title">Questions Preview</h5>
        <p className="text-muted">
          This quiz contains {quiz.questions.length} question
          {quiz.questions.length !== 1 ? 's' : ''} worth {totalPoints} total
          point{totalPoints !== 1 ? 's' : ''}.
        </p>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={onEditQuestions}>
            <FaEdit className="me-2" />
            Edit Questions
          </Button>
          <Button variant="outline-primary" onClick={onPreview}>
            <FaEye className="me-2" />
            Preview
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

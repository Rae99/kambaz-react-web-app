import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Quiz } from '../types';

interface QuizHeaderProps {
  quiz: Quiz;
  isFaculty: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}

/**
 * Quiz Header
 * Displays quiz title, description and action buttons for faculty
 */
export default function QuizHeader({
  quiz,
  isFaculty,
  onEdit,
  onDelete,
  onTogglePublish,
}: QuizHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h1 className="mb-2">{quiz.title}</h1>
        <p className="text-muted mb-0">{quiz.description}</p>
      </div>

      {isFaculty && (
        <div className="d-flex gap-2">
          <Button
            variant={quiz.isPublished ? 'success' : 'warning'}
            size="lg"
            onClick={onTogglePublish}
            className="px-4"
          >
            {quiz.isPublished ? 'Click to Unpublish' : 'Click to Publish'}
          </Button>
          <Button variant="outline-primary" onClick={onEdit}>
            <FaEdit className="me-2" />
            Edit Quiz
          </Button>

          <Button variant="outline-danger" onClick={onDelete}>
            <FaTrash className="me-2" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

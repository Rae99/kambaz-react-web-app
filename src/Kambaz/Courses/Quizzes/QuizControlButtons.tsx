import { Button, Dropdown } from 'react-bootstrap';
import { FaRegEdit, FaTrash, FaEye, FaCopy, FaSort } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface QuizControlButtonsProps {
  quizId: string;
  quizTitle: string;
  isPublished: boolean;
  onDelete: (quizId: string) => void;
  onPublish: (quizId: string, isPublished: boolean) => void;
}

export default function QuizControlButtons({
  quizId,
  quizTitle,
  isPublished,
  onDelete,
  onPublish,
}: QuizControlButtonsProps) {
  const { cid } = useParams();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
      onDelete(quizId);
    }
  };

  const handlePublish = () => {
    onPublish(quizId, !isPublished);
  };

  return (
    <div className="d-flex gap-1">
      <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quizId}`}>
        <Button variant="outline-primary" size="sm">
          <FaRegEdit className="me-1" />
          Edit
        </Button>
      </Link>

      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          <FaEye className="me-1" />
          Preview
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handlePublish}>
            {isPublished ? 'Unpublish' : 'Publish'}
          </Dropdown.Item>
          <Dropdown.Item>
            <FaCopy className="me-2" />
            Copy
          </Dropdown.Item>
          <Dropdown.Item>
            <FaSort className="me-2" />
            Sort
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Button variant="outline-danger" size="sm" onClick={handleDelete}>
        <FaTrash className="me-1" />
        Delete
      </Button>
    </div>
  );
}

import { Button } from 'react-bootstrap';
// import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * ControlBar Component
 *
 * Provides the main control interface for the quiz list including:
 * - Search functionality for filtering quizzes
 * - Create quiz button (faculty only)
 * - Responsive layout with search and action controls
 *
 * This component handles user input and navigation for quiz management.
 */

interface QuizzesControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isFaculty: boolean;
}

export default function QuizzesControls({
  searchTerm,
  onSearchChange,
  isFaculty,
}: QuizzesControlsProps) {
  const { cid } = useParams();
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div
        className="d-flex align-items-center position-relative"
        style={{ width: '40%' }}
      >
        <FaSearch
          className="position-absolute ms-3 text-muted"
          style={{ zIndex: 1 }}
          size={24}
        />
        <input
          type="text"
          className="form-control ps-5 form-control-lg"
          placeholder="Search for Quiz"
          style={{ backgroundColor: '#f8f9fa' }}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {isFaculty && (
        <div className="d-flex gap-2">
          <Button
            size="lg"
            variant="danger"
            className="d-flex align-items-center"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/new/edit`)}
          >
            <FaPlus className="me-2" size={16} />
            Quiz
          </Button>
          {/* <button className="btn btn-outline-secondary btn-lg">
            <BsThreeDotsVertical size={16} />
          </button> */}
        </div>
      )}
    </div>
  );
}

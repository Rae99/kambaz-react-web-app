import { FaPlus } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import Button from 'react-bootstrap/esm/Button';
import { useParams, Link } from 'react-router-dom';

export default function QuizzesControlBar() {
  const { cid } = useParams();

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
        />
      </div>

      <div className="d-flex gap-2">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/new`}>
          <Button
            size="lg"
            variant="danger"
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" size={16} />
            Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}

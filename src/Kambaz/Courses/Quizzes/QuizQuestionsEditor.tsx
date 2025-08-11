import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

export default function QuizQuestionsEditor() {
  return (
    <div className="tab-pane fade" id="questions">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Quiz Questions</h4>
        <Button variant="primary" size="sm">
          <FaPlus className="me-2" />
          Add Question
        </Button>
      </div>

      <div className="text-center py-5">
        <p className="text-muted">Questions editor will be implemented here</p>
        <p className="text-muted">
          This will allow you to add, edit, and manage quiz questions
        </p>
        <p className="text-muted">
          Question types: Multiple Choice, True/False, Fill-in-the-Blank
        </p>
      </div>
    </div>
  );
}

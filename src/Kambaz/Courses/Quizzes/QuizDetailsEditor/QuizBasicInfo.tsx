import { Row, Col } from 'react-bootstrap';
import type { Quiz } from '../types';

/**
 * QuizBasicInfo Component
 *
 * Handles the basic quiz information section:
 * - Quiz title and description
 * - Quiz type and points
 * - Basic quiz metadata
 *
 * This component focuses on the fundamental quiz properties
 * that users need to set when creating or editing a quiz.
 */

interface QuizBasicInfoProps {
  quizForm: Quiz;
  onFormChange: (field: keyof Quiz, value: any) => void;
}

export default function QuizBasicInfo({
  quizForm,
  onFormChange,
}: QuizBasicInfoProps) {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="wd-quiz-title" className="form-label">
          Quiz Title
        </label>
        <input
          id="wd-quiz-title"
          value={quizForm.title}
          onChange={(e) => onFormChange('title', e.target.value)}
          className="form-control"
          placeholder="Enter quiz title"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="wd-quiz-description" className="form-label">
          Quiz Instructions
        </label>
        <textarea
          id="wd-quiz-description"
          rows={4}
          className="form-control"
          value={quizForm.description}
          onChange={(e) => onFormChange('description', e.target.value)}
          placeholder="Enter quiz instructions"
        />
      </div>

      <Row className="mb-3">
        <Col md={6}>
          <label htmlFor="wd-quiz-type" className="form-label">
            Quiz Type
          </label>
          <select
            id="wd-quiz-type"
            className="form-select"
            value={quizForm.quizType || 'Graded Quiz'}
            onChange={(e) => onFormChange('quizType', e.target.value)}
          >
            <option>Graded Quiz</option>
            <option>Practice Quiz</option>
            <option>Graded Survey</option>
            <option>Ungraded Survey</option>
          </select>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="form-label">Points</label>
            <input
              type="number"
              className="form-control"
              value={quizForm.points}
              onChange={(e) =>
                onFormChange('points', parseInt(e.target.value) || 0)
              }
            />
            {/* Show calculated total points from questions */}
            {quizForm.questions && quizForm.questions.length > 0 && (
              <small className="text-muted">
                Calculated from questions:{' '}
                {quizForm.questions.reduce((sum, q) => sum + q.points, 0)}{' '}
                points
              </small>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}

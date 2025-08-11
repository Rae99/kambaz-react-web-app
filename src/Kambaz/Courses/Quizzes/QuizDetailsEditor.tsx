import { Row, Col } from 'react-bootstrap';
import type { QuizFormData } from './types';

interface QuizDetailsEditorProps {
  quizForm: QuizFormData;
  onFormChange: (field: keyof QuizFormData, value: any) => void;
}

export default function QuizDetailsEditor({
  quizForm,
  onFormChange,
}: QuizDetailsEditorProps) {
  return (
    <div className="tab-pane fade show active" id="details">
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
          <label htmlFor="wd-time-limit" className="form-label">
            Time Limit (minutes)
          </label>
          <input
            id="wd-time-limit"
            type="number"
            value={quizForm.timeLimit || 30}
            onChange={(e) =>
              onFormChange('timeLimit', parseInt(e.target.value) || 0)
            }
            className="form-control"
            min="1"
          />
        </Col>
      </Row>

      <div className="mb-3">
        <label className="form-label">Options</label>
        <div className="p-3 border rounded">
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="wd-shuffle-answers"
              checked={quizForm.shuffleAnswers || false}
              onChange={(e) => onFormChange('shuffleAnswers', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="wd-shuffle-answers">
              Shuffle Answers
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="wd-allow-multiple-attempts"
              checked={quizForm.allowMultipleAttempts || false}
              onChange={(e) =>
                onFormChange('allowMultipleAttempts', e.target.checked)
              }
            />
            <label
              className="form-check-label"
              htmlFor="wd-allow-multiple-attempts"
            >
              Allow Multiple Attempts
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="wd-show-correct-answers"
              checked={quizForm.showCorrectAnswers || false}
              onChange={(e) =>
                onFormChange('showCorrectAnswers', e.target.checked)
              }
            />
            <label
              className="form-check-label"
              htmlFor="wd-show-correct-answers"
            >
              Show Correct Answers
            </label>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Assign</label>
        <div className="p-3 border rounded">
          <div className="mb-3">
            <label htmlFor="wd-assign-to" className="form-label fw-bold">
              Assign to
            </label>
            <select id="wd-assign-to" className="form-select">
              <option>Everyone</option>
              <option>Section 1</option>
              <option>Section 2</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="wd-due-date" className="form-label fw-bold">
              Due
            </label>
            <input
              type="datetime-local"
              id="wd-due-date"
              className="form-control"
              value={quizForm.dueDate || ''}
              onChange={(e) => onFormChange('dueDate', e.target.value)}
            />
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="wd-available-from" className="form-label fw-bold">
                Available from
              </label>
              <input
                type="datetime-local"
                id="wd-available-from"
                className="form-control"
                value={quizForm.availableDate || ''}
                onChange={(e) => onFormChange('availableDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="wd-publish-quiz"
            checked={quizForm.isPublished}
            onChange={(e) => onFormChange('isPublished', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="wd-publish-quiz">
            Publish quiz
          </label>
        </div>
      </div>
    </div>
  );
}

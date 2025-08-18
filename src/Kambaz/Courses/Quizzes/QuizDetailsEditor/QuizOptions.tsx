import { Row, Col } from 'react-bootstrap';
import type { Quiz } from '../types';

/**
 * QuizOptions Component
 *
 * Handles the quiz options and settings section:
 * - Time limit and assignment group
 * - Quiz behavior options (shuffle, multiple attempts, etc.)
 * - Show correct answers configuration
 *
 * This component manages all the configurable options
 * that affect how the quiz behaves for students.
 */

interface QuizOptionsProps {
  quizForm: Quiz;
  onFormChange: (field: keyof Quiz, value: any) => void;
}

export default function QuizOptions({
  quizForm,
  onFormChange,
}: QuizOptionsProps) {
  return (
    <>
      <Row className="mb-3">
        <Col md={6}>
          <label htmlFor="wd-time-limit" className="form-label">
            Time Limit (minutes)
          </label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="wd-time-limit-checkbox"
              checked={quizForm.timeLimit > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  onFormChange('timeLimit', quizForm.timeLimit || 30);
                } else {
                  onFormChange('timeLimit', 0);
                }
              }}
            />
            <input
              id="wd-time-limit"
              type="number"
              value={quizForm.timeLimit || 30}
              onChange={(e) =>
                onFormChange('timeLimit', parseInt(e.target.value) || 0)
              }
              className="form-control"
              min="1"
              disabled={quizForm.timeLimit === 0}
            />
          </div>
        </Col>
        <Col md={6}>
          <label htmlFor="wd-assignment-group" className="form-label">
            Assignment Group
          </label>
          <select
            id="wd-assignment-group"
            className="form-select"
            value={quizForm.assignmentGroup || 'Quizzes'}
            onChange={(e) => onFormChange('assignmentGroup', e.target.value)}
          >
            <option>Quizzes</option>
            <option>Assignments</option>
            <option>Exams</option>
            <option>Projects</option>
          </select>
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
              checked={quizForm.multipleAttempts || false}
              onChange={(e) =>
                onFormChange('multipleAttempts', e.target.checked)
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
              checked={quizForm.showCorrectAnswers !== 'never'}
              onChange={(e) => {
                if (e.target.checked) {
                  onFormChange('showCorrectAnswers', 'immediately');
                } else {
                  onFormChange('showCorrectAnswers', 'never');
                }
              }}
            />
            <label
              className="form-check-label"
              htmlFor="wd-show-correct-answers"
            >
              Show Correct Answers
            </label>
          </div>

          {/* Show Correct Answers Options - only visible when checkbox is checked */}
          {quizForm.showCorrectAnswers !== 'never' && (
            <div className="ms-4 mb-3">
              <label className="form-label fw-bold">When to show:</label>
              <div className="d-flex flex-column gap-2">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="wd-show-immediately"
                    name="showCorrectAnswers"
                    value="immediately"
                    checked={quizForm.showCorrectAnswers === 'immediately'}
                    onChange={(e) =>
                      onFormChange('showCorrectAnswers', e.target.value)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="wd-show-immediately"
                  >
                    Immediately after submission
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="wd-show-after-submission"
                    name="showCorrectAnswers"
                    value="after_submission"
                    checked={quizForm.showCorrectAnswers === 'after_submission'}
                    onChange={(e) =>
                      onFormChange('showCorrectAnswers', e.target.value)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="wd-show-after-submission"
                  >
                    After submission (with delay)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="wd-show-after-due"
                    name="showCorrectAnswers"
                    value="after_due_date"
                    checked={quizForm.showCorrectAnswers === 'after_due_date'}
                    onChange={(e) =>
                      onFormChange('showCorrectAnswers', e.target.value)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="wd-show-after-due"
                  >
                    After due date
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="wd-show-custom-date"
                    name="showCorrectAnswers"
                    value="custom_date"
                    checked={quizForm.showCorrectAnswers === 'custom_date'}
                    onChange={(e) =>
                      onFormChange('showCorrectAnswers', e.target.value)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="wd-show-custom-date"
                  >
                    Custom date
                  </label>
                </div>

                {/* Custom date input - only visible when custom_date is selected */}
                {quizForm.showCorrectAnswers === 'custom_date' && (
                  <div className="ms-4 mt-2">
                    <label htmlFor="wd-custom-show-date" className="form-label">
                      Show answers on:
                    </label>
                    <input
                      type="datetime-local"
                      id="wd-custom-show-date"
                      className="form-control"
                      value={quizForm.customShowDate || ''}
                      onChange={(e) =>
                        onFormChange('customShowDate', e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

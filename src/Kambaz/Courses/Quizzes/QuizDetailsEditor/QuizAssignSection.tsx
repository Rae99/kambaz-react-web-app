import type { Quiz } from '../types';

/**
 * QuizAssignSection Component
 *
 * Handles the quiz assignment and publishing section:
 * - Assignment settings (due date, available date, until date)
 * - Quiz publishing controls
 * - Assignment targeting options
 *
 * This component manages when and how the quiz is assigned
 * to students and when it becomes available.
 */

interface QuizAssignSectionProps {
  quizForm: Quiz;
  onFormChange: (field: keyof Quiz, value: any) => void;
}

export default function QuizAssignSection({
  quizForm,
  onFormChange,
}: QuizAssignSectionProps) {
  return (
    <>
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
              onChange={(e) => {
                console.log('Due date changed:', e.target.value);
                onFormChange('dueDate', e.target.value);
              }}
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
            <div className="col">
              <label htmlFor="wd-until-date" className="form-label fw-bold">
                Until
              </label>
              <input
                type="datetime-local"
                id="wd-until-date"
                className="form-control"
                value={quizForm.untilDate || ''}
                onChange={(e) => {
                  console.log('Until date changed:', e.target.value);
                  onFormChange('untilDate', e.target.value);
                }}
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
    </>
  );
}

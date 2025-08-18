import { Modal, Button, Form } from 'react-bootstrap';
import type { Quiz } from '../types';

/**
 * CopyQuizModal Component
 *
 * Modal dialog for copying quizzes between courses:
 * - Displays available target courses
 * - Handles course selection
 * - Manages copy operation state
 * - Provides user feedback during copying
 *
 * This component facilitates the cross-course quiz duplication
 * functionality for faculty users.
 */

interface CopyQuizModalProps {
  show: boolean;
  quiz: Quiz | null;
  availableCourses: any[];
  targetCourseId: string;
  copyLoading: boolean;
  onHide: () => void;
  onCourseChange: (courseId: string) => void;
  onConfirm: () => void;
}

export default function CopyQuizModal({
  show,
  quiz,
  availableCourses,
  targetCourseId,
  copyLoading,
  onHide,
  onCourseChange,
  onConfirm,
}: CopyQuizModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Copy Quiz to Another Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Copy "{quiz?.title}" to which course?</p>
        <Form.Group>
          <Form.Label>Select Target Course:</Form.Label>
          <Form.Select
            value={targetCourseId}
            onChange={(e) => onCourseChange(e.target.value)}
            disabled={copyLoading}
          >
            <option value="">Choose a course...</option>
            {availableCourses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name} ({course.number})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={copyLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={!targetCourseId || copyLoading}
        >
          {copyLoading ? 'Copying...' : 'Copy Quiz'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

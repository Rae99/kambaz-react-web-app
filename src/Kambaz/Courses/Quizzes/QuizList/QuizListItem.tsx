import { Link, useParams } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { FaCheckCircle, FaBan } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import type { Quiz } from '../types';
import {
  isQuizAvailableForStudent,
  getQuizAvailabilityReason,
} from '../quiz-rules';
import QuizContextMenu from './QuizContextMenu';
import QuizActionButton from './QuizActionButton';

/**
 * QuizListItem Component
 *
 * Renders an individual quiz item in the quiz list with:
 * - Quiz title and availability information
 * - Publish/unpublish status (faculty only)
 * - Context menu for quiz actions
 * - Navigation to quiz details
 *
 * This component handles the display and interaction for each quiz
 * in the list, including faculty-specific controls and student navigation.
 */

interface QuizListItemProps {
  quiz: Quiz;
  isFaculty: boolean;
  openMenuId: string | null;
  onToggleMenu: (quizId: string) => void;
  onCloseMenu: () => void;
  onPublishToggle: (quizId: string, isPublished: boolean) => void;
  onEdit: (quizId: string) => void;
  onDelete: (quizId: string) => void;
  onDuplicate: (quizId: string) => void;
  onCopyToCourse: (quizId: string) => void;
  renderAvailabilityInfo: (
    quiz: Quiz,
    isFaculty: boolean
  ) => React.ReactElement;
}

export default function QuizListItem({
  quiz,
  isFaculty,
  openMenuId,
  onToggleMenu,
  onCloseMenu,
  onPublishToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onCopyToCourse,
  renderAvailabilityInfo,
}: QuizListItemProps) {
  const { cid } = useParams();

  return (
    <ListGroup.Item
      key={quiz._id}
      className="wd-quiz py-3 px-3"
      as={Link}
      to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="d-flex align-items-center"
          style={{ flex: 1, minWidth: 0 }}
        >
          <span className="me-3 fs-3">🚀</span>

          <div className="d-flex flex-column" style={{ minWidth: 0, flex: 1 }}>
            <span className="fw-bold fs-4 text-decoration-none text-dark">
              {quiz.title}
            </span>

            <div
              className="text-muted fs-6"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {renderAvailabilityInfo(quiz, isFaculty)}
            </div>
          </div>
        </div>

        <div
          className="d-flex align-items-center gap-2"
          style={{ flexShrink: 0 }}
        >
          {/* Publish/Unpublish Status - only show for faculty */}
          {isFaculty && (
            <span
              className="me-2 fs-4"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPublishToggle(quiz._id!, quiz.isPublished);
              }}
            >
              {quiz.isPublished ? (
                <FaCheckCircle color="green" size={26} />
              ) : (
                <FaBan color="red" size={26} />
              )}
            </span>
          )}

          {/* Role-specific Actions */}
          {isFaculty ? (
            <div className="d-flex gap-1 position-relative">
              {/* Context Menu Button */}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleMenu(quiz._id!);
                }}
              >
                <BsThreeDotsVertical />
              </button>

              {/* Custom Context Menu */}
              <QuizContextMenu
                quiz={quiz}
                isOpen={openMenuId === quiz._id}
                onClose={onCloseMenu}
                onEdit={() => onEdit(quiz._id!)}
                onDelete={onDelete}
                onPublishToggle={onPublishToggle}
                onDuplicate={onDuplicate}
                onCopyToCourse={onCopyToCourse}
              />
            </div>
          ) : (
            <div className="d-flex gap-2">
              {isQuizAvailableForStudent(quiz) ? (
                <QuizActionButton quiz={quiz} />
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  disabled
                  title={getQuizAvailabilityReason(quiz)}
                >
                  Quiz Not Available
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ListGroup.Item>
  );
}

import { FaRegEdit, FaCopy, FaTrash } from 'react-icons/fa';
import type { Quiz } from '../types';

interface QuizContextMenuProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (quizId: string) => void;
  onPublishToggle: (quizId: string, isPublished: boolean) => void;
  onDuplicate: (quizId: string) => void;
  onCopyToCourse: (quizId: string) => void;
}

export default function QuizContextMenu({
  quiz,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onPublishToggle,
  onDuplicate,
  onCopyToCourse,
}: QuizContextMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="position-absolute top-100 end-0 mt-1 bg-white border rounded shadow-lg"
      style={{ zIndex: 1000 }}
    >
      <div className="p-2">
        <button
          className="btn btn-link text-decoration-none p-2 w-100 text-start"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            onEdit();
          }}
        >
          <FaRegEdit className="me-2" />
          Edit
        </button>

        <button
          className="btn btn-link text-decoration-none p-2 w-100 text-start text-danger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            onDelete(quiz._id!);
          }}
        >
          <FaTrash className="me-2" />
          Delete
        </button>

        <button
          className="btn btn-link text-decoration-none p-2 w-100 text-start"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            onPublishToggle(quiz._id!, quiz.isPublished);
          }}
        >
          {quiz.isPublished ? 'Unpublish' : 'Publish'}
        </button>

        <button
          className="btn btn-link text-decoration-none p-2 w-100 text-start"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            onDuplicate(quiz._id!);
          }}
        >
          <FaCopy className="me-2" />
          Duplicate
        </button>

        <button
          className="btn btn-link text-decoration-none p-2 w-100 text-start"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            onCopyToCourse(quiz._id!);
          }}
        >
          <FaCopy className="me-2" />
          Copy to Course
        </button>
      </div>
    </div>
  );
}

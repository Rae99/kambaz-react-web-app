import type { Quiz } from '../types';
import QuizBasicInfo from './QuizBasicInfo';
import QuizOptions from './QuizOptions';
import QuizAssignSection from './QuizAssignSection';
import ActionButtons from './ActionButtons';

/**
 * QuizDetailsEditor Main Component
 *
 * This is the main orchestrator component that coordinates all quiz details editing.
 * It has been refactored from a monolithic component to use specialized sub-components:
 *
 * Component Responsibilities:
 * - QuizBasicInfo - Handles basic quiz information (title, description, type, points)
 * - QuizOptions - Manages quiz options and behavior settings
 * - QuizAssignSection - Handles assignment and publishing controls
 * - ActionButtons - Provides save/cancel action controls
 *
 * The main component focuses purely on orchestrating these concerns through
 * component composition, making it much more maintainable.
 */

interface QuizDetailsEditorProps {
  quizForm: Quiz;
  onFormChange: (field: keyof Quiz, value: any) => void;
  onSave?: () => void;
  onSaveAndPublish?: () => void;
  onCancel?: () => void;
}

export default function QuizDetailsEditor({
  quizForm,
  onFormChange,
  onSave,
  onSaveAndPublish,
  onCancel,
}: QuizDetailsEditorProps) {
  return (
    <div className="tab-pane fade show active" id="details">
      <QuizBasicInfo quizForm={quizForm} onFormChange={onFormChange} />
      <QuizOptions quizForm={quizForm} onFormChange={onFormChange} />
      <QuizAssignSection quizForm={quizForm} onFormChange={onFormChange} />
      <ActionButtons
        onSave={onSave}
        onSaveAndPublish={onSaveAndPublish}
        onCancel={onCancel}
      />
    </div>
  );
}

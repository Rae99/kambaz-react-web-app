import type { Question } from '../types';
import MultipleChoiceEditor from './MultipleChoiceEditor';
import TrueFalseEditor from './TrueFalseEditor';
import FillInBlankEditor from './FillInBlankEditor';

/**
 * QuestionEditor Component
 *
 * Handles the question editing interface:
 * - Renders the appropriate editor based on question type
 * - Manages question type switching
 * - Provides save/cancel actions for editing
 *
 * This component acts as a router that displays the correct
 * editing interface based on the question type.
 */

interface QuestionEditorProps {
  editingQuestion: Question | null;
  editingIndex: number;
  onQuestionChange: (question: Question) => void;
  onQuestionTypeChange: (
    type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank'
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function QuestionEditor({
  editingQuestion,
  editingIndex,
  onQuestionChange,
  onQuestionTypeChange,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  if (!editingQuestion || editingIndex < 0) {
    return null;
  }

  return (
    <div>
      {editingQuestion.type === 'multiple-choice' && (
        <MultipleChoiceEditor
          question={editingQuestion}
          onQuestionChange={onQuestionChange}
          onQuestionTypeChange={onQuestionTypeChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      {editingQuestion.type === 'true-false' && (
        <TrueFalseEditor
          question={editingQuestion}
          onQuestionChange={onQuestionChange}
          onQuestionTypeChange={onQuestionTypeChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      {editingQuestion.type === 'fill-in-the-blank' && (
        <FillInBlankEditor
          question={editingQuestion}
          onQuestionChange={onQuestionChange}
          onQuestionTypeChange={onQuestionTypeChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}

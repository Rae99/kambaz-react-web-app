/**
 * ActionButtons Component
 *
 * Handles the action buttons section:
 * - Save Quiz button
 * - Save & Publish button
 * - Cancel button
 *
 * This component provides the action controls for the quiz editor,
 * with conditional rendering based on available actions.
 */

interface ActionButtonsProps {
  onSave?: () => void;
  onSaveAndPublish?: () => void;
  onCancel?: () => void;
}

export default function ActionButtons({
  onSave,
  onSaveAndPublish,
  onCancel,
}: ActionButtonsProps) {
  // Only render if at least one action is available
  if (!onSave && !onSaveAndPublish && !onCancel) {
    return null;
  }

  return (
    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
      {onCancel && (
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      )}
      {onSave && (
        <button className="btn btn-primary" onClick={onSave}>
          Save Quiz
        </button>
      )}
      {onSaveAndPublish && (
        <button className="btn btn-success" onClick={onSaveAndPublish}>
          Save & Publish
        </button>
      )}
    </div>
  );
}

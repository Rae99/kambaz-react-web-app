import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  QuizEditorHeader,
  QuizEditorTabs,
  QuizEditorContent,
  LoadingStates,
  useQuizEditor,
  useQuizForm,
  useQuizActions,
} from './';

/**
 * QuizEditor Main Component
 *
 * This is the main orchestrator component that coordinates all quiz editing functionality.
 * It has been refactored from a monolithic 423-line file to a clean, focused component
 * that delegates specific concerns to specialized components and custom hooks.
 *
 * Component Responsibilities:
 * - QuizEditorHeader - Handles the header with title, points display, and publish toggle
 * - QuizEditorTabs - Manages the navigation tabs between Details and Questions
 * - QuizEditorContent - Handles the routing and content display for different tabs
 * - LoadingStates - Manages loading and error state displays
 *
 * Custom Hook Responsibilities:
 * - useQuizEditor - Manages quiz fetching, state, and navigation logic
 * - useQuizForm - Handles form state management and hydration
 * - useQuizActions - Manages save, publish, and cancel actions
 *
 * The main component focuses purely on orchestrating these concerns through
 * custom hooks and component composition, making it much more maintainable.
 */

export default function QuizEditor() {
  const params = useParams();
  const { cid, qid } = params;

  // Custom hooks for different concerns
  const { quiz, isNewQuiz, fetchState, hasHydratedRef } = useQuizEditor(
    cid!,
    qid!
  );
  const { quizForm, handleFormChange } = useQuizForm(
    quiz,
    cid!,
    qid!,
    hasHydratedRef
  );
  const { handleSave, handleSaveAndPublish, handleCancel } = useQuizActions(
    cid!,
    qid!,
    quizForm,
    isNewQuiz
  );

  // Reset hydration flag when quiz changes (e.g., after refresh)
  useEffect(() => {
    if (quiz && !isNewQuiz) {
      hasHydratedRef.current = false;
    }
  }, [quiz?._id, isNewQuiz, hasHydratedRef]);

  // Early return for loading/error states
  const loadingState = LoadingStates({ fetchState, isNewQuiz });
  if (loadingState) return loadingState;

  return (
    <div id="wd-quiz-editor" className="container">
      <QuizEditorHeader
        isNewQuiz={isNewQuiz}
        quizForm={quizForm}
        onPublishToggle={(isPublished: boolean) =>
          handleFormChange('isPublished', isPublished)
        }
      />

      <QuizEditorTabs cid={cid!} qid={qid!} />

      <QuizEditorContent
        cid={cid!}
        qid={qid!}
        quizForm={quizForm}
        onFormChange={handleFormChange}
        onSave={handleSave}
        onSaveAndPublish={handleSaveAndPublish}
        onCancel={handleCancel}
      />
    </div>
  );
}

// Export all components and hooks for external use
export { default as QuizEditorHeader } from './QuizEditorHeader';
export { default as QuizEditorTabs } from './QuizEditorTabs';
export { default as QuizEditorContent } from './QuizEditorContent';
export { default as LoadingStates } from './LoadingStates';
export * from './QuizEditorHooks';

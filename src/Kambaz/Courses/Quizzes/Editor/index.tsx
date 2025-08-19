import { useParams } from 'react-router-dom';
import QuizEditorHeader from './QuizEditorHeader';
import QuizEditorTabs from './QuizEditorTabs';
import QuizEditorContent from './QuizEditorContent';
import LoadingStates from './LoadingStates';
import { useQuizEditor, useQuizForm, useQuizActions } from './QuizEditorHooks';

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
  // 1. useQuizEditor fetches quiz data from backend API
  const { quiz, loading, error, isNewQuiz } = useQuizEditor(qid!);

  // 2. Pass quiz to useQuizForm to create editable form state
  const { quizForm, handleFormChange } = useQuizForm(quiz, cid!);

  // 3. Pass quizForm to child components for editing interface
  const { handleSave, handleSaveAndPublish, handleCancel } = useQuizActions(
    cid!,
    qid!,
    quizForm,
    isNewQuiz
  );

  // Early return for loading/error states
  const loadingState = LoadingStates({ loading, error, isNewQuiz });
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
        quizForm={quizForm} // Pass quizForm (editable state) to child components
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


// 1. Key ideas
// 	1.	quiz: the raw data fetched from the backend API.
// 	2.	quizForm: an editable form state created from quiz.
// 	3.	Data flow: API → quiz → quizForm → UI.

// 2. Where the data comes from
// 	•	Create Quiz: qid === 'new' → quiz = null → quizForm uses default values.
// 	•	Edit Quiz: qid = '<real id>' → call API → quiz = backend data → quizForm is initialized from that data.

// 3. Why this design
// 	•	quiz: preserves the original data for comparison and validation.
// 	•	quizForm: the user’s temporary editing state that can be saved or discarded.
// 	•	Separation of concerns: original data vs. editing state.
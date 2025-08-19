import { Routes, Route, Navigate } from 'react-router-dom';
import QuizDetailsEditor from '../QuizDetailsEditor/index';
import QuizQuestionsEditor from '../QuizQuestionsEditor/index';
import type { Quiz } from '../types';

/**
 * QuizEditorContent Component
 *
 * Handles the routing and content display for different tabs:
 * - Manages routing between Details and Questions tabs
 * - Renders appropriate editor component based on current route
 * - Handles default routing and fallback navigation
 * - Passes form data and handlers to child components
 *
 * This component acts as a router that displays the correct editing
 * interface based on which tab the user has selected.
 */

interface QuizEditorContentProps {
  cid: string;
  qid: string;
  quizForm: Quiz;
  onFormChange: (field: keyof Quiz, value: any) => void;
  onSave: () => void;
  onSaveAndPublish: () => void;
  onCancel: () => void;
}

export default function QuizEditorContent({
  cid,
  qid,
  quizForm,
  onFormChange,
  onSave,
  onSaveAndPublish,
  onCancel,
}: QuizEditorContentProps) {
  return (
    <Routes>
      <Route
        path="details"
        element={
          <QuizDetailsEditor
            quizForm={quizForm}
            quizId={qid === 'new' ? undefined : qid}
            quiz={qid === 'new' ? undefined : quizForm} // Pass quiz data for consistency
            onFormChange={onFormChange}
            onSave={onSave}
            onSaveAndPublish={onSaveAndPublish}
            onCancel={onCancel}
          />
        }
      />
      <Route
        path="questions"
        element={
          <QuizQuestionsEditor
            questions={quizForm.questions || []}
            quizId={qid === 'new' ? undefined : qid}
            quiz={qid === 'new' ? undefined : quizForm} // Pass quiz data to avoid Redux dependency
            onQuestionsChange={(questions) => {
              // Automatically recalculate total points when questions change
              const newTotalPoints = questions.reduce(
                (sum, question) => sum + question.points,
                0
              );

              // Update both questions and total points
              onFormChange('questions', questions);
              if (quizForm.points !== newTotalPoints) {
                onFormChange('points', newTotalPoints);
              }
            }}
            onSave={onSave}
            onSaveAndPublish={onSaveAndPublish}
            onCancel={onCancel}
          />
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/details`}
            replace
          />
        }
      />
      <Route
        path=""
        element={
          <Navigate
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/details`}
            replace
          />
        }
      />
    </Routes>
  );
}

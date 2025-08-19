import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import type { Question, Quiz } from '../types';
import * as quizzesClient from '../client';
import QuestionHeader from './QuestionHeader';
import QuestionList from './QuestionList';
import QuestionEditor from './QuestionEditor';
import React from 'react'; // Added missing import

/**
 * QuizQuestionsEditor Main Component
 *
 * This is the main orchestrator component that coordinates all quiz questions editing.
 * It has been refactored from a monolithic component to use specialized sub-components:
 *
 * Component Responsibilities:
 * - QuestionHeader - Handles the header with title, points, and add button
 * - QuestionList - Displays the list of questions with edit/delete actions
 * - QuestionEditor - Manages the question editing interface based on type
 *
 * The main component focuses on state management and orchestrating these concerns
 * through component composition, making it much more maintainable.
 */

interface QuizQuestionsEditorProps {
  questions?: Question[];
  quizId?: string;
  quiz?: Quiz; // Add quiz prop to avoid dependency on Redux store
  onQuestionsChange?: (questions: Question[]) => void;
  onSave?: () => void;
  onSaveAndPublish?: () => void;
  onCancel?: () => void;
}

export default function QuizQuestionsEditor({
  questions = [],
  quizId,
  quiz, // Use quiz prop instead of Redux store
  onQuestionsChange,
  onSave,
  onSaveAndPublish,
  onCancel,
}: QuizQuestionsEditorProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  // Use quiz prop if available, otherwise fall back to Redux store
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const currentQuiz =
    quiz ||
    (() => {
      if (!quizId) return null;
      return quizzes.find((q: Quiz) => q._id === quizId);
    })();

  console.log('QuizQuestionsEditor render:', {
    quizId,
    quiz: !!quiz,
    currentQuiz: !!currentQuiz,
    quizzesCount: quizzes.length,
  });

  // If we don't have the quiz in store, try to fetch it
  React.useEffect(() => {
    if (quizId && !currentQuiz) {
      // This will trigger the parent component to fetch the quiz if needed
      console.log('Quiz not found in store, may need to fetch:', {
        quizId,
        quizzesCount: quizzes.length,
      });
    }
  }, [quizId, currentQuiz, quizzes.length]);

  const handleAddQuestion = async () => {
    console.log('handleAddQuestion called:', {
      quizId,
      currentQuiz: !!currentQuiz,
      questionsCount: questions.length,
    });

    // Default to multiple choice question
    const newQuestion: Question = {
      title: '',
      type: 'multiple-choice',
      text: '',
      points: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
    };

    const updatedQuestions = [...questions, newQuestion];
    onQuestionsChange?.(updatedQuestions);

    // Only try to save to backend if we have a quiz ID and current quiz
    // For new quizzes (quizId === 'new'), we don't save immediately
    if (quizId && currentQuiz) {
      try {
        console.log('Adding new question to backend:', {
          quizId,
          currentQuizId: currentQuiz._id,
        });

        // Create updated quiz object with new questions
        const updatedQuiz = {
          ...currentQuiz,
          questions: updatedQuestions,
          updatedAt: new Date().toISOString(),
        };

        // Save to backend
        await quizzesClient.updateQuiz(quizId, updatedQuiz);
        console.log('New question added successfully to backend');
      } catch (error) {
        console.error('Error adding question to backend:', error);
        // Show error message to user
        alert('Failed to save new question to backend. Please try again.');
        // Revert local state if backend save fails
        onQuestionsChange?.(questions);
        return;
      }
    } else {
      console.log('Not saving to backend:', {
        reason: quizId ? 'No currentQuiz' : 'No quizId',
        quizId,
        currentQuiz: !!currentQuiz,
      });
    }

    // Start editing the new question immediately
    setEditingQuestion(newQuestion);
    setEditingIndex(updatedQuestions.length - 1);

    // Scroll to the new question
    setTimeout(() => {
      const newQuestionElement = document.getElementById(
        `question-${updatedQuestions.length - 1}`
      );
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  };

  const handleQuestionTypeChange = (
    newType: 'multiple-choice' | 'true-false' | 'fill-in-the-blank'
  ) => {
    if (!editingQuestion) return;

    const baseQuestion = {
      ...editingQuestion,
      type: newType,
    };

    // Simple default values based on new type
    switch (newType) {
      case 'multiple-choice':
        baseQuestion.options = ['', '', '', ''];
        baseQuestion.correctAnswer = '';
        break;
      case 'true-false':
        baseQuestion.options = [];
        baseQuestion.correctAnswer = 'true';
        break;
      case 'fill-in-the-blank':
        baseQuestion.options = [];
        baseQuestion.correctAnswer = [];
        baseQuestion.blanks = [
          {
            id: 'blank1',
            options: ['', '', ''],
            correctAnswer: '',
          },
        ];
        break;
    }

    setEditingQuestion(baseQuestion);
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditingQuestion({ ...question });
    setEditingIndex(index);
  };

  const handleSaveQuestion = async () => {
    if (editingQuestion && editingIndex >= 0) {
      try {
        // Update local state first
        const updatedQuestions = [...questions];
        updatedQuestions[editingIndex] = editingQuestion;
        onQuestionsChange?.(updatedQuestions);

        // If we have a quiz ID and current quiz, save immediately to backend
        if (quizId && currentQuiz) {
          console.log('Saving question to backend:', editingQuestion);

          // Create updated quiz object with new questions
          const updatedQuiz = {
            ...currentQuiz,
            questions: updatedQuestions,
            updatedAt: new Date().toISOString(),
          };

          // Save to backend
          await quizzesClient.updateQuiz(quizId, updatedQuiz);
          console.log('Question saved successfully to backend');
        }

        // Exit editing mode
        setEditingQuestion(null);
        setEditingIndex(-1);
      } catch (error) {
        console.error('Error saving question:', error);
        // Show error message to user
        alert('Failed to save question. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditingIndex(-1);
  };

  const handleDeleteQuestion = async (index: number) => {
    console.log('handleDeleteQuestion called:', {
      index,
      quizId,
      currentQuiz: !!currentQuiz,
      questionsCount: questions.length,
    });

    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        // Update local state first
        const updatedQuestions = questions.filter((_, i) => i !== index);
        onQuestionsChange?.(updatedQuestions);

        // If we have a quiz ID and current quiz, save immediately to backend
        if (quizId && currentQuiz) {
          console.log('Deleting question from backend, new questions count:', {
            updatedQuestionsCount: updatedQuestions.length,
            quizId,
            currentQuizId: currentQuiz._id,
          });

          // Create updated quiz object with new questions
          const updatedQuiz = {
            ...currentQuiz,
            questions: updatedQuestions,
            updatedAt: new Date().toISOString(),
          };

          // Save to backend
          await quizzesClient.updateQuiz(quizId, updatedQuiz);
          console.log('Question deleted successfully from backend');
        } else {
          console.warn('Cannot delete from backend:', {
            quizId,
            currentQuiz: !!currentQuiz,
          });
        }

        // Update editing state
        if (editingIndex === index) {
          setEditingQuestion(null);
          setEditingIndex(-1);
        } else if (editingIndex > index) {
          setEditingIndex(editingIndex - 1);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        // Show error message to user
        alert('Failed to delete question. Please try again.');
        // Revert local state if backend save fails
        onQuestionsChange?.(questions);
      }
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="quiz-questions-editor">
      <QuestionHeader
        totalPoints={totalPoints}
        onAddQuestion={handleAddQuestion}
      />

      {questions.length === 0 ? (
        <QuestionList
          questions={questions}
          onEditQuestion={handleEditQuestion}
          onDeleteQuestion={handleDeleteQuestion}
        />
      ) : (
        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={index} className="mb-3" id={`question-${index}`}>
              {editingIndex === index ? (
                // Editing mode
                <QuestionEditor
                  editingQuestion={editingQuestion}
                  editingIndex={editingIndex}
                  onQuestionChange={(updatedQuestion) =>
                    setEditingQuestion(updatedQuestion)
                  }
                  onQuestionTypeChange={handleQuestionTypeChange}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              ) : (
                // Display mode
                <QuestionList
                  questions={[question]}
                  onEditQuestion={handleEditQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Save/Cancel Buttons */}
      {(onSave || onSaveAndPublish || onCancel) && (
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onSave && (
            <Button variant="primary" onClick={onSave}>
              Save Quiz
            </Button>
          )}
          {onSaveAndPublish && (
            <Button variant="success" onClick={onSaveAndPublish}>
              Save & Publish
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

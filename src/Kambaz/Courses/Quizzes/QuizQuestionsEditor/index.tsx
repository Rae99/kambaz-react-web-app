import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import type { Question, Quiz } from '../types';
import * as quizzesClient from '../client';
import QuestionHeader from './QuestionHeader';
import QuestionEditor from './QuestionEditor';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
  quiz,
  onQuestionsChange,
  onSave,
  onSaveAndPublish,
  onCancel,
}: QuizQuestionsEditorProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  // Use quiz data directly from props, no longer dependent on Redux store
  const currentQuiz = quiz;

  // Handle questions change and automatically recalculate total points
  const handleQuestionsChange = (newQuestions: Question[]) => {
    // Calculate new total points based on all questions
    const newTotalPoints = newQuestions.reduce(
      (sum, question) => sum + question.points,
      0
    );

    // Update questions
    onQuestionsChange?.(newQuestions);
  };

  const handleAddQuestion = async () => {
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
    handleQuestionsChange(updatedQuestions);

    // If we have quiz ID and quiz data, save immediately to backend
    if (quizId && currentQuiz) {
      try {
        // Create updated quiz object
        const updatedQuiz = {
          ...currentQuiz,
          questions: updatedQuestions,
          updatedAt: new Date().toISOString(),
        };

        // Save to backend
        await quizzesClient.updateQuiz(quizId, updatedQuiz);
      } catch (error) {
        console.error('Error adding question to backend:', error);
        alert('Failed to save new question to backend. Please try again.');
        // Revert local state if backend save fails
        handleQuestionsChange(questions);
        return;
      }
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
    // Capture the current editingIndex to avoid closure issues
    const currentEditingIndex = editingIndex;

    if (editingQuestion && currentEditingIndex >= 0) {
      try {
        // Update local state first - ensure deep copy
        const updatedQuestions = questions.map((q) => ({ ...q }));
        updatedQuestions[currentEditingIndex] = { ...editingQuestion };

        handleQuestionsChange(updatedQuestions);

        // If we have quiz ID and quiz data, save immediately to backend
        if (quizId && currentQuiz) {
          // Create updated quiz object
          const updatedQuiz = {
            ...currentQuiz,
            questions: updatedQuestions,
            updatedAt: new Date().toISOString(),
          };

          // Save to backend
          await quizzesClient.updateQuiz(quizId, updatedQuiz);
        }

        // Exit editing mode
        setEditingQuestion(null);
        setEditingIndex(-1);
      } catch (error) {
        console.error('Error saving question:', error);
        alert('Failed to save question. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditingIndex(-1);
  };

  const handleDeleteQuestion = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        // Update local state first
        const updatedQuestions = questions.filter((_, i) => i !== index);
        handleQuestionsChange(updatedQuestions);

        // If we have quiz ID and quiz data, save immediately to backend
        if (quizId && currentQuiz) {
          // Create updated quiz object
          const updatedQuiz = {
            ...currentQuiz,
            questions: updatedQuestions,
            updatedAt: new Date().toISOString(),
          };

          // Save to backend
          await quizzesClient.updateQuiz(quizId, updatedQuiz);
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
        alert('Failed to delete question. Please try again.');
        // Revert local state if backend save fails
        handleQuestionsChange(questions);
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
        <div className="text-center text-muted">
          <p>No questions added yet. Click "Add Question" to get started.</p>
        </div>
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
                // Display mode - render question directly
                <Card className="mb-3">
                  <Card.Body>
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">
                            Question {index + 1}: {question.text}
                          </h6>
                          <div className="text-muted">
                            <small>
                              {question.type} | {question.points} pts
                            </small>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditQuestion(question, index)}
                          >
                            <FaEdit className="me-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteQuestion(index)}
                          >
                            <FaTrash className="me-1" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      {question.type === 'multiple-choice' &&
                        question.options && (
                          <div className="ms-3">
                            <small className="text-muted">Options:</small>
                            <ul className="list-unstyled ms-3">
                              {question.options.map((option, optIndex) => (
                                <li key={optIndex} className="mb-1">
                                  {option || `Option ${optIndex + 1}`}
                                  {option === question.correctAnswer && (
                                    <span className="text-success ms-2">
                                      ✓ Correct
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {question.type === 'true-false' && (
                        <div className="ms-3">
                          <small className="text-muted">
                            Correct Answer:{' '}
                            <span className="text-success">
                              {question.correctAnswer}
                            </span>
                          </small>
                        </div>
                      )}

                      {question.type === 'fill-in-the-blank' && (
                        <div className="ms-3">
                          <small className="text-muted">
                            Blanks: {question.blanks?.length || 0}
                          </small>
                          {question.blanks && question.blanks.length > 0 && (
                            <div className="ms-3 mt-1">
                              {question.blanks.map((blank, blankIndex) => (
                                <div key={blank.id} className="mb-1">
                                  <small className="text-muted">
                                    <strong>Blank {blankIndex + 1}:</strong>{' '}
                                    {blank.options.length} options, correct:{' '}
                                    <span className="text-success">
                                      {blank.correctAnswer || 'Not set'}
                                    </span>
                                  </small>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {question.explanation && (
                        <div className="ms-3 mt-2">
                          <small className="text-muted">
                            <strong>Explanation:</strong> {question.explanation}
                          </small>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
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

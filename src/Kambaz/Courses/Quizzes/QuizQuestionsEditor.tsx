import { useState } from 'react';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import type { Question } from './types';
import MultipleChoiceEditor from './MultipleChoiceEditor';
import TrueFalseEditor from './TrueFalseEditor';
import FillInBlankEditor from './FillInBlankEditor';

interface QuizQuestionsEditorProps {
  questions?: Question[];
  onQuestionsChange?: (questions: Question[]) => void;
  onSaveQuiz?: () => void;
}

export default function QuizQuestionsEditor({
  questions = [],
  onQuestionsChange,
  onSaveQuiz,
}: QuizQuestionsEditorProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] =
    useState(false);

  const handleAddQuestion = () => {
    setShowQuestionTypeSelector(true);
  };

  const handleCreateQuestion = async (
    questionType: 'multiple-choice' | 'true-false' | 'fill-in-the-blank'
  ) => {
    const newQuestion: Question = {
      title: '',
      type: questionType,
      text: '',
      points: 1,
      options: questionType === 'multiple-choice' ? ['', '', '', ''] : [],
      correctAnswer: '',
      explanation: '',
    };

    const updatedQuestions = [...questions, newQuestion];
    onQuestionsChange?.(updatedQuestions);

    // Start editing the new question immediately (edit preview mode)
    setEditingQuestion(newQuestion);
    setEditingIndex(updatedQuestions.length - 1);

    // Hide the type selector
    setShowQuestionTypeSelector(false);

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

    // 直接保存到后端
    if (onSaveQuiz) {
      try {
        await onSaveQuiz();
      } catch (error) {
        console.error(
          'Error saving quiz to backend after adding question:',
          error
        );
      }
    }
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditingQuestion({ ...question });
    setEditingIndex(index);
  };

  const handleSaveQuestion = async () => {
    if (editingQuestion && editingIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = editingQuestion;
      onQuestionsChange?.(updatedQuestions);

      setEditingQuestion(null);
      setEditingIndex(-1);

      // 直接保存到后端
      if (onSaveQuiz) {
        try {
          await onSaveQuiz();
        } catch (error) {
          console.error('Error saving quiz to backend:', error);
        }
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditingIndex(-1);
  };

  const handleDeleteQuestion = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      onQuestionsChange?.(updatedQuestions);

      if (editingIndex === index) {
        setEditingQuestion(null);
        setEditingIndex(-1);
      } else if (editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }

      // 直接保存到后端
      if (onSaveQuiz) {
        try {
          await onSaveQuiz();
        } catch (error) {
          console.error('Error saving quiz to backend:', error);
        }
      }
    }
  };

  const handleQuestionChange = (field: keyof Question, value: any) => {
    if (editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        [field]: value,
      });
    }
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (editingQuestion && editingQuestion.options) {
      const updatedOptions = [...editingQuestion.options];
      updatedOptions[optionIndex] = value;
      setEditingQuestion({
        ...editingQuestion,
        options: updatedOptions,
      });
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="quiz-questions-editor">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Quiz Questions</h4>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted fw-bold">Points {totalPoints}</span>
          <Button variant="primary" onClick={handleAddQuestion}>
            <FaPlus className="me-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Question Type Selector Modal */}
      {showQuestionTypeSelector && (
        <Card className="mb-3 border-primary">
          <Card.Body className="text-center">
            <h5 className="mb-3">Choose Question Type</h5>
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="outline-primary"
                onClick={() => handleCreateQuestion('multiple-choice')}
                className="px-4"
              >
                Multiple Choice
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleCreateQuestion('true-false')}
                className="px-4"
              >
                True/False
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleCreateQuestion('fill-in-the-blank')}
                className="px-4"
              >
                Fill in the Blank
              </Button>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowQuestionTypeSelector(false)}
              className="mt-3"
            >
              Cancel
            </Button>
          </Card.Body>
        </Card>
      )}

      {questions.length === 0 ? (
        <Card>
          <Card.Body className="text-center text-muted">
            <p>No questions added yet. Click "Add Question" to get started.</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="questions-list">
          {questions.map((question, index) => (
            <Card key={index} className="mb-3" id={`question-${index}`}>
              <Card.Body>
                {editingIndex === index ? (
                  // Editing mode - render specific editor based on question type
                  <div>
                    {editingQuestion?.type === 'multiple-choice' && (
                      <MultipleChoiceEditor
                        question={editingQuestion}
                        onQuestionChange={(updatedQuestion) =>
                          setEditingQuestion(updatedQuestion)
                        }
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                      />
                    )}
                    {editingQuestion?.type === 'true-false' && (
                      <TrueFalseEditor
                        question={editingQuestion}
                        onQuestionChange={(updatedQuestion) =>
                          setEditingQuestion(updatedQuestion)
                        }
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                      />
                    )}
                    {editingQuestion?.type === 'fill-in-the-blank' && (
                      <FillInBlankEditor
                        question={editingQuestion}
                        onQuestionChange={(updatedQuestion) =>
                          setEditingQuestion(updatedQuestion)
                        }
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                      />
                    )}
                  </div>
                ) : (
                  // Display mode
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
                          Correct Answer:{' '}
                          <span className="text-success">
                            {question.correctAnswer}
                          </span>
                        </small>
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
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

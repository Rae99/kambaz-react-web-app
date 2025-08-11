import { useState } from 'react';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import type { Question } from './types';

interface QuizQuestionsEditorProps {
  questions?: Question[];
  onQuestionsChange?: (questions: Question[]) => void;
}

export default function QuizQuestionsEditor({
  questions = [],
  onQuestionsChange,
}: QuizQuestionsEditorProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      type: 'multiple-choice',
      text: '',
      points: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
    };

    const updatedQuestions = [...questions, newQuestion];
    onQuestionsChange?.(updatedQuestions);

    // Start editing the new question
    setEditingQuestion(newQuestion);
    setEditingIndex(updatedQuestions.length - 1);
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditingQuestion({ ...question });
    setEditingIndex(index);
  };

  const handleSaveQuestion = () => {
    if (editingQuestion && editingIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = editingQuestion;
      onQuestionsChange?.(updatedQuestions);

      setEditingQuestion(null);
      setEditingIndex(-1);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditingIndex(-1);
  };

  const handleDeleteQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      onQuestionsChange?.(updatedQuestions);

      if (editingIndex === index) {
        setEditingQuestion(null);
        setEditingIndex(-1);
      } else if (editingIndex > index) {
        setEditingIndex(editingIndex - 1);
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
          <span className="text-muted">Total Points: {totalPoints}</span>
          <Button variant="primary" onClick={handleAddQuestion}>
            <FaPlus className="me-2" />
            Add Question
          </Button>
        </div>
      </div>

      {questions.length === 0 ? (
        <Card>
          <Card.Body className="text-center text-muted">
            <p>No questions added yet. Click "Add Question" to get started.</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="questions-list">
          {questions.map((question, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                {editingIndex === index ? (
                  // Editing mode
                  <div>
                    <Row className="mb-3">
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label>Question Text</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={editingQuestion?.text || ''}
                            onChange={(e) =>
                              handleQuestionChange('text', e.target.value)
                            }
                            placeholder="Enter your question here..."
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Points</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={editingQuestion?.points || 1}
                            onChange={(e) =>
                              handleQuestionChange(
                                'points',
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Question Type</Form.Label>
                          <Form.Select
                            value={editingQuestion?.type || 'multiple-choice'}
                            onChange={(e) =>
                              handleQuestionChange('type', e.target.value)
                            }
                          >
                            <option value="multiple-choice">
                              Multiple Choice
                            </option>
                            <option value="true-false">True/False</option>
                            <option value="fill-in-the-blank">
                              Fill in the Blank
                            </option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Correct Answer</Form.Label>
                          {editingQuestion?.type === 'multiple-choice' ? (
                            <Form.Select
                              value={editingQuestion?.correctAnswer || ''}
                              onChange={(e) =>
                                handleQuestionChange(
                                  'correctAnswer',
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select correct answer</option>
                              {editingQuestion?.options?.map(
                                (option, optIndex) => (
                                  <option key={optIndex} value={option}>
                                    {option || `Option ${optIndex + 1}`}
                                  </option>
                                )
                              )}
                            </Form.Select>
                          ) : editingQuestion?.type === 'true-false' ? (
                            <Form.Select
                              value={editingQuestion?.correctAnswer || ''}
                              onChange={(e) =>
                                handleQuestionChange(
                                  'correctAnswer',
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select correct answer</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </Form.Select>
                          ) : (
                            <Form.Control
                              type="text"
                              value={editingQuestion?.correctAnswer || ''}
                              onChange={(e) =>
                                handleQuestionChange(
                                  'correctAnswer',
                                  e.target.value
                                )
                              }
                              placeholder="Enter correct answer"
                            />
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    {editingQuestion?.type === 'multiple-choice' && (
                      <div className="mb-3">
                        <Form.Label>Options</Form.Label>
                        {editingQuestion.options?.map((option, optIndex) => (
                          <Form.Control
                            key={optIndex}
                            type="text"
                            className="mb-2"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(optIndex, e.target.value)
                            }
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Explanation (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={editingQuestion?.explanation || ''}
                        onChange={(e) =>
                          handleQuestionChange('explanation', e.target.value)
                        }
                        placeholder="Explain why this answer is correct..."
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button variant="success" onClick={handleSaveQuestion}>
                        <FaSave className="me-2" />
                        Save Question
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        <FaTimes className="me-2" />
                        Cancel
                      </Button>
                    </div>
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
                            Type: {question.type} | Points: {question.points}
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

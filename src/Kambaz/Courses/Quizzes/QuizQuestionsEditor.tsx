import { useState } from 'react';
import { Button, Card, Nav, Tab } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaUsers } from 'react-icons/fa';
import type { Question, QuestionGroup } from './types';
import MultipleChoiceEditor from './MultipleChoiceEditor';
import TrueFalseEditor from './TrueFalseEditor';
import FillInBlankEditor from './FillInBlankEditor';
import QuestionGroupManager from './QuestionGroupManager';
import QuestionFinder from './QuestionFinder';

interface QuizQuestionsEditorProps {
  questions?: Question[];
  questionGroups?: QuestionGroup[];
  onQuestionsChange?: (questions: Question[]) => void;
  onQuestionGroupsChange?: (groups: QuestionGroup[]) => void;
  onSave?: () => void;
  onSaveAndPublish?: () => void;
  onCancel?: () => void;
  allQuestions?: Question[]; // Optional: all available questions for finding
}

export default function QuizQuestionsEditor({
  questions = [],
  questionGroups = [],
  onQuestionsChange,
  onQuestionGroupsChange,
  onSave,
  onSaveAndPublish,
  onCancel,
  allQuestions = [],
}: QuizQuestionsEditorProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<string>('questions');

  const handleAddQuestion = () => {
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
    }
  };

  const handleAddFromFinder = (question: Question) => {
    const newQuestion: Question = {
      ...question,
      _id: undefined, // Remove ID to create a new question
    };
    
    const updatedQuestions = [...questions, newQuestion];
    onQuestionsChange?.(updatedQuestions);
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

      {/* Navigation Tabs */}
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'questions'} 
            onClick={() => setActiveTab('questions')}
          >
            Questions ({questions.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'groups'} 
            onClick={() => setActiveTab('groups')}
          >
            <FaUsers className="me-1" />
            Groups ({questionGroups.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'finder'} 
            onClick={() => setActiveTab('finder')}
          >
            <FaSearch className="me-1" />
            Find Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tab Content */}
      <Tab.Content>
        {activeTab === 'questions' && (
          <Tab.Pane active>
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
                              onQuestionTypeChange={handleQuestionTypeChange}
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
                              onQuestionTypeChange={handleQuestionTypeChange}
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
                              onQuestionTypeChange={handleQuestionTypeChange}
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
                                Blanks: {question.blanks?.length || 0}
                              </small>
                              {question.blanks && question.blanks.length > 0 && (
                                <div className="ms-3 mt-1">
                                  {question.blanks.map((blank, index) => (
                                    <div key={blank.id} className="mb-1">
                                      <small className="text-muted">
                                        <strong>Blank {index + 1}:</strong>{' '}
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
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Tab.Pane>
        )}

        {activeTab === 'groups' && onQuestionGroupsChange && (
          <Tab.Pane active>
            <QuestionGroupManager
              groups={questionGroups}
              questions={questions}
              onGroupsChange={onQuestionGroupsChange}
              onQuestionsChange={onQuestionsChange || (() => {})}
            />
          </Tab.Pane>
        )}

        {activeTab === 'finder' && (
          <Tab.Pane active>
            <QuestionFinder
              questions={questions}
              onAddQuestion={handleAddFromFinder}
              allQuestions={allQuestions}
            />
          </Tab.Pane>
        )}
      </Tab.Content>

      {/* Save/Cancel Buttons */}
      {(onSave || onSaveAndPublish || onCancel) && (
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onSave && (
            <Button variant="outline-primary" onClick={onSave}>
              Save
            </Button>
          )}
          {onSaveAndPublish && (
            <Button variant="primary" onClick={onSaveAndPublish}>
              Save & Publish
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

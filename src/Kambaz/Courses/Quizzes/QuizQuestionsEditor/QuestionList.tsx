import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Question } from '../types';

/**
 * QuestionList Component
 *
 * Handles the question list display section:
 * - Renders all questions in a list format
 * - Shows question details (type, points, content)
 * - Provides edit and delete actions for each question
 *
 * This component focuses on displaying the list of questions
 * and providing actions to modify them.
 */

interface QuestionListProps {
  questions: Question[];
  onEditQuestion: (question: Question, index: number) => void;
  onDeleteQuestion: (index: number) => void;
}

export default function QuestionList({
  questions,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionListProps) {
  console.log('=== QuestionList Render ===');
  console.log('questions array:', questions);
  console.log('questions length:', questions.length);

  if (questions.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center text-muted">
          <p>No questions added yet. Click "Add Question" to get started.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="questions-list">
      {(() => {
        console.log('=== QuestionList map function start ===');
        console.log('questions array before map:', questions);
        console.log('questions length before map:', questions.length);
        console.log('questions array type:', typeof questions);
        console.log('questions array constructor:', questions.constructor);
        console.log('questions array isArray:', Array.isArray(questions));
        return null;
      })()}

      {questions.map((question, index) => {
        console.log(`=== Mapping question ${index} ===`);
        console.log(`Question ${index}:`, question);
        console.log(`Question ${index} type:`, question.type);
        console.log(`Question ${index} text:`, question.text);

        return (
          <Card key={index} className="mb-3" id={`question-${index}`}>
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
                      onClick={() => {
                        console.log(
                          `Edit button clicked for question at index ${index}`
                        );
                        console.log('Question to edit:', question);
                        onEditQuestion(question, index);
                      }}
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDeleteQuestion(index)}
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                {question.type === 'multiple-choice' && question.options && (
                  <div className="ms-3">
                    <small className="text-muted">Options:</small>
                    <ul className="list-unstyled ms-3">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex} className="mb-1">
                          {option || `Option ${optIndex + 1}`}
                          {option === question.correctAnswer && (
                            <span className="text-success ms-2">✓ Correct</span>
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
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}

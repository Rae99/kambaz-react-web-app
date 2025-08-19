import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, ProgressBar, Alert, Modal } from 'react-bootstrap';

import type { Quiz, Question } from '../types';

/**
 * StudentQuizTaking Component
 *
 * Handles the interactive quiz taking interface for students:
 * - Displays questions one by one with navigation
 * - Shows timer and progress
 * - Handles answer selection for all question types
 * - Provides exit confirmation modal
 * - Shows time warnings
 *
 * This component focuses on the core quiz taking experience
 * that students use to complete their quizzes.
 */

interface StudentQuizTakingProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  quizAttempt: {
    answers: { [questionId: string]: string | string[] };
    attemptNumber: number;
  };
  existingAttempts: any[];
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
  onBlankAnswerChange: (blankIndex: number, answer: string) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmitQuiz: () => void;
  areAllQuestionsAnswered: () => boolean;
  getTimeSpent: () => number;
  getRemainingTime: () => string | null;
  isQuestionAnswered: (question: Question) => boolean;
}

export default function StudentQuizTaking({
  quiz,
  currentQuestionIndex,
  quizAttempt,

  onAnswerChange,
  onBlankAnswerChange,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitQuiz,
  areAllQuestionsAnswered,
  getTimeSpent,
  getRemainingTime,
  isQuestionAnswered,
}: StudentQuizTakingProps) {
  const { cid } = useParams();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const currentQuestionId = `question_${currentQuestionIndex}`;
  const progress = quiz?.questions?.length
    ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100
    : 0;

  return (
    <div className="student-quiz-taking">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Taking Quiz - {quiz.title}</h1>
        <div>
          <span className="text-muted me-3">
            Attempt #{quizAttempt.attemptNumber} of{' '}
            {quiz.multipleAttempts ? quiz.attemptsAllowed : 1}
          </span>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmModal(true)}
          >
            Exit Quiz
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          {/* Time warning alert */}
          {quiz.timeLimit && getTimeSpent() > quiz.timeLimit * 60 * 0.8 && (
            <Alert variant="warning" className="mb-3">
              ⚠️ <strong>Time Warning:</strong> You have less than 20% of your
              time remaining!
            </Alert>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">
              Question {currentQuestionIndex + 1} of{' '}
              {quiz?.questions?.length || 0}
            </h5>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">
                {quizAttempt.answers[currentQuestionId]
                  ? 'Answered'
                  : 'Not answered'}
              </span>
              <span className="text-info">
                ⏱️ Time: {Math.floor(getTimeSpent() / 60)}:
                {(getTimeSpent() % 60).toString().padStart(2, '0')}
              </span>
              {quiz.timeLimit && (
                <span className="text-warning">
                  ⏳ Remaining: {getRemainingTime()}
                </span>
              )}
            </div>
          </div>

          <ProgressBar now={progress} className="mb-3" />

          <div className="mb-3">
            <h6>Points: {currentQuestion?.points || 0}</h6>
            <p className="mb-3">{currentQuestion?.text}</p>

            {currentQuestion?.type === 'multiple-choice' &&
              currentQuestion.options && (
                <div>
                  {currentQuestion.options.map(
                    (option: string, optionIndex: number) => (
                      <div key={optionIndex} className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`question-${currentQuestionId}`}
                          id={`option-${optionIndex}`}
                          value={option}
                          checked={
                            quizAttempt.answers[currentQuestionId] === option
                          }
                          onChange={(e) =>
                            onAnswerChange(currentQuestionId, e.target.value)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`option-${optionIndex}`}
                        >
                          {option}
                        </label>
                      </div>
                    )
                  )}
                </div>
              )}

            {currentQuestion?.type === 'true-false' && (
              <div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${currentQuestionId}`}
                    id="true-option"
                    value="true"
                    checked={quizAttempt.answers[currentQuestionId] === 'true'}
                    onChange={(e) =>
                      onAnswerChange(currentQuestionId, e.target.value)
                    }
                  />
                  <label className="form-check-label" htmlFor="true-option">
                    True
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${currentQuestionId}`}
                    id="false-option"
                    value="false"
                    checked={quizAttempt.answers[currentQuestionId] === 'false'}
                    onChange={(e) =>
                      onAnswerChange(currentQuestionId, e.target.value)
                    }
                  />
                  <label className="form-check-label" htmlFor="false-option">
                    False
                  </label>
                </div>
              </div>
            )}

            {currentQuestion?.type === 'fill-in-the-blank' &&
              currentQuestion.blanks && (
                <div>
                  {currentQuestion.blanks.map((blank, blankIndex) => (
                    <div key={blank.id} className="mb-3">
                      <label className="form-label">
                        Blank {blankIndex + 1}:
                      </label>
                      <select
                        className="form-select"
                        value={
                          (
                            quizAttempt.answers[currentQuestionId] as string[]
                          )?.[blankIndex] || ''
                        }
                        onChange={(e) =>
                          onBlankAnswerChange(blankIndex, e.target.value)
                        }
                      >
                        <option value="">Select an answer...</option>
                        {blank.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex === (quiz?.questions?.length || 0) - 1 ? (
              <Button
                variant="success"
                onClick={onSubmitQuiz}
                disabled={!areAllQuestionsAnswered()}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onNextQuestion}
                disabled={
                  !isQuestionAnswered(quiz?.questions[currentQuestionIndex])
                }
              >
                Next
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h6>Quiz Progress</h6>
          <div className="d-flex flex-wrap gap-2">
            {(quiz?.questions || []).map(
              (question: Question, index: number) => {
                const questionId = `question_${index}`;
                return (
                  <Button
                    key={index}
                    variant={
                      quizAttempt.answers[questionId]
                        ? 'success'
                        : currentQuestionIndex === index
                        ? 'primary'
                        : 'outline-secondary'
                    }
                    size="sm"
                    className="disabled"
                  >
                    {index + 1}
                  </Button>
                );
              }
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Confirmation Modal for exiting quiz */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Exit Quiz?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to exit? Your progress will be lost.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Continue Quiz
          </Button>
          <Button
            variant="danger"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Exit Quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

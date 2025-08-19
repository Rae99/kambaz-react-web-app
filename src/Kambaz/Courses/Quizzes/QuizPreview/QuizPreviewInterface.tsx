import { Card, Button, ProgressBar } from 'react-bootstrap';
import type { Quiz, Question } from '../types';

/**
 * QuizPreviewInterface Component
 *
 * Handles the quiz taking interface for faculty preview:
 * - Displays questions one by one
 * - Handles answer selection
 * - Manages navigation between questions
 * - Shows progress and completion status
 *
 * This component focuses on the interactive quiz taking experience
 * that faculty use to preview and test their quizzes.
 */

interface QuizPreviewInterfaceProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  quizAttempt: {
    answers: { [questionIndex: number]: string | string[] };
  };
  onAnswerChange: (questionIndex: number, answer: string | string[]) => void;
  onBlankAnswerChange: (
    questionIndex: number,
    blankIndex: number,
    answer: string
  ) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onJumpToQuestion: (questionIndex: number) => void;
  onSubmitQuiz: () => void;
  areAllQuestionsAnswered: () => boolean;
}

export default function QuizPreviewInterface({
  quiz,
  currentQuestionIndex,
  quizAttempt,
  onAnswerChange,
  onBlankAnswerChange,
  onNextQuestion,
  onPreviousQuestion,
  onJumpToQuestion,
  onSubmitQuiz,
  areAllQuestionsAnswered,
}: QuizPreviewInterfaceProps) {
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-preview">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </h5>
            <div className="text-muted">
              {quizAttempt.answers[currentQuestionIndex]
                ? 'Answered'
                : 'Not answered'}
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
                          name={`question-${currentQuestionIndex}`}
                          id={`option-${optionIndex}`}
                          value={option}
                          checked={
                            quizAttempt.answers[currentQuestionIndex] === option
                          }
                          onChange={(e) =>
                            onAnswerChange(currentQuestionIndex, e.target.value)
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
                    name={`question-${currentQuestionIndex}`}
                    id="true-option"
                    value="true"
                    checked={
                      quizAttempt.answers[currentQuestionIndex] === 'true'
                    }
                    onChange={(e) =>
                      onAnswerChange(currentQuestionIndex, e.target.value)
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
                    name={`question-${currentQuestionIndex}`}
                    id="false-option"
                    value="false"
                    checked={
                      quizAttempt.answers[currentQuestionIndex] === 'false'
                    }
                    onChange={(e) =>
                      onAnswerChange(currentQuestionIndex, e.target.value)
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
                    <div
                      key={`${currentQuestionIndex}-${blankIndex}`}
                      className="mb-3"
                    >
                      <label className="form-label">
                        Blank {blankIndex + 1}:
                      </label>
                      <select
                        className="form-select"
                        value={
                          (
                            quizAttempt.answers[
                              currentQuestionIndex
                            ] as string[]
                          )?.[blankIndex] || ''
                        }
                        onChange={(e) =>
                          onBlankAnswerChange(
                            currentQuestionIndex,
                            blankIndex,
                            e.target.value
                          )
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

            {currentQuestionIndex === quiz.questions.length - 1 ? (
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
                disabled={!quizAttempt.answers[currentQuestionIndex]}
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
            {quiz.questions.map((_question: Question, index: number) => (
              <Button
                key={index}
                variant={
                  quizAttempt.answers[index] ? 'success' : 'outline-secondary'
                }
                size="sm"
                onClick={() => onJumpToQuestion(index)}
                disabled={currentQuestionIndex === index} // Disable current question to avoid meaningless clicks
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Alert,
  ProgressBar,
  Badge,
  Modal,
} from 'react-bootstrap';
import { FaCheck, FaTimes, FaEye, FaPlay } from 'react-icons/fa';
import * as quizzesClient from './client';
import type { Quiz, Question } from './types';

// Import availability functions from parent component
import { isQuizAvailableForStudent, getQuizAvailabilityReason } from './index';

// Student-specific function for comprehensive availability check
export const canStudentTakeQuiz = async (
  quiz: Quiz,
  studentId: string,
  getStudentAttempts: (quizId: string, studentId: string) => Promise<any[]>
): Promise<{ canTake: boolean; reason?: string }> => {
  // First check basic availability
  if (!isQuizAvailableForStudent(quiz)) {
    return { canTake: false, reason: getQuizAvailabilityReason(quiz) };
  }

  // Check attempt limits
  if (quiz.multipleAttempts) {
    try {
      const attempts = await getStudentAttempts(quiz._id!, studentId);
      const currentAttemptNumber = attempts.length + 1;

      if (currentAttemptNumber > quiz.attemptsAllowed) {
        return {
          canTake: false,
          reason: `You have exceeded the maximum attempts (${quiz.attemptsAllowed}) for this quiz.`,
        };
      }
    } catch (error) {
      console.error('Error checking student attempts:', error);
      return { canTake: false, reason: 'Unable to verify attempt limits' };
    }
  }

  return { canTake: true };
};

interface QuizAttempt {
  _id?: string;
  studentId: string;
  quizId: string;
  answers: { [questionId: string]: string | string[] };
  score: number;
  totalPoints: number;
  isCompleted: boolean;
  submittedAt: Date;
  attemptNumber: number;
}

interface StudentQuizProps {
  mode: 'take' | 'review';
  attemptId?: string;
}

export default function StudentQuiz({
  mode: initialMode,
  attemptId,
}: StudentQuizProps) {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [mode, setMode] = useState<'take' | 'review'>(initialMode);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt>({
    studentId: currentUser?._id || '',
    quizId: qid || '',
    answers: {},
    score: 0,
    totalPoints: 0,
    isCompleted: false,
    submittedAt: new Date(),
    attemptNumber: 1,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [existingAttempts, setExistingAttempts] = useState<QuizAttempt[]>([]);

  // Check if user is student
  const isStudent = currentUser?.role === 'STUDENT';

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          setLoading(true);
          const quizData = await quizzesClient.findQuizById(qid);
          setQuiz(quizData);

          // Check if student can take this quiz
          if (mode === 'take') {
            await checkQuizAvailability(quizData);
          }

          setQuizAttempt((prev) => ({
            ...prev,
            totalPoints: quizData.questions.reduce(
              (sum: number, q: Question) => sum + q.points,
              0
            ),
          }));
        } catch (error) {
          console.error('Error fetching quiz:', error);
          setError('Failed to fetch quiz details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [qid, mode]);

  const checkQuizAvailability = async (quizData: Quiz) => {
    try {
      const result = await canStudentTakeQuiz(
        quizData,
        currentUser?._id!,
        quizzesClient.getStudentAttempts
      );

      if (!result.canTake) {
        setError(result.reason || 'Quiz is not available');
        return;
      }

      // Get existing attempts for this student and quiz
      const attempts = await quizzesClient.getStudentAttempts(
        qid!,
        currentUser?._id!
      );
      setExistingAttempts(attempts);

      const currentAttemptNumber = attempts.length + 1;

      setQuizAttempt((prev) => ({
        ...prev,
        attemptNumber: currentAttemptNumber,
      }));
    } catch (error) {
      console.error('Error checking quiz availability:', error);
    }
  };

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    setQuizAttempt((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Calculate score based on answers
    let score = 0;
    quiz?.questions.forEach((question: Question) => {
      const userAnswer = quizAttempt.answers[question._id || ''];
      if (userAnswer) {
        if (Array.isArray(question.correctAnswer)) {
          // Multiple correct answers
          if (
            Array.isArray(userAnswer) &&
            userAnswer.length === question.correctAnswer.length &&
            userAnswer.every((ans) => question.correctAnswer.includes(ans))
          ) {
            score += question.points;
          }
        } else {
          // Single correct answer
          if (userAnswer === question.correctAnswer) {
            score += question.points;
          }
        }
      }
    });

    const finalAttempt = {
      ...quizAttempt,
      score,
      isCompleted: true,
      submittedAt: new Date(),
    };

    try {
      // Save attempt to backend
      const savedAttempt = await quizzesClient.saveStudentAttempt(finalAttempt);
      setQuizAttempt(savedAttempt);
    } catch (error) {
      console.error('Error saving attempt:', error);
      setError('Failed to save your quiz attempt');
    }
  };

  const handleTakeQuiz = () => {
    setMode('take');
    setCurrentQuestionIndex(0);
    setQuizAttempt({
      studentId: currentUser?._id || '',
      quizId: qid || '',
      answers: {},
      score: 0,
      totalPoints: quiz?.questions.reduce((sum, q) => sum + q.points, 0) || 0,
      isCompleted: false,
      submittedAt: new Date(),
      attemptNumber: existingAttempts.length + 1,
    });
  };

  const handleReviewAttempt = (attempt: QuizAttempt) => {
    setQuizAttempt(attempt);
    setMode('review');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!quiz) {
    return <Alert variant="warning">Quiz not found</Alert>;
  }

  if (!isStudent) {
    return <Alert variant="warning">Access denied. Students only.</Alert>;
  }

  // If reviewing, show the attempt results
  if (mode === 'review' && quizAttempt.isCompleted) {
    return (
      <div className="student-quiz-review">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quiz Results - {quiz.title}</h1>
          <div>
            <Button
              variant="outline-primary"
              onClick={handleTakeQuiz}
              className="me-2"
            >
              <FaPlay className="me-2" />
              Take Quiz Again
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
            >
              Back to Quizzes
            </Button>
          </div>
        </div>

        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">
              Attempt #{quizAttempt.attemptNumber} Results
            </h5>
            <div className="text-center">
              <h2 className="text-primary">
                {quizAttempt.score} / {quizAttempt.totalPoints}
              </h2>
              <ProgressBar
                now={(quizAttempt.score / quizAttempt.totalPoints) * 100}
                className="mb-3"
                variant={
                  quizAttempt.score / quizAttempt.totalPoints >= 0.7
                    ? 'success'
                    : 'warning'
                }
              />
              <p className="text-muted">
                Submitted: {quizAttempt.submittedAt.toLocaleString()}
              </p>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <h5 className="card-title">Question Review</h5>
            {quiz.questions.map((question: Question, index: number) => {
              const userAnswer = quizAttempt.answers[question._id || ''];
              const isCorrect = Array.isArray(question.correctAnswer)
                ? Array.isArray(userAnswer) &&
                  userAnswer.length === question.correctAnswer.length &&
                  userAnswer.every((ans) =>
                    question.correctAnswer.includes(ans)
                  )
                : userAnswer === question.correctAnswer;

              return (
                <div
                  key={question._id || index}
                  className={`mb-3 p-3 border rounded ${
                    isCorrect
                      ? 'border-success bg-light'
                      : 'border-danger bg-light'
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6>
                      Question {index + 1} ({question.points} points)
                    </h6>
                    <Badge bg={isCorrect ? 'success' : 'danger'}>
                      {isCorrect ? <FaCheck /> : <FaTimes />}{' '}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  <p className="mb-2">{question.text}</p>

                  {question.type === 'multiple-choice' && question.options && (
                    <div>
                      <p className="text-muted mb-1">
                        <strong>Your answer:</strong>{' '}
                        {Array.isArray(userAnswer)
                          ? userAnswer.join(', ')
                          : userAnswer}
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Correct answer:</strong>{' '}
                        {Array.isArray(question.correctAnswer)
                          ? question.correctAnswer.join(', ')
                          : question.correctAnswer}
                      </p>
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div>
                      <p className="text-muted mb-1">
                        <strong>Your answer:</strong> {userAnswer}
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Correct answer:</strong>{' '}
                        {question.correctAnswer}
                      </p>
                    </div>
                  )}

                  {question.type === 'fill-in-the-blank' && (
                    <div>
                      <p className="text-muted mb-1">
                        <strong>Your answer:</strong> {userAnswer}
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Correct answer:</strong>{' '}
                        {Array.isArray(question.correctAnswer)
                          ? question.correctAnswer.join(', ')
                          : question.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </Card.Body>
        </Card>
      </div>
    );
  }

  // If taking quiz, show the quiz interface
  if (mode === 'take') {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h5>
              <div className="text-muted">
                {quizAttempt.answers[currentQuestion?._id || '']
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
                            name={`question-${currentQuestion._id}`}
                            id={`option-${optionIndex}`}
                            value={option}
                            checked={
                              quizAttempt.answers[currentQuestion._id || ''] ===
                              option
                            }
                            onChange={(e) =>
                              handleAnswerChange(
                                currentQuestion._id || '',
                                e.target.value
                              )
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
                      name={`question-${currentQuestion._id}`}
                      id="true-option"
                      value="true"
                      checked={
                        quizAttempt.answers[currentQuestion._id || ''] ===
                        'true'
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion._id || '',
                          e.target.value
                        )
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
                      name={`question-${currentQuestion._id}`}
                      id="false-option"
                      value="false"
                      checked={
                        quizAttempt.answers[currentQuestion._id || ''] ===
                        'false'
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion._id || '',
                          e.target.value
                        )
                      }
                    />
                    <label className="form-check-label" htmlFor="false-option">
                      False
                    </label>
                  </div>
                </div>
              )}

              {currentQuestion?.type === 'fill-in-the-blank' && (
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your answer"
                    value={quizAttempt.answers[currentQuestion._id || ''] || ''}
                    onChange={(e) =>
                      handleAnswerChange(
                        currentQuestion._id || '',
                        e.target.value
                      )
                    }
                  />
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <Button
                  variant="success"
                  onClick={handleSubmitQuiz}
                  disabled={
                    Object.keys(quizAttempt.answers).length <
                    quiz.questions.length
                  }
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  disabled={!quizAttempt.answers[currentQuestion._id || '']}
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
              {quiz.questions.map((question: Question, index: number) => (
                <Button
                  key={question._id || index}
                  variant={
                    quizAttempt.answers[question._id || '']
                      ? 'success'
                      : 'outline-secondary'
                  }
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={currentQuestionIndex === index ? 'fw-bold' : ''}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Confirmation Modal for exiting quiz */}
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
        >
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

  // Default view - show quiz info and options
  return (
    <div className="student-quiz-info">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{quiz.title}</h1>
        <Button
          variant="outline-secondary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="card-title">Quiz Information</h5>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Description:</strong> {quiz.description}
              </p>
              <p>
                <strong>Points:</strong> {quiz.points}
              </p>
              <p>
                <strong>Questions:</strong> {quiz.questions.length}
              </p>
              <p>
                <strong>Time Limit:</strong> {quiz.timeLimit} minutes
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Multiple Attempts:</strong>{' '}
                {quiz.multipleAttempts ? 'Yes' : 'No'}
              </p>
              {quiz.multipleAttempts && (
                <p>
                  <strong>Attempts Allowed:</strong> {quiz.attemptsAllowed}
                </p>
              )}
              <p>
                <strong>Your Attempts:</strong> {existingAttempts.length}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {existingAttempts.length > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">Previous Attempts</h5>
            {existingAttempts.map((attempt, index) => (
              <div
                key={attempt._id || index}
                className="d-flex justify-content-between align-items-center p-2 border-bottom"
              >
                <div>
                  <span className="fw-bold">
                    Attempt #{attempt.attemptNumber}
                  </span>
                  <span className="text-muted ms-3">
                    {attempt.submittedAt.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="me-3">
                    Score: {attempt.score} / {attempt.totalPoints}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleReviewAttempt(attempt)}
                  >
                    <FaEye className="me-1" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      <div className="text-center">
        {quiz.multipleAttempts &&
        existingAttempts.length < quiz.attemptsAllowed ? (
          <Button variant="primary" size="lg" onClick={handleTakeQuiz}>
            <FaPlay className="me-2" />
            Take Quiz
          </Button>
        ) : !quiz.multipleAttempts && existingAttempts.length === 0 ? (
          <Button variant="primary" size="lg" onClick={handleTakeQuiz}>
            <FaPlay className="me-2" />
            Take Quiz
          </Button>
        ) : (
          <Alert variant="info">
            You have completed all available attempts for this quiz.
          </Alert>
        )}
      </div>
    </div>
  );
}

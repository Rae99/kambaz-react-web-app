import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { FaEdit, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import * as quizzesClient from './client';
import type { Quiz, Question } from './types';

interface QuizAttempt {
  answers: { [questionId: string]: string | string[] };
  score: number;
  totalPoints: number;
  isCompleted: boolean;
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt>({
    answers: {},
    score: 0,
    totalPoints: 0,
    isCompleted: false,
  });

  // Check if user is faculty
  const isFaculty =
    currentUser?.role === 'FACULTY' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'TA';

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          setLoading(true);
          const quizData = await quizzesClient.findQuizById(qid);
          setQuiz(quizData);
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
  }, [qid]);

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

  const handleSubmitQuiz = () => {
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

    setQuizAttempt((prev) => ({
      ...prev,
      score,
      isCompleted: true,
    }));
  };

  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
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

  if (!isFaculty) {
    return <Alert variant="warning">Access denied. Faculty only.</Alert>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (quizAttempt.isCompleted) {
    // Show results
    return (
      <div className="quiz-preview-results">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quiz Preview Results</h1>
          <Button variant="outline-primary" onClick={handleEditQuiz}>
            <FaEdit className="me-2" />
            Edit Quiz
          </Button>
        </div>

        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">Final Score</h5>
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
                Percentage:{' '}
                {Math.round(
                  (quizAttempt.score / quizAttempt.totalPoints) * 100
                )}
                %
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
                  className="mb-3 p-3 border rounded"
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
                        Your answer: {userAnswer}
                      </p>
                      <p className="text-muted mb-0">
                        Correct answer: {question.correctAnswer}
                      </p>
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div>
                      <p className="text-muted mb-1">
                        Your answer: {userAnswer}
                      </p>
                      <p className="text-muted mb-0">
                        Correct answer: {question.correctAnswer}
                      </p>
                    </div>
                  )}

                  {question.type === 'fill-in-the-blank' && (
                    <div>
                      <p className="text-muted mb-1">
                        Your answer: {userAnswer}
                      </p>
                      <p className="text-muted mb-0">
                        Correct answer: {question.correctAnswer}
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

  return (
    <div className="quiz-preview">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quiz Preview - {quiz.title}</h1>
        <Button variant="outline-primary" onClick={handleEditQuiz}>
          <FaEdit className="me-2" />
          Edit Quiz
        </Button>
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
                      quizAttempt.answers[currentQuestion._id || ''] === 'true'
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
                      quizAttempt.answers[currentQuestion._id || ''] === 'false'
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
    </div>
  );
}

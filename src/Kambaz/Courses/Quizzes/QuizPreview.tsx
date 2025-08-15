import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
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

  // Helper function to check if a question is fully answered
  const isQuestionAnswered = (question: Question): boolean => {
    const answer = quizAttempt.answers[question._id || ''];
    
    if (question.type === 'fill-in-the-blank' && question.blanks) {
      // For fill-in-the-blank, check if all blanks have answers
      const userAnswers = answer as string[] || [];
      return question.blanks.every((_, index) => 
        userAnswers[index] && userAnswers[index].trim() !== ''
      );
    }
    
    // For other question types, just check if answer exists
    return !!answer;
  };

  // Helper function to check if all questions are answered
  const areAllQuestionsAnswered = (): boolean => {
    if (!quiz) return false;
    return quiz.questions.every(question => isQuestionAnswered(question));
  };

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

  const handleBlankAnswerChange = (
    questionId: string,
    blankIndex: number,
    answer: string
  ) => {
    setQuizAttempt((prev) => {
      const currentAnswers = (prev.answers[questionId] as string[]) || [];
      const newAnswers = [...currentAnswers];
      newAnswers[blankIndex] = answer;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: newAnswers,
        },
      };
    });
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
        if (question.type === 'fill-in-the-blank' && question.blanks) {
          // New fill-in-the-blank with dropdown selections
          if (
            Array.isArray(userAnswer) &&
            userAnswer.length === question.blanks.length
          ) {
            // Check if all blanks are answered correctly
            const allCorrect = question.blanks.every(
              (blank, index) => userAnswer[index] === blank.correctAnswer
            );
            if (allCorrect) {
              score += question.points;
            }
          }
        } else if (Array.isArray(question.correctAnswer)) {
          // Multiple correct answers (legacy or other types)
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

              // Calculate correctness based on question type
              let isCorrect = false;
              if (question.type === 'fill-in-the-blank' && question.blanks) {
                // For fill-in-the-blank, check if all blanks are answered correctly
                const userAnswers = (userAnswer as string[]) || [];
                isCorrect = question.blanks.every(
                  (blank, index) => userAnswers[index] === blank.correctAnswer
                );
              } else if (Array.isArray(question.correctAnswer)) {
                // For multiple-choice with multiple correct answers
                isCorrect =
                  Array.isArray(userAnswer) &&
                  userAnswer.length === question.correctAnswer.length &&
                  userAnswer.every((ans) =>
                    question.correctAnswer.includes(ans)
                  );
              } else {
                // For single-answer questions (true/false, single multiple-choice)
                isCorrect = userAnswer === question.correctAnswer;
              }

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

                  {question.type === 'fill-in-the-blank' && question.blanks && (
                    <div>
                      <p className="text-muted mb-1">Your answers:</p>
                      {question.blanks.map((blank, blankIndex) => {
                        const userAnswers = (userAnswer as string[]) || [];
                        const userBlankAnswer =
                          userAnswers[blankIndex] || 'Not answered';
                        const isBlankCorrect =
                          userBlankAnswer === blank.correctAnswer;

                        return (
                          <div key={blank.id} className="ms-3 mb-2">
                            <span className="fw-semibold">
                              Blank {blankIndex + 1}:
                            </span>
                            <span
                              className={`ms-2 ${
                                isBlankCorrect ? 'text-success' : 'text-danger'
                              }`}
                            >
                              {userBlankAnswer}
                            </span>
                            {!isBlankCorrect && (
                              <span className="text-muted ms-2">
                                (Correct: {blank.correctAnswer})
                              </span>
                            )}
                          </div>
                        );
                      })}
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
                            quizAttempt.answers[
                              currentQuestion._id || ''
                            ] as string[]
                          )?.[blankIndex] || ''
                        }
                        onChange={(e) =>
                          handleBlankAnswerChange(
                            currentQuestion._id || '',
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
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                variant="success"
                onClick={handleSubmitQuiz}
                disabled={!areAllQuestionsAnswered()}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNextQuestion}
                disabled={!isQuestionAnswered(currentQuestion)}
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

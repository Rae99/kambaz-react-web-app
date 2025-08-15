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
import {
  isQuizAvailableForStudent,
  getQuizAvailabilityReason,
  canStudentTakeQuiz,
} from './index';

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
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Check if user is student
  const isStudent = currentUser?.role === 'STUDENT';

  // Helper function to check if a question is fully answered
  const isQuestionAnswered = (question: Question): boolean => {
    const currentQuestionId = question?._id || `question_${currentQuestionIndex}`;
    const answer = quizAttempt.answers[currentQuestionId];
    
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
    return quiz.questions.every((question, index) => {
      const questionId = question._id || `question_${index}`;
      const answer = quizAttempt.answers[questionId];
      
      if (question.type === 'fill-in-the-blank' && question.blanks) {
        const userAnswers = answer as string[] || [];
        return question.blanks.every((_, blankIndex) => 
          userAnswers[blankIndex] && userAnswers[blankIndex].trim() !== ''
        );
      }
      
      return !!answer;
    });
  };

  // Start timer when quiz begins
  useEffect(() => {
    if (mode === 'take' && !startTime) {
      setStartTime(new Date());
    }
  }, [mode, startTime]);

  // Update current time every second for real-time timer
  useEffect(() => {
    if (mode === 'take' && startTime) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, startTime]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (mode === 'take' && quiz?.timeLimit && startTime) {
      const timeSpent = getTimeSpent();
      const timeLimitSeconds = quiz.timeLimit * 60;

      if (timeSpent >= timeLimitSeconds) {
        // Time's up! Auto-submit the quiz
        handleSubmitQuiz();
      }
    }
  }, [currentTime, quiz?.timeLimit, startTime, mode]);

  // Calculate time spent in seconds (matching backend schema)
  const getTimeSpent = () => {
    if (!startTime) return 0;
    const diffMs = currentTime.getTime() - startTime.getTime();
    return Math.round(diffMs / 1000); // Convert to seconds
  };

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!quiz?.timeLimit || !startTime) return null;
    const timeSpent = getTimeSpent();
    const remainingSeconds = quiz.timeLimit * 60 - timeSpent;
    if (remainingSeconds <= 0) return 0;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          setLoading(true);
          const quizData = await quizzesClient.findQuizById(qid);
          console.log('Backend sent quiz data:', quizData);
          console.log(
            'Questions with IDs:',
            quizData.questions?.map((q: Question, i: number) => ({
              index: i,
              id: q._id,
              text: q.text?.substring(0, 50),
            }))
          );

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

          // Load existing attempts for this student
          if (currentUser?._id) {
            try {
              const attempts = await quizzesClient.getStudentAttempts(
                qid,
                currentUser._id
              );
              setExistingAttempts(attempts);
            } catch (error) {
              console.error('Failed to load attempts:', error);
              // Don't show error for attempts loading
            }
          }
        } catch (error) {
          console.error('Error fetching quiz:', error);
          setError('Failed to fetch quiz details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [qid, mode, currentUser?._id]);

  const checkQuizAvailability = async (quizData: Quiz) => {
    try {
      const result = await canStudentTakeQuiz(quizData, currentUser?._id!);

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
    // Use the same key logic as the rest of the component
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    const answerKey =
      currentQuestion?._id || `question_${currentQuestionIndex}`;

    console.log('handleAnswerChange called:', {
      questionId,
      answer,
      currentQuestionIndex,
      currentQuestionId: currentQuestion?._id,
      answerKey,
      currentAnswers: quizAttempt.answers,
    });

    const newAnswers = {
      ...quizAttempt.answers,
      [answerKey]: answer,
    };

    console.log('New answers object:', newAnswers);

    setQuizAttempt((prev) => {
      const updated = {
        ...prev,
        answers: newAnswers,
      };
      console.log('Updated quizAttempt:', updated);
      return updated;
    });

    // Auto-save answers as student progresses (using saveQuizProgress, not submit)
    if (qid) {
      console.log('Auto-saving answers:', {
        qid,
        newAnswers,
        timeSpent: getTimeSpent(),
      });
      quizzesClient
        .saveQuizProgress(qid, newAnswers, getTimeSpent())
        .then((savedAttempt) => {
          console.log('Auto-save successful:', savedAttempt);
          setQuizAttempt(savedAttempt);
        })
        .catch((error) => {
          console.error('Auto-save failed:', error);
          // Don't show error to user for auto-save failures
        });
    }
  };

  const handleBlankAnswerChange = (
    questionId: string,
    blankIndex: number,
    answer: string
  ) => {
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    const answerKey =
      currentQuestion?._id || `question_${currentQuestionIndex}`;

    const currentAnswers = (quizAttempt.answers[answerKey] as string[]) || [];
    const newAnswers = [...currentAnswers];
    newAnswers[blankIndex] = answer;

    const updatedAnswers = {
      ...quizAttempt.answers,
      [answerKey]: newAnswers,
    };

    setQuizAttempt((prev) => ({
      ...prev,
      answers: updatedAnswers,
    }));

    // Auto-save answers
    if (qid) {
      quizzesClient
        .saveQuizProgress(qid, updatedAnswers, getTimeSpent())
        .then((savedAttempt) => {
          setQuizAttempt(savedAttempt);
        })
        .catch((error) => {
          console.error('Auto-save failed:', error);
        });
    }
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
    try {
      console.log('Submitting quiz with answers:', quizAttempt.answers);
      console.log('Current attempt ID:', quizAttempt._id);
      console.log('Current attempt state:', quizAttempt);

      // Check if all questions are answered
      const totalQuestions = quiz?.questions?.length || 0;
      const answeredQuestions = Object.keys(quizAttempt.answers).length;

      if (answeredQuestions < totalQuestions) {
        setError(
          `Please answer all ${totalQuestions} questions before submitting. You have answered ${answeredQuestions} questions.`
        );
        return;
      }

      // Prepare answers with question context for better backend processing
      const answersWithContext =
        quiz?.questions?.map((question, index) => {
          const questionId = question._id || `question_${index}`;
          return {
            questionIndex: index,
            questionText: question.text,
            userAnswer: quizAttempt.answers[questionId] || '',
            correctAnswer: question.correctAnswer,
            points: question.points,
          };
        }) || [];

      console.log('Answers with context:', answersWithContext);

      // Use the new submit API for final submission
      const savedAttempt = await quizzesClient.submitQuizAttempt(
        qid!,
        answersWithContext,
        getTimeSpent() // Pass time spent in seconds
      );

      console.log('Quiz submitted successfully:', savedAttempt);

      // Update local state with the submitted attempt
      setQuizAttempt(savedAttempt);

      // Navigate to review mode to show results
      setMode('review');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit your quiz');
    }
  };

  const handleTakeQuiz = () => {
    setMode('take');
    setCurrentQuestionIndex(0);
    setStartTime(new Date()); // Reset timer for new attempt
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

  // Debug logging for review mode
  useEffect(() => {
    if (mode === 'review' && quizAttempt.isCompleted) {
      console.log('Review mode - quizAttempt:', quizAttempt);
      console.log('Review mode - quizAttempt.answers:', quizAttempt.answers);
      console.log('Review mode - quiz:', quiz);
    }
  }, [mode, quizAttempt, quiz]);

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
    // Check if student can take the quiz again
    const canTakeAgain = quiz.multipleAttempts
      ? existingAttempts.length < quiz.attemptsAllowed
      : existingAttempts.length === 0;

    return (
      <div className="student-quiz-review">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quiz Results - {quiz.title}</h1>
          <div>
            {canTakeAgain ? (
              <Button
                variant="outline-primary"
                onClick={handleTakeQuiz}
                className="me-2"
              >
                <FaPlay className="me-2" />
                Take Quiz Again
              </Button>
            ) : (
              <Button variant="warning" disabled className="me-2">
                {quiz.multipleAttempts
                  ? 'Max Attempts Reached'
                  : 'Already Taken'}
              </Button>
            )}
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
                Submitted:{' '}
                {quizAttempt.submittedAt
                  ? new Date(quizAttempt.submittedAt).toLocaleString()
                  : 'Not submitted'}
              </p>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <h5 className="card-title">Question Review</h5>
            {quiz.questions.map((question: Question, index: number) => {
              // Use index-based keys to match the database format
              const questionId = `question_${index}`;
              const userAnswer = quizAttempt.answers[questionId];

              // Debug logging for each question
              console.log(`Question ${index + 1} debug:`, {
                questionId,
                question_id_from_db: question._id,
                userAnswer,
                allAnswerKeys: Object.keys(quizAttempt.answers),
                correctAnswer: question.correctAnswer,
                points: question.points,
              });

              const isCorrect = Array.isArray(question.correctAnswer)
                ? Array.isArray(userAnswer) &&
                  userAnswer.length === question.correctAnswer.length &&
                  userAnswer.every((ans) =>
                    question.correctAnswer.includes(ans)
                  )
                : userAnswer === question.correctAnswer;

              // Debug logging
              console.log(`Question ${index + 1}:`, {
                questionId,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                points: question.points,
              });

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

                  {question.type === 'fill-in-the-blank' && question.blanks && (
                    <div>
                      <p className="text-muted mb-1">Your answers:</p>
                      {question.blanks.map((blank, blankIndex) => {
                        const userAnswers = userAnswer as string[] || [];
                        const userBlankAnswer = userAnswers[blankIndex] || 'Not answered';
                        const isBlankCorrect = userBlankAnswer === blank.correctAnswer;
                        
                        return (
                          <div key={blank.id} className="ms-3 mb-2">
                            <span className="fw-semibold">Blank {blankIndex + 1}:</span>
                            <span className={`ms-2 ${isBlankCorrect ? 'text-success' : 'text-danger'}`}>
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

  // If taking quiz, show the quiz interface
  if (mode === 'take') {
    const currentQuestion = quiz?.questions?.[currentQuestionIndex];
    const currentQuestionId =
      currentQuestion?._id || `question_${currentQuestionIndex}`;
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
                              handleAnswerChange(
                                currentQuestionId,
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
                      name={`question-${currentQuestionId}`}
                      id="true-option"
                      value="true"
                      checked={
                        quizAttempt.answers[currentQuestionId] === 'true'
                      }
                      onChange={(e) =>
                        handleAnswerChange(currentQuestionId, e.target.value)
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
                      checked={
                        quizAttempt.answers[currentQuestionId] === 'false'
                      }
                      onChange={(e) =>
                        handleAnswerChange(currentQuestionId, e.target.value)
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
                            handleBlankAnswerChange(
                              currentQuestionId,
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

              {currentQuestionIndex === (quiz?.questions?.length || 0) - 1 ? (
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
                  const questionId = question._id || `question_${index}`;
                  return (
                    <Button
                      key={questionId}
                      variant={
                        quizAttempt.answers[questionId]
                          ? 'success'
                          : currentQuestionIndex === index
                          ? 'primary'
                          : 'outline-secondary'
                      }
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={
                        currentQuestionIndex === index ? 'fw-bold' : ''
                      }
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
                    {attempt.submittedAt
                      ? new Date(attempt.submittedAt).toLocaleString()
                      : 'Not submitted'}
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

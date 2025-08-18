import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes, FaPlay } from 'react-icons/fa';
import type { Quiz, Question, QuizAttempt } from '../types';

/**
 * StudentQuizReview Component
 *
 * Handles the quiz results review display for students:
 * - Shows attempt results with score and percentage
 * - Displays question-by-question review with correctness
 * - Provides take quiz again functionality
 * - Shows attempt history and navigation
 *
 * This component focuses on displaying the results
 * after students complete their quizzes.
 */

interface StudentQuizReviewProps {
  quiz: Quiz;
  quizAttempt: {
    score: number;
    totalPoints: number;
    attemptNumber: number;
    submittedAt: Date;
    answers: { [questionId: string]: string | string[] };
  };
  existingAttempts: QuizAttempt[];
  onTakeQuiz: () => void;
  onReviewAttempt: (attempt: QuizAttempt) => void;
}

export default function StudentQuizReview({
  quiz,
  quizAttempt,
  existingAttempts,
  onTakeQuiz,
}: StudentQuizReviewProps) {
  const { cid } = useParams();
  const navigate = useNavigate();

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
              onClick={onTakeQuiz}
              className="me-2"
            >
              <FaPlay className="me-2" />
              Take Quiz Again
            </Button>
          ) : (
            <Button variant="warning" disabled className="me-2">
              {quiz.multipleAttempts ? 'Max Attempts Reached' : 'Already Taken'}
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
                userAnswer.every((ans) => question.correctAnswer.includes(ans))
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
                      <strong>Correct answer:</strong> {question.correctAnswer}
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

import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Alert } from 'react-bootstrap';
import { FaPlay, FaEye } from 'react-icons/fa';
import type { Quiz, QuizAttempt } from '../types';

/**
 * StudentQuizInfo Component
 *
 * Handles the quiz information display and attempt history for students:
 * - Shows quiz details (description, points, questions, time limit)
 * - Displays attempt history with scores
 * - Provides take quiz and review attempt actions
 * - Shows availability status and navigation
 *
 * This component focuses on displaying quiz information
 * and managing student interactions before taking quizzes.
 */

interface StudentQuizInfoProps {
  quiz: Quiz;
  existingAttempts: QuizAttempt[];
  onTakeQuiz: () => void;
  onReviewAttempt: (attempt: QuizAttempt) => void;
}

export default function StudentQuizInfo({
  quiz,
  existingAttempts,
  onTakeQuiz,
  onReviewAttempt,
}: StudentQuizInfoProps) {
  const { cid } = useParams();
  const navigate = useNavigate();

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
            <h5 className="card-title">Last Attempt</h5>
            <p className="text-muted mb-3">
              You can only review your most recent attempt to maintain quiz
              integrity.
            </p>
            {/* Only show the last attempt for review */}
            {(() => {
              const lastAttempt = existingAttempts[existingAttempts.length - 1];
              return (
                <div
                  key={lastAttempt._id || 'last'}
                  className="d-flex justify-content-between align-items-center p-2 border-bottom"
                >
                  <div>
                    <span className="fw-bold">
                      Attempt #{lastAttempt.attemptNumber}
                    </span>
                    <span className="text-muted ms-3">
                      {lastAttempt.submittedAt
                        ? new Date(lastAttempt.submittedAt).toLocaleString()
                        : 'Not submitted'}
                    </span>
                  </div>
                  <div>
                    <span className="me-3">
                      Score: {lastAttempt.score} / {lastAttempt.totalPoints}
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onReviewAttempt(lastAttempt)}
                    >
                      <FaEye className="me-1" />
                      Review
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Card.Body>
        </Card>
      )}

      <div className="text-center">
        {quiz.multipleAttempts &&
        existingAttempts.length < quiz.attemptsAllowed ? (
          <Button variant="primary" size="lg" onClick={onTakeQuiz}>
            <FaPlay className="me-2" />
            Take Quiz
          </Button>
        ) : !quiz.multipleAttempts && existingAttempts.length === 0 ? (
          <Button variant="primary" size="lg" onClick={onTakeQuiz}>
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

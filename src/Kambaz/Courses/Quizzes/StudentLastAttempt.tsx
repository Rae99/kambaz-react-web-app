import { useState, useEffect } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as quizzesClient from './client';
import type { Quiz, QuizAttempt } from './types';

interface StudentLastAttemptProps {
  quiz: Quiz;
}

export default function StudentLastAttempt({ quiz }: StudentLastAttemptProps) {
  const { cid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastAttempt = async () => {
      if (!currentUser?._id || !quiz._id) return;

      setLoading(true);
      setError(null);

      try {
        const attempts = await quizzesClient.getStudentAttempts(
          quiz._id,
          currentUser._id
        );
        if (attempts && attempts.length > 0) {
          // Get the last completed attempt
          const completedAttempts = attempts.filter(
            (attempt: QuizAttempt) => attempt.submittedAt
          );
          if (completedAttempts.length > 0) {
            setLastAttempt(completedAttempts[completedAttempts.length - 1]);
          }
        }
      } catch (err) {
        setError('Failed to load previous attempt');
        console.error('Error fetching last attempt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastAttempt();
  }, [quiz._id, currentUser?._id]);

  const handleViewAttempt = () => {
    if (lastAttempt?._id) {
      navigate(
        `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/review/${lastAttempt._id}`
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="warning">{error}</Alert>;
  }

  if (!lastAttempt) {
    return (
      <div className="text-muted">
        <p className="mb-0">No previous attempts found.</p>
      </div>
    );
  }

  const score = lastAttempt.score || 0;
  const totalPoints =
    quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
  const percentage =
    totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="mb-1">
            <strong>Score:</strong> {score} / {totalPoints} ({percentage}%)
          </p>
          <p className="mb-1 text-muted">
            <small>
              Taken on:{' '}
              {new Date(
                lastAttempt.submittedAt ||
                  lastAttempt.startedAt ||
                  lastAttempt.createdAt ||
                  Date.now()
              ).toLocaleDateString()}
            </small>
          </p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={handleViewAttempt}>
          <FaEye className="me-2" />
          View Attempt
        </Button>
      </div>

      <div className="text-muted">
        <p className="mb-0">
          Click "View Attempt" to see your answers and review the quiz.
        </p>
      </div>
    </div>
  );
}

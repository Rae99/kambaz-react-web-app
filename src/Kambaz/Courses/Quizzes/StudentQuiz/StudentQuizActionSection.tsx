import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { canStudentTakeQuiz } from '../services';
import type { Quiz } from '../types';

interface StudentQuizActionSectionProps {
  quiz: Quiz;
}

const StudentQuizActionSection = ({ quiz }: StudentQuizActionSectionProps) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();
  const { cid, qid } = useParams();
  const [canTake, setCanTake] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAttempts = async () => {
      if (currentUser?._id) {
        try {
          const result = await canStudentTakeQuiz(quiz, currentUser._id);
          setCanTake(result.canTake);
          setReason(result.reason || '');
        } catch (error) {
          console.error('Error checking attempts:', error);
          setCanTake(false);
          setReason('Unable to verify attempt limits');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAttempts();
  }, [quiz, currentUser?._id]);

  if (loading) {
    return (
      <div>
        <p className="text-muted mb-3">Checking quiz availability...</p>
        <Button variant="secondary" size="lg" disabled>
          Loading...
        </Button>
      </div>
    );
  }

  if (canTake) {
    return (
      <div>
        <p className="text-success mb-3">
          This quiz is currently available for you to take.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`)}
        >
          Start Quiz
        </Button>
        <div className="mt-3">
          <small className="text-muted">
            • You have{' '}
            {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'unlimited time'} to
            complete this quiz •{' '}
            {quiz.multipleAttempts
              ? 'Multiple attempts are allowed'
              : 'Only one attempt is allowed'}
            • Total points:{' '}
            {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
          </small>
        </div>
      </div>
    );
  }

  // Student cannot take the quiz
  return (
    <div>
      <p className="text-danger mb-3">
        {reason || 'This quiz is not available for you to take.'}
      </p>
      <Button variant="warning" size="lg" disabled title={reason}>
        {reason?.includes('exceeded')
          ? 'Max Attempts Reached'
          : reason?.includes('already taken')
          ? 'Already Taken'
          : 'Cannot Take Quiz'}
      </Button>
      <div className="mt-3">
        <small className="text-muted">
          • You have{' '}
          {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'unlimited time'} to
          complete this quiz •{' '}
          {quiz.multipleAttempts
            ? `Multiple attempts are allowed (max: ${quiz.attemptsAllowed})`
            : 'Only one attempt is allowed'}
          • Total points: {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
        </small>
      </div>
    </div>
  );
};

export default StudentQuizActionSection;

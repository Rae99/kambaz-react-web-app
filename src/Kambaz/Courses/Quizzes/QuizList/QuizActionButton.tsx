import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { Quiz } from '../types';
import { canStudentTakeQuiz } from '../services';

interface QuizActionButtonProps {
  quiz: Quiz;
}

export default function QuizActionButton({ quiz }: QuizActionButtonProps) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();
  const { cid } = useParams();
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
      }
    };

    checkAttempts();
  }, [quiz, currentUser?._id]);

  if (loading) {
    return (
      <button className="btn btn-secondary btn-sm" disabled>
        Checking...
      </button>
    );
  }

  if (canTake) {
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`);
        }}
      >
        Start Quiz
      </button>
    );
  }

  return (
    <button className="btn btn-warning btn-sm" disabled title={reason}>
      {reason?.includes('exceeded') ? 'Max Attempts Reached' : 'Already Taken'}
    </button>
  );
}

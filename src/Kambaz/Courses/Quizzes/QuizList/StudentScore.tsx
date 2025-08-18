import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { Quiz } from '../types';
import { getStudentQuizScore } from '../services';

/**
 * StudentScore Component
 *
 * Displays the current student's score for a specific quiz:
 * - Fetches student's quiz attempt score from backend
 * - Shows loading state while fetching
 * - Displays "N/A" if no score available
 * - Only renders for students and regular users
 *
 * This component provides personalized score information
 * for students viewing the quiz list.
 */

interface StudentScoreProps {
  quiz: Quiz;
}

export default function StudentScore({ quiz }: StudentScoreProps) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [score, setScore] = useState<string>('N/A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      if (
        (currentUser?._id && currentUser?.role === 'STUDENT') ||
        currentUser?.role === 'USER'
      ) {
        const result = await getStudentQuizScore(quiz._id!, currentUser._id);
        setScore(result.score);
        setLoading(result.loading);
      } else {
        setLoading(false);
      }
    };

    fetchScore();
  }, [quiz._id, currentUser?._id, currentUser?.role]);

  if (loading) {
    return <span className="fw-bold">Loading...</span>;
  }

  return <span className="fw-bold">Score: {score}</span>;
}

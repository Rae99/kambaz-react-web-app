import type { Quiz } from './types';
import * as quizzesClient from './client';
import {
  isQuizAvailableForStudent,
  getQuizAvailabilityReason,
  checkAttemptLimits,
  getCompletedAttempts,
} from './quiz-rules';

/**
 * SERVICE FUNCTIONS - Orchestration layer that combines API calls with business rules
 * These functions may perform I/O operations and coordinate multiple concerns
 */

/**
 * Check if student can take the quiz (considering both availability and attempt limits)
 * This is the main orchestration function that combines time-based availability with attempt limits
 */
export const canStudentTakeQuiz = async (
  quiz: Quiz,
  studentId: string
): Promise<{ canTake: boolean; reason?: string }> => {
  // First check basic time-based availability (pure function)
  if (!isQuizAvailableForStudent(quiz)) {
    return { canTake: false, reason: getQuizAvailabilityReason(quiz) };
  }

  // Check attempt limits (requires API call)
  try {
    const attempts = await quizzesClient.getStudentAttempts(
      quiz._id!,
      studentId
    );
    
    // Filter to only completed attempts (pure function)
    const completedAttempts = getCompletedAttempts(attempts);
    
    // Check attempt limits (pure function)
    return checkAttemptLimits(quiz, completedAttempts);
  } catch (error) {
    console.error('Error checking student attempts:', error);
    return { canTake: false, reason: 'Unable to verify attempt limits' };
  }
};

/**
 * Get student's latest score for a quiz
 */
export const getStudentQuizScore = async (
  quizId: string,
  studentId: string
): Promise<{ score: string; loading: boolean }> => {
  try {
    const attempts = await quizzesClient.getStudentAttempts(quizId, studentId);
    const completedAttempts = getCompletedAttempts(attempts);
    
    if (completedAttempts.length > 0) {
      // Get the last completed attempt
      const lastAttempt = completedAttempts
        .sort(
          (a, b) =>
            new Date(b.submittedAt!).getTime() -
            new Date(a.submittedAt!).getTime()
        )[0];

      return {
        score: `${lastAttempt.score}/${lastAttempt.totalPoints}`,
        loading: false,
      };
    }
    
    return { score: 'N/A', loading: false };
  } catch (error) {
    console.error('Error fetching score:', error);
    return { score: 'Error', loading: false };
  }
};

/**
 * Check if student has any attempts (completed or incomplete) for a quiz
 */
export const hasStudentAttempts = async (
  quizId: string,
  studentId: string
): Promise<boolean> => {
  try {
    const attempts = await quizzesClient.getStudentAttempts(quizId, studentId);
    return attempts.length > 0;
  } catch (error) {
    console.error('Error checking student attempts:', error);
    return false;
  }
};

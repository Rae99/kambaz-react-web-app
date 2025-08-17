import type { Quiz, QuizAttempt } from './types';

/**
 * PURE HELPER FUNCTIONS - No I/O operations
 * These functions only perform calculations and logic based on input parameters
 */

/**
 * Check if quiz is available for students to take (time-based availability)
 */
export const isQuizAvailableForStudent = (quiz: Quiz): boolean => {
  if (!quiz.isPublished) {
    return false;
  }

  const now = new Date();
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
  const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

  // Check if quiz is within its available time window
  if (availableDate && now < availableDate) {
    return false; // Not yet available
  }

  if (untilDate && now > untilDate) {
    return false; // Past the until date
  }

  if (dueDate && now > dueDate) {
    return false; // Past the due date
  }

  return true; // Quiz is available
};

/**
 * Get the reason why a quiz is not available
 */
export const getQuizAvailabilityReason = (quiz: Quiz): string => {
  if (!quiz.isPublished) {
    return 'Quiz not published';
  }

  const now = new Date();
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
  const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

  if (availableDate && now < availableDate) {
    return `Available from ${availableDate.toLocaleDateString()}`;
  }

  if (untilDate && now > untilDate) {
    return 'Quiz closed';
  }

  if (dueDate && now > dueDate) {
    return 'Due date passed';
  }

  return 'Quiz not available';
};

/**
 * Check attempt limits based on quiz settings and student's completed attempts
 */
export const checkAttemptLimits = (
  quiz: Quiz,
  completedAttempts: QuizAttempt[]
): { canTake: boolean; reason?: string } => {
  const existingAttemptsCount = completedAttempts.length;

  if (quiz.multipleAttempts && quiz.attemptsAllowed) {
    // Multiple attempts allowed - check against limit
    const currentAttemptNumber = existingAttemptsCount + 1;
    if (currentAttemptNumber > quiz.attemptsAllowed) {
      return {
        canTake: false,
        reason: `You have exceeded the maximum attempts (${quiz.attemptsAllowed}) for this quiz.`,
      };
    }
  } else {
    // Only one attempt allowed - check if student has already taken it
    if (existingAttemptsCount > 0) {
      return {
        canTake: false,
        reason: 'You have already taken this quiz. Only one attempt is allowed.',
      };
    }
  }

  return { canTake: true };
};

/**
 * Filter attempts to only include completed ones
 */
export const getCompletedAttempts = (attempts: QuizAttempt[]): QuizAttempt[] => {
  return attempts.filter((attempt) => attempt.isCompleted);
};

/**
 * Generate availability status text for quiz display
 */
export const getAvailabilityStatusText = (quiz: Quiz): string => {
  const now = new Date();
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
  const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;

  if (!availableDate) {
    return 'Not available';
  } else if (now < availableDate) {
    return `Not available until ${availableDate.toLocaleDateString()}`;
  } else if (dueDate && now > dueDate) {
    return 'Closed';
  } else {
    return 'Available';
  }
};

/**
 * Calculate total points for a quiz
 */
export const calculateQuizTotalPoints = (quiz: Quiz): number => {
  return quiz.questions.reduce((sum, q) => sum + q.points, 0);
};

/**
 * Get formatted due date display
 */
export const getFormattedDueDate = (quiz: Quiz): string => {
  const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;
  return dueDate ? dueDate.toLocaleDateString() : 'Not set';
};

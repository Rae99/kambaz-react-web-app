import { Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import type { Quiz, Question } from '../types';

/**
 * QuizPreviewResults Component
 *
 * Handles the quiz preview results display:
 * - Shows final score and percentage
 * - Displays question-by-question review
 * - Provides edit quiz button
 * - Shows correctness for each answer
 *
 * This component focuses on displaying the results
 * after faculty complete the quiz preview.
 */

interface QuizPreviewResultsProps {
  quiz: Quiz;
  quizAttempt: {
    answers: { [questionId: string]: string | string[] };
    score: number;
    totalPoints: number;
  };
  onEditQuiz: () => void;
}

export default function QuizPreviewResults({
  quiz,
  quizAttempt,
  onEditQuiz,
}: QuizPreviewResultsProps) {
  return (
    <div className="quiz-preview-results">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quiz Preview Results</h1>
        <Button variant="outline-primary" onClick={onEditQuiz}>
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
              {Math.round((quizAttempt.score / quizAttempt.totalPoints) * 100)}%
            </p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5 className="card-title">Question Review</h5>
          {quiz.questions.map((question: Question, index: number) => {
            const userAnswer = quizAttempt.answers[index];

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
                userAnswer.every((ans) => question.correctAnswer.includes(ans));
            } else {
              // For single-answer questions (true/false, single multiple-choice)
              isCorrect = userAnswer === question.correctAnswer;
            }

            return (
              <div key={index} className="mb-3 p-3 border rounded">
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
                    <p className="text-muted mb-1">Your answer: {userAnswer}</p>
                    <p className="text-muted mb-0">
                      Correct answer: {question.correctAnswer}
                    </p>
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div>
                    <p className="text-muted mb-1">Your answer: {userAnswer}</p>
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

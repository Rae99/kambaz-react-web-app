import { Card, Badge } from 'react-bootstrap';
import type { Quiz } from '../types';

interface QuizDetailsCardFacultyOnlyProps {
  quiz: Quiz;
}

/**
 * Faculty View - Quiz Details
 * Displays detailed quiz configuration settings for faculty members
 */
export default function QuizDetailsCardFacultyOnly({
  quiz,
}: QuizDetailsCardFacultyOnlyProps) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="card-title">Quiz Details</h5>
        <div className="mb-3">
          <p className="mb-2">
            <strong>Status:</strong>{' '}
            <Badge
              bg={quiz.isPublished ? 'success' : 'warning'}
              className="ms-2"
            >
              {quiz.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </p>
          <p className="text-muted mb-0">
            {quiz.isPublished
              ? 'This quiz is currently published and available to students.'
              : 'Click Publish to publish. Button becomes Unpublish to unpublish.'}
          </p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong>Shuffle Answers:</strong>{' '}
                {quiz.shuffleAnswers ? 'Yes' : 'No'}
              </li>
              <li className="mb-2">
                <strong>Allow Multiple Attempts:</strong>{' '}
                {quiz.multipleAttempts ? 'Yes' : 'No'}
              </li>
              <li className="mb-2">
                <strong>Show Correct Answers:</strong>{' '}
                {quiz.showCorrectAnswers || 'Never'}
              </li>
              <li className="mb-2">
                <strong>One Question at a Time:</strong>{' '}
                {quiz.oneQuestionAtATime ? 'Yes' : 'No'}
              </li>
              <li className="mb-2">
                <strong>Webcam Required:</strong>{' '}
                {quiz.webcamRequired ? 'Yes' : 'No'}
              </li>
              <li className="mb-2">
                <strong>Lock Questions After Answering:</strong>{' '}
                {quiz.lockQuestionsAfterAnswering ? 'Yes' : 'No'}
              </li>
            </ul>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">
              <strong>Quiz Type:</strong> {quiz.quizType || 'Graded Quiz'}
            </p>
            <p className="text-muted mb-1">
              <strong>Assignment Group:</strong>{' '}
              {quiz.assignmentGroup || 'Quizzes'}
            </p>
            <p className="text-muted mb-1">
              <strong>Time Limit:</strong>{' '}
              {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No limit'}
            </p>
            <p className="text-muted mb-1">
              <strong>Multiple Attempts:</strong>{' '}
              {quiz.multipleAttempts ? 'Yes' : 'No'}
            </p>
            {quiz.multipleAttempts && (
              <p className="mb-1">
                <strong>How Many Attempts:</strong> {quiz.attemptsAllowed || 1}
              </p>
            )}
            <p className="text-muted mb-1">
              <strong>Show Correct Answers:</strong>{' '}
              {quiz.showCorrectAnswers || 'Never'}
            </p>
            <p className="text-muted mb-0">
              <strong>Access Code:</strong> {quiz.accessCode || 'None'}
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

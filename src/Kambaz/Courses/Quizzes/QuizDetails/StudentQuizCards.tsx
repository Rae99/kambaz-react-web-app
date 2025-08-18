import { Card } from 'react-bootstrap';
import type { Quiz } from '../types';
import StudentQuizActionSection from '../StudentQuizActionSection';
import StudentLastAttempt from '../StudentLastAttempt';

interface StudentQuizCardsProps {
  quiz: Quiz;
}

/**
 * Student Quiz Cards
 * Contains both the "Take Quiz" and "Previous Attempt" cards for students
 */
export default function StudentQuizCards({ quiz }: StudentQuizCardsProps) {
  return (
    <>
      {/* Student View - Quiz Taking */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="card-title">Take Quiz</h5>
          <StudentQuizActionSection quiz={quiz} />
        </Card.Body>
      </Card>

      {/* Student View - View Last Attempt */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="card-title">Previous Attempt</h5>
          <StudentLastAttempt quiz={quiz} />
        </Card.Body>
      </Card>
    </>
  );
}

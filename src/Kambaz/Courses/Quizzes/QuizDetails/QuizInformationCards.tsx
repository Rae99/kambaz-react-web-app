import { Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaClock, FaQuestionCircle } from 'react-icons/fa';
import type { Quiz } from '../types';

interface QuizInformationCardsProps {
  quiz: Quiz;
  totalPoints: number;
}

/**
 * Quiz Information Cards
 * Displays key quiz statistics in card format (questions, points, time limit, type)
 */
export default function QuizInformationCards({
  quiz,
  totalPoints,
}: QuizInformationCardsProps) {
  return (
    <Row className="mb-4">
      <Col md={6} lg={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <FaQuestionCircle className="fs-1 text-primary mb-2" />
            <Card.Title className="h6">Questions</Card.Title>
            <Card.Text className="h4 mb-0">
              {quiz.questions?.length || 0}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <div className="fs-1 text-success mb-2">📊</div>
            <Card.Title className="h6">Total Points</Card.Title>
            <Card.Text className="h4 mb-0">{totalPoints}</Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <FaClock className="fs-1 text-warning mb-2" />
            <Card.Title className="h6">Time Limit</Card.Title>
            <Card.Text className="h4 mb-0">
              {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <FaUsers className="fs-1 text-info mb-2" />
            <Card.Title className="h6">Quiz Type</Card.Title>
            <Card.Text className="h6 mb-0">
              {quiz.quizType || 'Graded Quiz'}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

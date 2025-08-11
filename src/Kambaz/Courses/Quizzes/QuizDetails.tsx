import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Badge, Row, Col, Alert } from 'react-bootstrap';
import {
  FaEdit,
  FaTrash,
  FaCopy,
  FaEye,
  FaUsers,
  FaClock,
  FaQuestionCircle,
} from 'react-icons/fa';
import * as quizzesClient from './client';
import * as coursesClient from '../client';
import type { Quiz } from './types';

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is faculty (has elevated permissions)
  const isFaculty =
    currentUser?.role === 'FACULTY' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'TA';

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          setLoading(true);
          const quizData = await quizzesClient.findQuizById(qid);
          setQuiz(quizData);
        } catch (error) {
          console.error('Error fetching quiz:', error);
          setError('Failed to fetch quiz details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [qid]);

  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  const handleDeleteQuiz = async () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizzesClient.deleteQuiz(qid!);
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } catch (error) {
        console.error('Error deleting quiz:', error);
        setError('Failed to delete quiz');
      }
    }
  };

  const handleCopyQuiz = async () => {
    try {
      if (quiz) {
        const quizCopy = {
          ...quiz,
          title: `${quiz.title} (Copy)`,
          isPublished: false,
          _id: undefined,
          availableDate: quiz.availableDate
            ? new Date(quiz.availableDate).toISOString()
            : undefined,
          dueDate: quiz.dueDate
            ? new Date(quiz.dueDate).toISOString()
            : undefined,
          untilDate: quiz.untilDate
            ? new Date(quiz.untilDate).toISOString()
            : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await coursesClient.createQuizForCourse(cid!, quizCopy);
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
    } catch (error) {
      console.error('Error copying quiz:', error);
      setError('Failed to copy quiz');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!quiz) {
    return <Alert variant="warning">Quiz not found</Alert>;
  }

  const now = new Date();
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
  const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

  let availabilityStatus = '';
  let availabilityVariant = 'secondary';

  if (!availableDate) {
    availabilityStatus = 'Not available';
    availabilityVariant = 'secondary';
  } else if (now < availableDate) {
    availabilityStatus = `Not available until ${availableDate.toLocaleDateString()}`;
    availabilityVariant = 'warning';
  } else if (dueDate && now > dueDate) {
    availabilityStatus = 'Closed';
    availabilityVariant = 'danger';
  } else {
    availabilityStatus = 'Available';
    availabilityVariant = 'success';
  }

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="quiz-details">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="mb-2">{quiz.title}</h1>
          <p className="text-muted mb-0">{quiz.description}</p>
        </div>

        {isFaculty && (
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={handleEditQuiz}>
              <FaEdit className="me-2" />
              Edit Quiz
            </Button>
            <Button variant="outline-secondary" onClick={handleCopyQuiz}>
              <FaCopy className="me-2" />
              Copy
            </Button>
            <Button variant="outline-danger" onClick={handleDeleteQuiz}>
              <FaTrash className="me-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Quiz Information Cards */}
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

      {/* Availability Status */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="card-title">Availability</h5>
          <div className="d-flex align-items-center gap-3">
            <Badge bg={availabilityVariant} className="fs-6">
              {availabilityStatus}
            </Badge>
            {availableDate && (
              <span className="text-muted">
                Available from: {availableDate.toLocaleDateString()} at 12:00 AM
              </span>
            )}
            {dueDate && (
              <span className="text-muted">
                Due: {dueDate.toLocaleDateString()} at 11:59 PM
              </span>
            )}
            {untilDate && (
              <span className="text-muted">
                Until: {untilDate.toLocaleDateString()} at 11:59 PM
              </span>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Faculty View - Quiz Management */}
      {isFaculty && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">Quiz Management</h5>
            <div className="d-flex gap-2 mb-3">
              <Button
                variant={quiz.isPublished ? 'success' : 'warning'}
                size="sm"
              >
                {quiz.isPublished ? 'Published' : 'Draft'}
              </Button>
              <Button variant="outline-primary" size="sm">
                <FaEye className="me-1" />
                Preview
              </Button>
              <Button variant="outline-secondary" size="sm">
                <FaUsers className="me-1" />
                View Attempts
              </Button>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>Quiz Options</h6>
                <ul className="list-unstyled">
                  <li>
                    <input
                      type="checkbox"
                      checked={quiz.shuffleAnswers || false}
                      readOnly
                      className="me-2"
                    />
                    Shuffle Answers
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={quiz.multipleAttempts || false}
                      readOnly
                      className="me-2"
                    />
                    Allow Multiple Attempts
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={quiz.showCorrectAnswers === 'true' || false}
                      readOnly
                      className="me-2"
                    />
                    Show Correct Answers
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={quiz.oneQuestionAtATime || false}
                      readOnly
                      className="me-2"
                    />
                    One Question at a Time
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={quiz.webcamRequired || false}
                      readOnly
                      className="me-2"
                    />
                    Webcam Required
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={quiz.lockQuestionsAfterAnswering || false}
                      readOnly
                      className="me-2"
                    />
                    Lock Questions After Answering
                  </li>
                </ul>
              </div>

              <div className="col-md-6">
                <h6>Quiz Details</h6>
                <p className="text-muted mb-1">
                  Quiz Type: {quiz.quizType || 'Graded Quiz'}
                </p>
                <p className="text-muted mb-1">
                  Assignment Group: {quiz.assignmentGroup || 'Quizzes'}
                </p>
                <p className="text-muted mb-1">
                  Time Limit:{' '}
                  {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No limit'}
                </p>
                <p className="text-muted mb-1">
                  Multiple Attempts: {quiz.multipleAttempts ? 'Yes' : 'No'}
                </p>
                {quiz.multipleAttempts && (
                  <p className="text-muted mb-1">
                    Attempts Allowed: {quiz.attemptsAllowed || 1}
                  </p>
                )}
                <p className="text-muted mb-1">
                  Show Correct Answers: {quiz.showCorrectAnswers || 'Never'}
                </p>
                <p className="text-muted mb-0">
                  Access Code: {quiz.accessCode || 'None'}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Student View - Quiz Taking */}
      {!isFaculty && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">Take Quiz</h5>
            {availabilityStatus === 'Available' ? (
              <div>
                <p className="text-success mb-3">
                  This quiz is currently available for you to take.
                </p>
                <Button variant="primary" size="lg">
                  Start Quiz
                </Button>
                <div className="mt-3">
                  <small className="text-muted">
                    • You have{' '}
                    {quiz.timeLimit
                      ? `${quiz.timeLimit} minutes`
                      : 'unlimited time'}{' '}
                    to complete this quiz •{' '}
                    {quiz.multipleAttempts
                      ? 'Multiple attempts are allowed'
                      : 'Only one attempt is allowed'}
                    • Total points: {totalPoints}
                  </small>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-muted mb-3">
                  {availabilityStatus === 'Not available'
                    ? 'This quiz is not yet available for students.'
                    : availabilityStatus === 'Closed'
                    ? 'This quiz is no longer available.'
                    : 'This quiz will be available soon.'}
                </p>
                <Button variant="secondary" size="lg" disabled>
                  Quiz Not Available
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Questions Preview (Faculty only) */}
      {isFaculty && quiz.questions && quiz.questions.length > 0 && (
        <Card>
          <Card.Body>
            <h5 className="card-title">Questions Preview</h5>
            <p className="text-muted">
              This quiz contains {quiz.questions.length} question
              {quiz.questions.length !== 1 ? 's' : ''}
              worth {totalPoints} total point{totalPoints !== 1 ? 's' : ''}.
            </p>
            <Button variant="outline-primary" onClick={handleEditQuiz}>
              <FaEdit className="me-2" />
              Edit Questions
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

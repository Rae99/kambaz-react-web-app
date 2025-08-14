import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Badge, Row, Col, Alert } from 'react-bootstrap';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaUsers,
  FaClock,
  FaQuestionCircle,
} from 'react-icons/fa';
import * as quizzesClient from './client';
import type { Quiz } from './types';
import StudentQuizActionSection from './StudentQuizActionSection';
import StudentLastAttempt from './StudentLastAttempt';

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
        // Special case: if qid is 'new', redirect to editor
        if (qid === 'new') {
          navigate(`/Kambaz/Courses/${cid}/Quizzes/new/edit`);
          return;
        }

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
  }, [qid, cid, navigate]);

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

  const handleTogglePublish = async () => {
    try {
      if (quiz) {
        const updatedQuiz = { ...quiz, isPublished: !quiz.isPublished };
        await quizzesClient.updateQuiz(qid!, updatedQuiz);

        const freshQuiz = await quizzesClient.findQuizById(qid!);
        setQuiz(freshQuiz);
      }
    } catch (error) {
      console.error('Error toggling quiz publish status:', error);
      setError('Failed to update quiz publish status');
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

  // Use quiz.points directly - keep it simple
  const totalPoints = quiz.points || 0;

  // Debug logging for totalPoints calculation
  console.log('QuizDetails - totalPoints calculation:', {
    quizId: quiz._id,
    quizTitle: quiz.title,
    quizPoints: quiz.points,
    questionsCount: quiz.questions?.length,
    finalTotalPoints: totalPoints,
  });

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
            {untilDate && (
              <span className="text-muted">
                Until: {untilDate.toLocaleDateString()} at 11:59 PM
              </span>
            )}
            {dueDate && (
              <span className="text-muted">
                Due: {dueDate.toLocaleDateString()} at 11:59 PM
              </span>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Faculty View - Quiz Details */}
      {isFaculty && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">Quiz Details</h5>
            <div className="d-flex gap-2 mb-3">
              <Button
                variant={quiz.isPublished ? 'success' : 'warning'}
                size="sm"
                onClick={handleTogglePublish}
              >
                {quiz.isPublished ? 'Published' : 'Draft'}
                <span className="ms-1">{quiz.isPublished ? '✅' : '🚫'}</span>
              </Button>
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
                  <p className="text-muted mb-1">
                    <strong>How Many Attempts:</strong>{' '}
                    {quiz.attemptsAllowed || 1}
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
      )}

      {/* Student View - Quiz Taking */}
      {!isFaculty && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">Take Quiz</h5>
            <StudentQuizActionSection quiz={quiz} />
          </Card.Body>
        </Card>
      )}

      {/* Student View - View Last Attempt */}
      {!isFaculty && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">Previous Attempt</h5>
            <StudentLastAttempt quiz={quiz} />
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
              {quiz.questions.length !== 1 ? 's' : ''} worth {totalPoints} total
              point{totalPoints !== 1 ? 's' : ''}.
            </p>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={() =>
                  navigate(
                    `/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/questions`
                  )
                }
              >
                <FaEdit className="me-2" />
                Edit Questions
              </Button>
              <Button
                variant="outline-primary"
                onClick={() =>
                  navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`)
                }
              >
                <FaEye className="me-2" />
                Preview
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

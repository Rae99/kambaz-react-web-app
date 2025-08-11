import { ListGroup, Button, Badge } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import QuizHeader from './QuizHeader';
import type { Quiz } from './types';

interface StudentQuizzesProps {
  courseId: string;
  quizzes: Quiz[];
}

export default function StudentQuizzes({
  courseId,
  quizzes,
}: StudentQuizzesProps) {
  const publishedQuizzes = quizzes.filter((quiz) => quiz.isPublished);

  return (
    <div id="wd-quizzes">
      {/* Quiz Header */}
      <QuizHeader />

      {/* Quizzes List */}
      {publishedQuizzes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            No quizzes are currently available for this course.
          </p>
        </div>
      ) : (
        <ListGroup className="wd-quizzes rounded-0">
          {publishedQuizzes.map((quiz) => (
            <ListGroup.Item
              key={quiz._id}
              className="wd-quiz py-3 px-3"
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <FaRegEdit className="me-2 fs-3 text-success" />
                  <div className="ms-2 d-flex flex-column">
                    <span className="fw-bold fs-4 text-decoration-none text-dark">
                      {quiz.title}
                    </span>
                    <small className="text-muted fs-5">
                      <span className="text-danger">Multiple Modules </span> |{' '}
                      <span className="fw-bold">Not available until </span>{' '}
                      {quiz.availableDate
                        ? new Date(quiz.availableDate).toLocaleDateString()
                        : 'Not set'}{' '}
                      <span> at 12:00am | </span>
                      <span className="fw-bold">Due</span>{' '}
                      {quiz.dueDate
                        ? new Date(quiz.dueDate).toLocaleDateString()
                        : 'Not set'}{' '}
                      at 11:59pm |{' '}
                      {quiz.questions.reduce((sum, q) => sum + q.points, 0)} pts
                      | {quiz.questions?.length || 0} Questions
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {/* Quiz Status */}
                  <Badge bg="success" className="me-2">
                    ✅ Available
                  </Badge>

                  {/* Student Actions */}
                  <div className="d-flex gap-2">
                    <Button variant="primary" size="sm">
                      Start Quiz
                    </Button>
                    <Button variant="outline-info" size="sm">
                      View Previous Attempts
                    </Button>
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

import { ListGroup, Badge } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import QuizzesControlBar from './ControlBar';
import QuizHeader from './QuizHeader';
import QuizControlButtons from './QuizControlButtons';
import type { Quiz } from './types';

interface FacultyQuizzesProps {
  courseId: string;
  quizzes: Quiz[];
}

export default function FacultyQuizzes({
  courseId,
  quizzes,
}: FacultyQuizzesProps) {
  const handleDeleteQuiz = (quizId: string) => {
    console.log('Delete quiz:', quizId);
    // TODO: Implement delete functionality
  };

  const handlePublishQuiz = (quizId: string, isPublished: boolean) => {
    console.log('Publish/Unpublish quiz:', quizId, isPublished);
    // TODO: Implement publish functionality
  };

  return (
    <div id="wd-quizzes">
      {/* Control Bar */}
      <QuizzesControlBar />

      <hr />

      {/* Quiz Header */}
      <QuizHeader />

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No quizzes available yet.</p>
          <p className="text-muted">
            Click the "+ Quiz" button to create your first quiz.
          </p>
        </div>
      ) : (
        <ListGroup className="wd-quizzes rounded-0">
          {quizzes.map((quiz) => (
            <ListGroup.Item
              key={quiz._id}
              className="wd-quiz py-3 px-3"
              as={Link}
              to={`/Kambaz/Courses/${courseId}/Quizzes/${quiz._id}`}
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
                  {/* Publish/Unpublish Status */}
                  <Badge
                    bg={quiz.isPublished ? 'success' : 'secondary'}
                    className="me-2"
                  >
                    {quiz.isPublished ? '✅ Published' : '🚫 Unpublished'}
                  </Badge>

                  {/* Quiz Control Buttons */}
                  <QuizControlButtons
                    quizId={quiz._id!}
                    quizTitle={quiz.title}
                    isPublished={quiz.isPublished}
                    onDelete={handleDeleteQuiz}
                    onPublish={handlePublishQuiz}
                  />
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

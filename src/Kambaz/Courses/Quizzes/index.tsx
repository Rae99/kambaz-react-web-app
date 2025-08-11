import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, Badge, Button, Dropdown } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { FaRegEdit, FaTrash, FaEye, FaCopy, FaSort } from 'react-icons/fa';
import {
  setQuizzes,
  setLoading,
  setError,
  deleteQuiz,
  updateQuiz,
} from './reducer';
import * as quizzesClient from './client';
import type { Quiz } from './types';
import QuizzesControls from './ControlBar';

export default function Quizzes() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { quizzes, loading } = useSelector(
    (state: any) => state.quizzesReducer
  );

  // Check if user is faculty (has elevated permissions)
  const isFaculty =
    currentUser?.role === 'FACULTY' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'TA';

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (cid) {
        try {
          dispatch(setLoading(true));
          const courseQuizzes = await quizzesClient.findQuizzesByCourse(cid);
          dispatch(setQuizzes(courseQuizzes || []));
        } catch (error) {
          console.error('Error fetching quizzes:', error);
          dispatch(setError('Failed to fetch quizzes'));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchQuizzes();
  }, [cid, dispatch]);

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await quizzesClient.deleteQuiz(quizId);
      dispatch(deleteQuiz(quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handlePublishQuiz = async (quizId: string, isPublished: boolean) => {
    try {
      const quiz = quizzes.find((q: Quiz) => q._id === quizId);
      if (quiz) {
        const updatedQuiz = { ...quiz, isPublished: !isPublished };
        await quizzesClient.updateQuiz(quizId, updatedQuiz);
        dispatch(updateQuiz(updatedQuiz));
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
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

  if (!currentUser) {
    return (
      <div className="alert alert-warning">
        Please sign in to access quizzes.
      </div>
    );
  }

  const courseQuizzes = quizzes.filter((quiz: Quiz) => quiz.courseId === cid);

  return (
    <div id="wd-quizzes">
      {/* Control Bar - only for faculty */}
      {isFaculty && <QuizzesControls />}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <span className="fw-bold fs-5">Assignment Quizzes</span>
        </div>
      </div>
      <hr className="mb-3" />

      {/* Quizzes List */}
      <ListGroup className="wd-quizzes rounded-0">
        {courseQuizzes.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              {isFaculty
                ? "No quizzes available yet. Click the '+ Quiz' button to create your first quiz."
                : 'No quizzes are currently available for this course.'}
            </p>
          </div>
        ) : (
          courseQuizzes.map((quiz: Quiz) => (
            <ListGroup.Item
              key={quiz._id}
              className="wd-quiz py-3 px-3"
              as={isFaculty ? Link : 'div'}
              {...(isFaculty
                ? { to: `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}` }
                : {})}
              style={{ cursor: isFaculty ? 'pointer' : 'not-allowed' }}
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

                  {/* Role-specific Actions */}
                  {isFaculty ? (
                    <div className="d-flex gap-1">
                      <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}>
                        <Button variant="outline-primary" size="sm">
                          <FaRegEdit className="me-1" />
                          Edit
                        </Button>
                      </Link>

                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <FaEye className="me-1" />
                          Preview
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              handlePublishQuiz(quiz._id!, quiz.isPublished)
                            }
                          >
                            {quiz.isPublished ? 'Unpublish' : 'Publish'}
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <FaCopy className="me-2" />
                            Copy
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <FaSort className="me-2" />
                            Sort
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz._id!)}
                      >
                        <FaTrash className="me-1" />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm">
                        Start Quiz
                      </button>
                      <button className="btn btn-outline-info btn-sm">
                        View Previous Attempts
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
}

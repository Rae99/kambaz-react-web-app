import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import { FaRegEdit, FaCopy, FaTrash } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
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
import * as coursesClient from '../client';

// Check if quiz is available for students to take
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

// Get the reason why a quiz is not available
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

export default function Quizzes() {
  const { cid } = useParams();
  const navigate = useNavigate();
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

  // Filter quizzes based on user role
  const getFilteredQuizzes = (allQuizzes: Quiz[]) => {
    if (isFaculty) {
      // Faculty can see all quizzes
      return allQuizzes.filter((quiz: Quiz) => quiz.courseId === cid);
    } else {
      // Students can only see published quizzes
      return allQuizzes.filter(
        (quiz: Quiz) => quiz.courseId === cid && quiz.isPublished
      );
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (cid) {
        try {
          dispatch(setLoading(true));
          const courseQuizzes = await coursesClient.findQuizzesForCourse(cid);
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

  // TODO: delete log once bug fixed
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

  const handleCopyQuiz = async (quizId: string) => {
    try {
      const quiz = quizzes.find((q: Quiz) => q._id === quizId);
      if (quiz) {
        // Create a copy with a new title
        const quizCopy = {
          ...quiz,
          title: `${quiz.title} (Copy)`,
          isPublished: false, // Always unpublished when copied
          _id: undefined, // Remove ID so it creates a new quiz
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const newQuiz = await coursesClient.createQuizForCourse(cid!, quizCopy);
        dispatch(setQuizzes([...quizzes, newQuiz]));
      }
    } catch (error) {
      console.error('Error copying quiz:', error);
    }
  };

  // All hooks must be called before condition return
  const [sortBy, setSortBy] = useState<'name' | 'dueDate' | 'availableDate'>(
    'name'
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Menu management functions
  const toggleMenu = (quizId: string) => {
    setOpenMenuId(openMenuId === quizId ? null : quizId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeMenu();
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // Helper function to render availability information
  const renderAvailabilityInfo = (quiz: Quiz, isFaculty: boolean) => {
    const now = new Date();
    const availableDate = quiz.availableDate
      ? new Date(quiz.availableDate)
      : null;
    const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;

    let availabilityStatus = '';
    if (!availableDate) {
      availabilityStatus = 'Not available';
    } else if (now < availableDate) {
      availabilityStatus = `Not available until ${availableDate.toLocaleDateString()} at 12:00am`;
    } else if (dueDate && now > dueDate) {
      availabilityStatus = 'Closed';
    } else {
      availabilityStatus = 'Available';
    }

    return (
      <>
        <span className="fw-bold">{availabilityStatus}</span> |{' '}
        <span className="fw-bold">Due</span>{' '}
        {dueDate ? dueDate.toLocaleDateString() : 'Not set'} at 11:59pm |{' '}
        {quiz.questions.reduce((sum, q) => sum + q.points, 0)} pts |{' '}
        {quiz.questions?.length || 0} Questions
        {!isFaculty && (
          <>
            {' '}
            | <span className="fw-bold">Score: N/A</span>
          </>
        )}
      </>
    );
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

  const courseQuizzes = getFilteredQuizzes(quizzes || []);

  const sortedQuizzes = [...courseQuizzes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'dueDate':
        const aDue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bDue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return aDue - bDue;
      case 'availableDate':
        const aAvail = a.availableDate
          ? new Date(a.availableDate).getTime()
          : 0;
        const bAvail = b.availableDate
          ? new Date(b.availableDate).getTime()
          : 0;
        return aAvail - bAvail;
      default:
        return 0;
    }
  });

  return (
    <div id="wd-quizzes">
      {/* Control Bar - only for faculty */}
      {isFaculty && <QuizzesControls />}

      <hr className="mb-3" />
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-3"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <div className="d-flex align-items-center">
          <span className="fw-bold fs-4">Assignment Quizzes</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'name' | 'dueDate' | 'availableDate')
            }
            style={{ width: 'auto' }}
          >
            <option value="name">Sort by Name</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="availableDate">Sort by Available Date</option>
          </select>
        </div>
      </div>

      {/* Quizzes List */}
      <ListGroup className="wd-quizzes rounded-0">
        {sortedQuizzes.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              {isFaculty
                ? "No quizzes available yet. Click the '+ Quiz' button to create your first quiz."
                : 'No quizzes are currently available for this course.'}
            </p>
          </div>
        ) : (
          sortedQuizzes.map((quiz: Quiz) => (
            <ListGroup.Item
              key={quiz._id}
              className="wd-quiz py-3 px-3"
              as={Link}
              to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="d-flex align-items-center"
                  style={{ flex: 1, minWidth: 0 }}
                >
                  {/* Rocket icon instead of grip */}
                  <span className="me-3 fs-4">🚀</span>

                  <div
                    className="d-flex flex-column"
                    style={{ minWidth: 0, flex: 1 }}
                  >
                    <span className="fw-bold fs-4 text-decoration-none text-dark">
                      {quiz.title}
                    </span>

                    {/* Availability and details - single line with overflow handling */}
                    <div
                      className="text-muted fs-6"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {renderAvailabilityInfo(quiz, isFaculty)}
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex align-items-center gap-2"
                  style={{ flexShrink: 0 }}
                >
                  {/* Publish/Unpublish Status - only show for faculty */}
                  {isFaculty && (
                    <span
                      className="me-2 fs-4"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePublishQuiz(quiz._id!, quiz.isPublished);
                      }}
                    >
                      {quiz.isPublished ? '✅' : '🚫'}
                    </span>
                  )}

                  {/* Role-specific Actions */}
                  {isFaculty ? (
                    <div className="d-flex gap-1 position-relative">
                      {/* Context Menu Button */}
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleMenu(quiz._id!);
                        }}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {/* Custom Context Menu */}
                      {openMenuId === quiz._id && (
                        <div
                          className="position-absolute top-100 end-0 mt-1 bg-white border rounded shadow-lg"
                          style={{ zIndex: 1000 }}
                        >
                          <div className="p-2">
                            <button
                              className="btn btn-link text-decoration-none p-2 w-100 text-start"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                closeMenu();
                                navigate(
                                  `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`
                                );
                              }}
                            >
                              <FaRegEdit className="me-2" />
                              Edit
                            </button>
                            <button
                              className="btn btn-link text-decoration-none p-2 w-100 text-start text-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                closeMenu();
                                handleDeleteQuiz(quiz._id!);
                              }}
                            >
                              <FaTrash className="me-2" />
                              Delete
                            </button>
                            <button
                              className="btn btn-link text-decoration-none p-2 w-100 text-start"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                closeMenu();
                                handlePublishQuiz(quiz._id!, quiz.isPublished);
                              }}
                            >
                              {quiz.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              className="btn btn-link text-decoration-none p-2 w-100 text-start"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                closeMenu();
                                handleCopyQuiz(quiz._id!);
                              }}
                            >
                              <FaCopy className="me-2" />
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      {isQuizAvailableForStudent(quiz) ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(
                              `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`
                            );
                          }}
                        >
                          Start Quiz
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled
                          title={getQuizAvailabilityReason(quiz)}
                        >
                          Quiz Not Available
                        </button>
                      )}
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

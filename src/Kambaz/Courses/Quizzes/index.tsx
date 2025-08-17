import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import { FaRegEdit, FaCopy, FaTrash} from 'react-icons/fa';
import { FaCheckCircle, FaBan } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
// import { CheckCircle, SlashCircle } from 'react-bootstrap-icons';
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
import {
  isQuizAvailableForStudent,
  getQuizAvailabilityReason,
  getAvailabilityStatusText,
  getFormattedDueDate,
  calculateQuizTotalPoints,
} from './quiz-rules';
import { canStudentTakeQuiz, getStudentQuizScore } from './services';

export default function Quizzes() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { quizzes, loading } = useSelector(
    (state: any) => state.quizzesReducer
  );

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');

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
    const availabilityStatus = getAvailabilityStatusText(quiz);
    const formattedDueDate = getFormattedDueDate(quiz);
    const totalPoints = calculateQuizTotalPoints(quiz);

    return (
      <>
        <span className="fw-bold">{availabilityStatus}</span> |{' '}
        <span className="fw-bold">Due</span> {formattedDueDate} at 11:59pm |{' '}
        {totalPoints} pts | {quiz.questions?.length || 0} Questions
        {!isFaculty && (
          <>
            {' '}
            | <StudentScore quiz={quiz} />
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

  // quizzes from Redux store are already filtered by course ID from the API call
  const courseQuizzes = quizzes || [];

  // Filter by search term
  const searchedCourseQuizzes = courseQuizzes.filter(
    (quiz: Quiz) =>
      searchTerm.trim() === '' ||
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description &&
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedQuizzes = [...searchedCourseQuizzes].sort((a, b) => {
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
      {/* Control Bar - add button only for faculty, search functionality for both faculty and student */}

      <QuizzesControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isFaculty={isFaculty}
      />

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
        {courseQuizzes.length === 0 ? (
          // No quizzes exist for this course at all
          <div className="text-center py-5">
            <p className="text-muted">
              {isFaculty
                ? "No quizzes available yet. Click the '+ Quiz' button to create your first quiz."
                : 'No quizzes are currently available for this course.'}
            </p>
          </div>
        ) : sortedQuizzes.length === 0 ? (
          // Quizzes exist but search filtered them out
          <div className="text-center py-5">
            <p className="text-muted">
              No quizzes match your search keyword "{searchTerm}". Try a
              different search term.
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
                  <span className="me-3 fs-3">🚀</span>

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
                      {quiz.isPublished ? (
                        <FaCheckCircle color="green" size={26} />
                      ) : (
                        <FaBan color="red" size={26} />
                      )}
                    </span>
                  )}
                  {/* 🔍 What Each Method Does
                  e.preventDefault()
                  Purpose: Prevents the browser's default behavior for that event
                  In this context: Prevents the <Link> component from navigating when you click the publish button
                  Without it: Clicking the publish button would also trigger the Link navigation to the quiz details page
                  e.stopPropagation()
                  Purpose: Prevents the event from bubbling up to parent elements
                  In this context: Stops the click event from reaching the parent <ListGroup.Item as={Link}>
                  Without it: The click would bubble up and trigger the Link navigation */}

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
                        <QuizActionButton quiz={quiz} />
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled
                          title={getQuizAvailabilityReason(quiz)}
                        >
                          Quiz Not Available
                        </button>
                      )}
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

// Component to handle quiz action buttons with attempt limit checking
const QuizActionButton = ({ quiz }: { quiz: Quiz }) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();
  const { cid } = useParams();
  const [canTake, setCanTake] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAttempts = async () => {
      if (currentUser?._id) {
        try {
          const result = await canStudentTakeQuiz(quiz, currentUser._id);
          setCanTake(result.canTake);
          setReason(result.reason || '');
        } catch (error) {
          console.error('Error checking attempts:', error);
          setCanTake(false);
          setReason('Unable to verify attempt limits');
        } finally {
          setLoading(false);
        }
      }
    };

    checkAttempts();
  }, [quiz, currentUser?._id]);

  if (loading) {
    return (
      <button className="btn btn-secondary btn-sm" disabled>
        Checking...
      </button>
    );
  }

  if (canTake) {
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`);
        }}
      >
        Start Quiz
      </button>
    );
  }

  return (
    <button className="btn btn-warning btn-sm" disabled title={reason}>
      {reason?.includes('exceeded') ? 'Max Attempts Reached' : 'Already Taken'}
    </button>
  );
};

// Component to display student's score for a quiz
const StudentScore = ({ quiz }: { quiz: Quiz }) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [score, setScore] = useState<string>('N/A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      if (
        (currentUser?._id && currentUser?.role === 'STUDENT') ||
        currentUser?.role === 'USER'
      ) {
        const result = await getStudentQuizScore(quiz._id!, currentUser._id);
        setScore(result.score);
        setLoading(result.loading);
      } else {
        setLoading(false);
      }
    };

    fetchScore();
  }, [quiz._id, currentUser?._id, currentUser?.role]);

  if (loading) {
    return <span className="fw-bold">Loading...</span>;
  }

  return <span className="fw-bold">Score: {score}</span>;
};

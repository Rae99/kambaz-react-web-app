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

// Check if student can take the quiz (considering attempt limits)
export const canStudentTakeQuiz = async (
  quiz: Quiz,
  studentId: string
): Promise<{ canTake: boolean; reason?: string }> => {
  // First check basic availability
  if (!isQuizAvailableForStudent(quiz)) {
    return { canTake: false, reason: getQuizAvailabilityReason(quiz) };
  }

  // Check attempt limits
  try {
    const attempts = await quizzesClient.getStudentAttempts(
      quiz._id!,
      studentId
    );
    const existingAttempts = attempts.filter(
      (attempt: any) => attempt.isCompleted
    );

    if (quiz.multipleAttempts && quiz.attemptsAllowed) {
      // Multiple attempts allowed - check against limit
      const currentAttemptNumber = existingAttempts.length + 1;
      if (currentAttemptNumber > quiz.attemptsAllowed) {
        return {
          canTake: false,
          reason: `You have exceeded the maximum attempts (${quiz.attemptsAllowed}) for this quiz.`,
        };
      }
    } else {
      // Only one attempt allowed - check if student has already taken it
      if (existingAttempts.length > 0) {
        return {
          canTake: false,
          reason:
            'You have already taken this quiz. Only one attempt is allowed.',
        };
      }
    }
  } catch (error) {
    console.error('Error checking student attempts:', error);
    return { canTake: false, reason: 'Unable to verify attempt limits' };
  }

  return { canTake: true };
};

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

  const courseQuizzes = (quizzes || [])
    .filter((quiz: Quiz) => quiz.courseId === cid)
    .filter((quiz: Quiz) =>
      searchTerm.trim() === '' ||
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
      {isFaculty && (
        <QuizzesControls 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

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
        try {
          const attempts = await quizzesClient.getStudentAttempts(
            quiz._id!,
            currentUser._id
          );
          if (attempts.length > 0) {
            // Get the last completed attempt
            const lastAttempt = attempts
              .filter((attempt: any) => attempt.isCompleted)
              .sort(
                (a: any, b: any) =>
                  new Date(b.submittedAt).getTime() -
                  new Date(a.submittedAt).getTime()
              )[0];

            if (lastAttempt) {
              setScore(`${lastAttempt.score}/${lastAttempt.totalPoints}`);
            }
          }
        } catch (error) {
          console.error('Error fetching score:', error);
          setScore('Error');
        } finally {
          setLoading(false);
        }
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

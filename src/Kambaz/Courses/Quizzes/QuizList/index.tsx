import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import {
  setQuizzes,
  setLoading,
  setError,
  deleteQuiz,
  updateQuiz,
} from '../reducer';
import * as quizzesClient from '../client';
import * as coursesClient from '../../client';
import type { Quiz } from '../types';
import {
  getAvailabilityStatusText,
  getFormattedDueDate,
  calculateQuizTotalPoints,
} from '../quiz-rules';
import ControlBar from './ControlBar';
import QuizListItem from './QuizListItem';
import CopyQuizModal from './CopyQuizModal';
import StudentScore from './StudentScore';

/**
 * QuizList Main Component
 *
 * This is the main orchestrator component that manages the quiz list display and functionality.
 * It coordinates all quiz-related operations including:
 *
 * Core Responsibilities:
 * - Fetches and displays quizzes for a specific course
 * - Manages quiz CRUD operations (create, read, update, delete)
 * - Handles quiz publishing/unpublishing
 * - Provides search and sorting functionality
 * - Manages quiz duplication and copying between courses
 * - Coordinates with sub-components for UI rendering
 *
 * State Management:
 * - Quiz data fetching and Redux state management
 * - Search and filtering state
 * - Copy modal state and course selection
 * - Context menu state for quiz actions
 * - Sorting preferences
 *
 * The component uses several helper functions from quiz-rules.ts for consistent
 * quiz information display and calculation.
 */
export default function QuizList() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { quizzes, loading } = useSelector(
    (state: any) => state.quizzesReducer
  );

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // Copy modal state
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedQuizToCopy, setSelectedQuizToCopy] = useState<Quiz | null>(
    null
  );
  const [targetCourseId, setTargetCourseId] = useState('');
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [copyLoading, setCopyLoading] = useState(false);

  // Menu state
  const [sortBy, setSortBy] = useState<'name' | 'dueDate' | 'availableDate'>(
    'name'
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Check if user is faculty
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

  // Fetch available courses for faculty to copy quizzes to
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      if (isFaculty) {
        try {
          const courses = await coursesClient.fetchAllCourses();
          // Filter out the current course
          const otherCourses = courses.filter(
            (course: any) => course._id !== cid
          );
          setAvailableCourses(otherCourses);
        } catch (error) {
          console.error('Error fetching available courses:', error);
        }
      }
    };

    fetchAvailableCourses();
  }, [isFaculty, cid]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  /**
   * Quiz Action Handlers
   * These functions handle all quiz-related operations including CRUD operations,
   * publishing, duplication, and course copying.
   */

  /**
   * Deletes a quiz from the course and updates Redux state
   * @param quizId - The ID of the quiz to delete
   */
  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await quizzesClient.deleteQuiz(quizId);
      dispatch(deleteQuiz(quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  /**
   * Toggles the published state of a quiz (published/unpublished)
   * @param quizId - The ID of the quiz to toggle
   * @param isPublished - Current published state
   */
  const handlePublishToggle = async (quizId: string, isPublished: boolean) => {
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

  /**
   * Navigates to the quiz editor for the specified quiz
   * @param quizId - The ID of the quiz to edit
   */
  const handleEdit = (quizId: string) => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
  };

  /**
   * Creates a duplicate of a quiz within the same course
   * @param quizId - The ID of the quiz to duplicate
   */
  const handleDuplicate = async (quizId: string) => {
    try {
      const quiz = quizzes.find((q: Quiz) => q._id === quizId);
      if (quiz) {
        const quizCopy = {
          ...quiz,
          title: `${quiz.title} (Copy)`,
          isPublished: false,
          _id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newQuiz = await coursesClient.createQuizForCourse(cid!, quizCopy);
        dispatch(setQuizzes([...quizzes, newQuiz]));
      }
    } catch (error) {
      console.error('Error duplicating quiz:', error);
    }
  };

  /**
   * Initiates the process of copying a quiz to another course
   * @param quizId - The ID of the quiz to copy
   */
  const handleCopyToCourse = async (quizId: string) => {
    const quiz = quizzes.find((q: Quiz) => q._id === quizId);
    if (quiz && isFaculty) {
      setSelectedQuizToCopy(quiz);
      setShowCopyModal(true);
    }
  };

  /**
   * Executes the quiz copy operation to the selected target course
   * Creates a new quiz with modified metadata and saves it to the target course
   */
  const handleConfirmCopy = async () => {
    if (!selectedQuizToCopy || !targetCourseId) return;

    try {
      setCopyLoading(true);

      const quizCopy = {
        ...selectedQuizToCopy,
        title: `${selectedQuizToCopy.title} (Copy)`,
        isPublished: false,
        _id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseId: targetCourseId,
      };

      await coursesClient.createQuizForCourse(targetCourseId, quizCopy);

      setShowCopyModal(false);
      setSelectedQuizToCopy(null);
      setTargetCourseId('');

      alert(
        `Quiz "${selectedQuizToCopy.title}" copied successfully to the selected course!`
      );
    } catch (error) {
      console.error('Error copying quiz:', error);
      alert('Failed to copy quiz. Please try again.');
    } finally {
      setCopyLoading(false);
    }
  };

  const handleCancelCopy = () => {
    setShowCopyModal(false);
    setSelectedQuizToCopy(null);
    setTargetCourseId('');
  };

  /**
   * Helper function to render consistent availability information for each quiz
   * Uses helper functions from quiz-rules.ts for standardized formatting
   * @param quiz - The quiz object to render info for
   * @param isFaculty - Whether the current user is faculty
   * @returns JSX element with formatted availability information
   */
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

  /**
   * Data Processing and Filtering
   * Applies search filtering and sorting to the quiz list
   */
  const courseQuizzes = quizzes || [];
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
      <ControlBar
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
          <div className="text-center py-5">
            <p className="text-muted">
              {isFaculty
                ? "No quizzes available yet. Click the '+ Quiz' button to create your first quiz."
                : 'No quizzes are currently available for this course.'}
            </p>
          </div>
        ) : sortedQuizzes.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              No quizzes match your search keyword "{searchTerm}". Try a
              different search term.
            </p>
          </div>
        ) : (
          sortedQuizzes.map((quiz: Quiz) => (
            <QuizListItem
              key={quiz._id}
              quiz={quiz}
              isFaculty={isFaculty}
              openMenuId={openMenuId}
              onToggleMenu={setOpenMenuId}
              onCloseMenu={() => setOpenMenuId(null)}
              onPublishToggle={handlePublishToggle}
              onEdit={handleEdit}
              onDelete={handleDeleteQuiz}
              onDuplicate={handleDuplicate}
              onCopyToCourse={handleCopyToCourse}
              renderAvailabilityInfo={renderAvailabilityInfo}
            />
          ))
        )}
      </ListGroup>

      {/* Copy Quiz Modal - Only render for faculty */}
      {isFaculty && (
        <CopyQuizModal
          show={showCopyModal}
          quiz={selectedQuizToCopy}
          availableCourses={availableCourses}
          targetCourseId={targetCourseId}
          copyLoading={copyLoading}
          onHide={handleCancelCopy}
          onCourseChange={setTargetCourseId}
          onConfirm={handleConfirmCopy}
        />
      )}
    </div>
  );
}

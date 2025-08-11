import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setQuizzes, setLoading, setError } from './reducer';
import * as quizzesClient from './client';
import FacultyQuizzes from './FacultyQuizzes';
import StudentQuizzes from './StudentQuizzes';

export default function Quizzes() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { quizzes, loading } = useSelector(
    (state: any) => state.quizzesReducer
  );
  const [isFaculty, setIsFaculty] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Map existing roles to quiz interface types
      // Faculty interface: FACULTY, ADMIN, TA (elevated permissions)
      // Student interface: STUDENT, USER (regular user permissions)
      const facultyRoles = ['FACULTY', 'ADMIN', 'TA'];
      setIsFaculty(facultyRoles.includes(currentUser.role));
    }
  }, [currentUser]);

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

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Course Quizzes</h2>

      {isFaculty ? (
        <FacultyQuizzes courseId={cid!} quizzes={quizzes} />
      ) : (
        <StudentQuizzes courseId={cid!} quizzes={quizzes} />
      )}
    </div>
  );
}

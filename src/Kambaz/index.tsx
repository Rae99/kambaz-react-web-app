import { Routes, Route, Navigate } from 'react-router';
import Account from './Account';
import Dashboard from './Dashboard';
import KambazNavigation from './Navigation';
import Courses from './Courses';
import './styles.css';
import ProtectedRoute from './Account/ProtectedRoute';
import ProtectedCourseRoute from './Courses/ProtectedCourseRoute';
import Session from './Account/Session';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as userClient from './Account/client';
import * as courseClient from './Courses/client';
import * as enrollmentsClient from './Courses/Enrollments/client';
import { setAllCourses, setEnrolledCourses } from './Courses/reducer';
import { setEnrollments } from './Courses/enrollmentsReducer';

export default function Kambaz() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    // Fetch all courses for "All Courses" tab
    async function fetchAllCourses() {
      try {
        console.log('Fetching all courses...');
        const courses = await courseClient.fetchAllCourses();
        console.log('All courses fetched:', courses);
        dispatch(setAllCourses(courses));
      } catch (err) {
        console.error('Failed to fetch all courses', err);
      }
    }

    // Fetch only enrolled courses for current user
    async function fetchEnrolledCourses() {
      if (currentUser) {
        try {
          console.log('Fetching enrolled courses for user:', currentUser._id);
          const courses = await userClient.findMyCourses();
          console.log('Enrolled courses fetched:', courses);
          dispatch(setEnrolledCourses(courses));
        } catch (err) {
          console.error('Failed to fetch enrolled courses', err);
        }
      } else {
        console.log('No currentUser, clearing enrolled courses');
        dispatch(setEnrolledCourses([]));
      }
    }

    // Fetch enrollments for current user
    async function fetchEnrollments() {
      if (currentUser) {
        try {
          console.log('Fetching enrollments for user:', currentUser._id);
          const userEnrollments =
            await enrollmentsClient.findEnrollmentsForUser(currentUser._id);
          console.log('Enrollments fetched:', userEnrollments);
          dispatch(setEnrollments(userEnrollments));
        } catch (err) {
          console.error('Failed to fetch enrollments', err);
        }
      } else {
        console.log('No currentUser, clearing enrollments');
        dispatch(setEnrollments([]));
      }
    }

    fetchAllCourses();
    fetchEnrolledCourses();
    fetchEnrollments();
  }, [currentUser, dispatch]);

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="/Kambaz/Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <ProtectedCourseRoute>
                    <Courses />
                  </ProtectedCourseRoute>
                </ProtectedRoute>
              }
            />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}

/* p-3 is padding 3 units, which is 1.5rem 
adds padding: 1rem on all four sides of that <div> to give breathing room around your content.*/

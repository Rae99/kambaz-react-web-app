import { useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedCourseRouteProps {
  children: ReactNode;
}

export default function ProtectedCourseRoute({
  children,
}: ProtectedCourseRouteProps) {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  // If data is still loading (user exists but enrollments not loaded yet), don't redirect
  if (currentUser && enrollments.length === 0) {
    return <div>Loading course access...</div>;
  }

  // Check if user is enrolled in this course
  const isEnrolled = enrollments.some(
    (enrollment: any) =>
      enrollment.user === currentUser._id && enrollment.course === cid
  );

  // If not enrolled, redirect to Dashboard
  if (!isEnrolled) {
    return <Navigate to="/Kambaz/Dashboard" replace />;
  }

  // If enrolled, render the children (course content)
  return <>{children}</>;
}

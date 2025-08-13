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

// New component to protect faculty-only routes
export function FacultyProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Check if user is faculty (has elevated permissions)
  const isFaculty =
    currentUser?.role === 'FACULTY' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'TA';

  if (!isFaculty) {
    return <Navigate to="/Kambaz/Dashboard" replace />;
  }

  return <>{children}</>;
}

// New component to protect student-only routes
export function StudentProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Check if user is a student
  const isStudent = currentUser?.role === 'STUDENT';

  if (!isStudent) {
    return <Navigate to="/Kambaz/Dashboard" replace />;
  }

  return <>{children}</>;
}

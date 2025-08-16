import Modules from './Modules';
import Home from './Home';
import Assignments from './Assignments';
import AssignmentEditor from './Assignments/Editor';
import CourseNavigation from './Navigation';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FaAlignJustify } from 'react-icons/fa6';
import People from './People';
import Piazza from './Piazza';
import Zoom from './Zoom';
import Quizzes from './Quizzes';
import QuizEditor from './Quizzes/Editor';
import QuizDetails from './Quizzes/QuizDetails';
import QuizPreview from './Quizzes/QuizPreview';
import StudentQuiz from './Quizzes/StudentQuiz';
import Grades from './Grades';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import {
  FacultyProtectedRoute,
  StudentProtectedRoute,
} from './ProtectedCourseRoute';

export default function Courses() {
  const { allCourses } = useSelector((state: any) => state.courseReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const course = allCourses.find((course: any) => course._id === cid);
  const { pathname } = useLocation();

  return (
    <div id="wd-courses">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-danger mb-0">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course && course.name} &gt; {pathname.split('/')[4]}
          {pathname.split('/')[5] && ` > ${pathname.split('/')[5]}`}
          {/* if pathname = "/Kambaz/Courses/1234/Quizzes/new"
pathname.split("/")  // result:
["", "Kambaz", "Courses", "1234", "Quizzes", "new"] */}
        </h2>
        {pathname.includes(`/Courses/${cid}`) && (
          <button className="btn btn-outline-secondary btn-sm">
            <i className="fas fa-user me-2"></i>
            {currentUser?.role === 'FACULTY' ||
            currentUser?.role === 'ADMIN' ||
            currentUser?.role === 'TA'
              ? 'Faculty View'
              : 'Student View'}
          </button>
        )}
      </div>
      <hr />
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="People" element={<People />} />
            <Route path="/Piazza" element={<Piazza />} />
            <Route path="Zoom" element={<Zoom />} />
            <Route path="Quizzes" element={<Quizzes />} />
            <Route
              path="Quizzes/*"
              element={
                <Routes>
                  <Route
                    path=":qid/edit/*"
                    element={
                      <FacultyProtectedRoute>
                        <QuizEditor />
                      </FacultyProtectedRoute>
                    }
                  />
                  <Route
                    path=":qid/preview"
                    element={
                      <FacultyProtectedRoute>
                        <QuizPreview />
                      </FacultyProtectedRoute>
                    }
                  />
                  <Route
                    path=":qid/take"
                    element={
                      <StudentProtectedRoute>
                        <StudentQuiz mode="take" />
                      </StudentProtectedRoute>
                    }
                  />
                  <Route
                    path=":qid/review/:attemptId"
                    element={
                      <StudentProtectedRoute>
                        <StudentQuiz mode="review" />
                      </StudentProtectedRoute>
                    }
                  />
                  <Route path=":qid" element={<QuizDetails />} />
                </Routes>
              }
            />
            <Route path="Grades" element={<Grades />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

/* 2️⃣ Why mb-1 for aligning icons with text?
	•	Icons often sit slightly below text baseline because their bounding box includes whitespace.
	•	mb-1 pulls the icon up by adding bottom margin, visually aligning it with the heading’s baseline.
	•	Using mb-0 might leave it slightly too low, while mb-2 (8px) might pull it too high or create too much spacing below.

In practice, mb-1 is a safe, visually balanced default for aligning icons inline with headings or text.*/

/* d-flex - makes the container a flexbox so that children can be aligned horizontally.
   d-none d-md-block - hides the first child on screens smaller than medium (≥768px).

   flex-fill - 	•	It allows whichever element has flex-fill inside a d-flex container to expand and take up remaining horizontal space.
   
	•	If multiple children use flex-fill, they will share the remaining space equally.
   me-4 - adds a right margin to the first child for spacing.
   */

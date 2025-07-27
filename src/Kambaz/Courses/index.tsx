import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import CourseNavigation from "./Navigation";
import { Routes, Route, Navigate } from "react-router-dom";
import { FaAlignJustify } from "react-icons/fa6";
import PeopleTable from "./People/Table";
import Piazza from "./Piazza";
import Zoom from "./Zoom";
import Quizzes from "./Quizzes";
import Grades from "./Grades";

import { useParams, useLocation } from "react-router-dom";

export default function Courses({ courses }: { courses: any[] }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
        {/* if pathname = "/Kambaz/Courses/1234/Assignments"
pathname.split("/")  // result:
["", "Kambaz", "Courses", "1234", "Assignments"] */}
      </h2>
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
            <Route path="People" element={<PeopleTable />} />
            <Route path="/Piazza" element={<Piazza />} />
            <Route path="Zoom" element={<Zoom />} />
            <Route path="Quizzes" element={<Quizzes />} />
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

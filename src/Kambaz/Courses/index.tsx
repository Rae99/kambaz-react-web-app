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

export default function Courses() {
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        Course 1234{" "}
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

/*
2️⃣ <FaAlignJustify />
	•	An icon component imported from react-icons/fa.
	•	Displays a justify-align icon.

3️⃣ className="me-4 fs-4 mb-1"

Applied to the icon:
	•	me-4: (margin-end 4)
	•	Adds right margin for spacing from following text.
	•	fs-4: (font-size 4)
	•	Sets larger icon size.
	•	mb-1: (margin-bottom 1)
	•	Adds a small bottom margin to align better with the baseline of adjacent text.
*/

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

import { ListGroup } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { useParams } from "react-router";
import * as db from "../../Database";

export default function Modules() {
  const { cid } = useParams();
  const modules = db.modules;
  // ✅ const modules = db.modules; is a normal variable assignment

  // This line is just saying:
  // From the db object (imported as * as db), get the property modules, and assign it to a new constant called modules.
  // It’s not a destructuring assignment, and it doesn’t need {}.
  return (
    <div>
      <ModulesControls />
      <br />
      <br />
      <br />
      <br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
              {/* p-0 removes padding, mb-5 adds bottom margin*/}
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" /> {module.name}
                <ModuleControlButtons />
              </div>
              {module.lessons && ( // This checks if module.lessons exists
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}
                      <LessonControlButtons />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
}

// Instead of using any, you could define what a Module and a Lesson look like:

// interface Lesson {
//   name: string;
// }

// interface Module {
//   course: string;
//   name: string;
//   lessons?: Lesson[];
// }

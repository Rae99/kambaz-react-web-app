import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div className="d-flex" id="wd-home">
      <div className="flex-fill me-3">
        <Modules />
      </div>
      <div className="d-none d-xl-block">
        <CourseStatus />
      </div>
    </div>
  );
}

/* d-flex - makes the container a flexbox so that children can be aligned horizontally.
    flex-fill - allows the first child to take up all available space.
    me-3 - adds a right margin to the first child for spacing.
    d-none d-xl-block - hides the second child on screens smaller than extra large (≥1200px).
  */

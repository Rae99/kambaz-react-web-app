import AssignmentsControls from "./ControlBar";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import Header from "./Header";
import { FaRegEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
// import { useParams as useReactRouterParams } from "react-router-dom";

export default function Assignments() {
  // const { AssignmentId } = useParams();

  return (
    <div id="wd-assignments">
      <AssignmentsControls />
      <br />
      <br />
      <br />
      <br />

      <Header />

      <ListGroup
        className="wd-assignments rounded-0 flex"
        id="wd-assignments-list"
      >
        <ListGroup.Item className="wd-assignment py-3 px-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <FaRegEdit className="me-2 fs-3 text-success" />
              <div className="ms-2 d-flex flex-column">
                <Link
                  to="/Kambaz/Courses/1234/Assignments/A1"
                  className="fw-bold fs-4 text-decoration-none text-dark"
                >
                  A1
                </Link>
                <small className="text-muted fs-5">
                  <span className="text-danger">Multiple Modules </span> |{" "}
                  <span className="fw-bold">Not available until </span>May 6 at
                  12:00am | <span className="fw-bold">Due</span> May 13 at
                  11:59pm | 100 pts
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success fs-4 me-3" />
              <BsThreeDotsVertical className="fs-4 text-muted" />
            </div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item className="wd-assignment py-3 px-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <FaRegEdit className="me-2 fs-3 text-success" />
              <div className="ms-2 d-flex flex-column">
                <Link
                  to="/Kambaz/Courses/1234/Assignments/A2"
                  className="fw-bold fs-4 text-decoration-none text-dark"
                >
                  A2
                </Link>
                <small className="text-muted fs-5">
                  <span className="text-danger">Multiple Modules </span> |{" "}
                  <span className="fw-bold">Not available until </span>May 16 at
                  12:00am | <span className="fw-bold">Due</span> May 23 at
                  11:59pm | 100 pts
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success fs-4 me-3" />
              <BsThreeDotsVertical className="fs-4 text-muted" />
            </div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item className="wd-assignment py-3 px-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <FaRegEdit className="me-2 fs-3 text-success" />
              <div className="ms-2 d-flex flex-column">
                <Link
                  to="/Kambaz/Courses/1234/Assignments/A2"
                  className="fw-bold fs-4 text-decoration-none text-dark"
                >
                  A3
                </Link>
                <small className="text-muted fs-5">
                  <span className="text-danger">Multiple Modules </span> |{" "}
                  <span className="fw-bold">Not available until </span>May 26 at
                  12:00am | <span className="fw-bold">Due</span> June 3 at
                  11:59pm | 100 pts
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success fs-4 me-3" />
              <BsThreeDotsVertical className="fs-4 text-muted" />
            </div>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

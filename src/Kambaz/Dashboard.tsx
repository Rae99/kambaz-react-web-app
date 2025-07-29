import { Link } from "react-router-dom";
import { Col, FormControl, Row } from "react-bootstrap";
import { Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addCourse, deleteCourse, updateCourse } from "./Courses/reducer";
import { enrollInCourse, unenrollFromCourse } from "./Courses/enrollmentsReducer";


export default function Dashboard() {
  const dispatch = useDispatch();
  const { courses } = useSelector((state: any) => state.courseReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  
  // Local state for editing course and enrollment view
  const [editingCourse, setEditingCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });
  const [showAllCourses, setShowAllCourses] = useState(false);

  const handleAddCourse = () => {
    const newCourse = { ...editingCourse, _id: new Date().getTime().toString() };
    dispatch(addCourse(newCourse));
    // Reset form
    setEditingCourse({
      _id: "0",
      name: "New Course",
      number: "New Number",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      image: "/images/reactjs.jpg",
      description: "New Description",
    });
  };

  const handleUpdateCourse = () => {
    dispatch(updateCourse(editingCourse));
  };

  const handleDeleteCourse = (courseId: string) => {
    dispatch(deleteCourse(courseId));
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
  };

  const handleEnroll = (courseId: string) => {
    dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
  };

  const handleUnenroll = (courseId: string) => {
    dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
  };

  const isEnrolledInCourse = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };

  // Filter courses based on enrollment status and view mode
  const getFilteredCourses = () => {
    if (showAllCourses) {
      return courses;
    } else {
      return courses.filter((course: any) => isEnrolledInCourse(course._id));
    }
  };

  const filteredCourses = getFilteredCourses();

  console.log("currentUser", currentUser);
  console.log("role", currentUser?.role);
  // @ts-ignore
  window.testStore = useSelector((state) => state);
  
  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowAllCourses(!showAllCourses)}
          className="me-3"
        >
          {showAllCourses ? "My Enrollments" : "All Courses"}
        </Button>
      </div>
      <hr />
      
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={handleAddCourse}
            >
              {" "}
              Add{" "}
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={handleUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={editingCourse.name}
            className="mb-2"
            onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={editingCourse.description}
            rows={3}
            onChange={(e) =>
              setEditingCourse({ ...editingCourse, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      
      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "My Enrolled Courses"} ({filteredCourses.length})
      </h2>
      <hr />
      
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course: any) => {
            const isEnrolled = isEnrolledInCourse(course._id);
            return (
              <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    to={`/Kambaz/Courses/${course._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <Card.Img
                      src="/images/reactjs.jpg"
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <Card.Body className="card-body">
                      <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}{" "}
                      </Card.Title>
                      <Card.Text
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}{" "}
                      </Card.Text>
                      <Button variant="primary"> Go </Button>
                      
                      {isFaculty && (
                        <>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              handleDeleteCourse(course._id);
                            }}
                            className="btn btn-danger float-end"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </button>
                          <button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              handleEditCourse(course);
                            }}
                            className="btn btn-warning me-2 float-end"
                          >
                            Edit
                          </button>
                        </>
                      )}
                      
                      {!isFaculty && (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            if (isEnrolled) {
                              handleUnenroll(course._id);
                            } else {
                              handleEnroll(course._id);
                            }
                          }}
                          className={`btn float-end me-2 ${
                            isEnrolled ? "btn-danger" : "btn-success"
                          }`}
                        >
                          {isEnrolled ? "Unenroll" : "Enroll"}
                        </button>
                      )}
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

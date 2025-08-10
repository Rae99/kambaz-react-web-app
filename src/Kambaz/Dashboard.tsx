import { Link } from 'react-router-dom';
import { Col, FormControl, Row } from 'react-bootstrap';
import { Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  addCourse,
  deleteCourse,
  updateCourse,
  setEnrolledCourses,
} from './Courses/reducer';

import {
  enrollInCourse,
  unenrollFromCourse,
} from './Courses/enrollmentsReducer';

import * as userClient from './Account/client';
import * as courseClient from './Courses/client';
import * as enrollmentsClient from './Courses/Enrollments/client';

export default function Dashboard() {
  const dispatch = useDispatch();
  // Redux state
  const { allCourses, enrolledCourses } = useSelector(
    (state: any) => state.courseReducer
  );
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === 'FACULTY';

  // Local UI state for editing course
  const [editingCourse, setEditingCourse] = useState<any>({
    _id: '0',
    name: 'New Course',
    number: 'New Number',
    startDate: '2023-09-10',
    endDate: '2023-12-15',
    image: '/images/reactjs.jpg',
    description: 'New Description',
  });

  const [showAllCourses, setShowAllCourses] = useState(false);

  const handleAddCourse = async () => {
    try {
      const newCourse = await courseClient.createCourse(editingCourse);
      dispatch(addCourse(newCourse));
      setEditingCourse({
        _id: '0',
        name: 'New Course',
        number: 'New Number',
        startDate: '2023-09-10',
        endDate: '2023-12-15',
        image: '/images/reactjs.jpg',
        description: 'New Description',
      });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleUpdateCourse = async () => {
    try {
      const updatedCourse = await courseClient.updateCourse(editingCourse);
      dispatch(updateCourse(updatedCourse));
      setEditingCourse({
        _id: '0',
        name: 'New Course',
        number: 'New Number',
        startDate: '2023-09-10',
        endDate: '2023-12-15',
        image: '/images/reactjs.jpg',
        description: 'New Description',
      });
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      dispatch(deleteCourse(courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
  };

  // Server-integrated enroll/unenroll functions
  const handleEnroll = async (courseId: string) => {
    try {
      console.log('Enrolling user:', currentUser._id, 'in course:', courseId);
      const result = await userClient.enrollUserInCourse(
        currentUser._id,
        courseId
      );
      console.log('Enrollment API response:', result);

      dispatch(enrollInCourse({ userId: currentUser._id, courseId }));

      // Refresh enrolled courses from server
      const updatedEnrolledCourses = await userClient.findMyCourses();
      console.log('Updated enrolled courses:', updatedEnrolledCourses);
      dispatch(setEnrolledCourses(updatedEnrolledCourses));
      console.log('Enrollment successful');
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      console.log(
        'Unenrolling user:',
        currentUser._id,
        'from course:',
        courseId
      );
      const result = await userClient.unenrollUserFromCourse(
        currentUser._id,
        courseId
      );
      console.log('Unenrollment API response:', result);

      dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));

      // Refresh enrolled courses from server
      const updatedEnrolledCourses = await userClient.findMyCourses();
      console.log(
        'Updated enrolled courses after unenroll:',
        updatedEnrolledCourses
      );
      dispatch(setEnrolledCourses(updatedEnrolledCourses));
      console.log('Unenrollment successful');
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    }
  };

  // Choose which courses to show based on UI toggle
  const courseList = showAllCourses ? allCourses : enrolledCourses;

  // Check if user is enrolled in a course
  const isEnrolledInCourse = (courseId: string) => {
    return enrolledCourses.some((course: any) => course._id === courseId);
  };

  // Debug logging
  console.log('Dashboard - showAllCourses:', showAllCourses);
  console.log('Dashboard - allCourses:', allCourses);
  console.log('Dashboard - enrolledCourses:', enrolledCourses);
  console.log('Dashboard - courseList:', courseList);

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <Button
          variant="primary"
          onClick={() => setShowAllCourses(!showAllCourses)}
          className="me-3"
        >
          {showAllCourses ? 'My Enrollments' : 'All Courses'}
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
              Add
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
            onChange={(e) =>
              setEditingCourse({ ...editingCourse, name: e.target.value })
            }
          />
          <FormControl
            as="textarea"
            value={editingCourse.description}
            rows={3}
            onChange={(e) =>
              setEditingCourse({
                ...editingCourse,
                description: e.target.value,
              })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAllCourses ? 'All Courses' : 'My Enrolled Courses'} (
        {courseList.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courseList.map((course: any) => {
            const isEnrolled = isEnrolledInCourse(course._id);
            console.log('Course', course._id, 'isEnrolled:', isEnrolled);
            return (
              <Col
                key={course._id}
                className="wd-dashboard-course"
                style={{ width: '300px' }}
              >
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
                        {course.name}{' '}
                      </Card.Title>
                      <Card.Text
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: '100px' }}
                      >
                        {course.description}{' '}
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
                            isEnrolled ? 'btn-danger' : 'btn-success'
                          }`}
                        >
                          {isEnrolled ? 'Unenroll' : 'Enroll'}
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

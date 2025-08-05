import AssignmentsControls from './ControlBar';
import { ListGroup } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import Header from './Header';
import { FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setAssignments, deleteAssignment } from './reducer';
import * as coursesClient from '../client';
import * as assignmentsClient from './client';
import AssignmentControlButtons from './AssignmentControlButtons';

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  // destructure the assignments from the state
  // const assignments = state.assignmentsReducer.assignments;
  // the assignments is an array in the initial state of the reducer

  const dispatch = useDispatch();
  const courseAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === 'FACULTY';

  const removeAssignment = async (assignmentId: string) => {
    await assignmentsClient.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };

  const fetchAssignments = async () => {
    const assignments = await coursesClient.findAssignmentsForCourse(
      cid as string
    );
    dispatch(setAssignments(assignments));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDeleteAssignment = (assignmentId: string) => {
    removeAssignment(assignmentId);
  };

  // call deleteAssignment("abc123") will return a Redux action object
  // {
  //   type: "assignments/deleteAssignment",  // sliceName/reducerName
  //   payload: "abc123"                      // the assignmentId we pass in
  // }

  // dispatch sends the action object to the Redux store
  // the Redux store will then call the reducer function with the action object
  // the reducer function will then update the state with the new assignments
  // the new assignments will be reflected in the UI

  return (
    <div id="wd-assignments">
      {isFaculty && <AssignmentsControls />}

      <Header />

      <ListGroup
        className="wd-assignments rounded-0 flex"
        id="wd-assignments-list"
      >
        {courseAssignments.map((assignment: any) => (
          <ListGroup.Item
            key={assignment._id}
            className="wd-assignment py-3 px-3"
            as={isFaculty ? Link : 'div'}
            {...(isFaculty
              ? { to: `/Kambaz/Courses/${cid}/Assignments/${assignment._id}` }
              : {})}
            style={{ cursor: isFaculty ? 'pointer' : 'not-allowed' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <FaRegEdit className="me-2 fs-3 text-success" />
                <div className="ms-2 d-flex flex-column">
                  <span className="fw-bold fs-4 text-decoration-none text-dark">
                    {assignment.title}
                  </span>
                  <small className="text-muted fs-5">
                    <span className="text-danger">Multiple Modules </span> |{' '}
                    <span className="fw-bold">Not available until </span>{' '}
                    {assignment.availableDate} <span> at 12:00am | </span>
                    <span className="fw-bold">Due</span> {assignment.dueDate} at
                    11:59pm | {assignment.points} pts
                  </small>
                </div>
              </div>
              {isFaculty && (
                <AssignmentControlButtons
                  assignmentId={assignment._id}
                  assignmentTitle={assignment.title}
                  deleteAssignment={handleDeleteAssignment}
                />
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

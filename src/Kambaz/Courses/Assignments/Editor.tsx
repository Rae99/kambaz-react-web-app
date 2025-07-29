import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addAssignment, updateAssignment } from "./reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const isNewAssignment = aid === "new";
  
  const assignment = isNewAssignment 
    ? null 
    : assignments.find((a: any) => a._id === aid);

  // Navigate back to Assignments if the assignment doesn't exist (was deleted)
  useEffect(() => {
    if (!isNewAssignment && !assignment) {
      console.log("Assignment not found, navigating back to Assignments");
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
      return; // Exit early to prevent rendering the form
    }
  }, [assignment, isNewAssignment, cid, navigate]);

  // State for form fields
  const [title, setTitle] = useState(assignment?.title || "New Assignment");
  const [description, setDescription] = useState(
    assignment?.description || "The assignment is available online. Submit a link to the landing page of your project."
  );
  const [points, setPoints] = useState(assignment?.points || 100);
  const [dueDate, setDueDate] = useState(assignment?.dueDate || "");
  const [availableDate, setAvailableDate] = useState(assignment?.availableDate || "");
  const [availableUntil, setAvailableUntil] = useState(assignment?.availableUntil || "");
  const [submissionType, setSubmissionType] = useState("Online");

  // Update form when assignment changes
  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setPoints(assignment.points);
      setDueDate(assignment.dueDate);
      setAvailableDate(assignment.availableDate);
      setAvailableUntil(assignment.availableUntil);
    }
  }, [assignment]);

  const handleSave = () => {
    const assignmentData = {
      title,
      description,
      points: parseInt(points),
      dueDate,
      availableDate,
      availableUntil,
      course: cid,
    };

    if (isNewAssignment) {
      dispatch(addAssignment(assignmentData));
    } else {
      dispatch(updateAssignment({ ...assignmentData, _id: aid }));
    }
    
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    console.log("Cancel button clicked, navigating to Assignments list");
    // Try both methods to ensure navigation works
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
    // Fallback: force navigation if navigate doesn't work
    setTimeout(() => {
      window.location.href = `/Kambaz/Courses/${cid}/Assignments`;
    }, 100);
  };

  // Don't render the form if assignment doesn't exist (was deleted)
  if (!isNewAssignment && !assignment) {
    return null;
  }

  return (
    <div id="wd-assignments-editor" className="container">
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <input
          id="wd-name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Description
        </label>
        <textarea 
          id="wd-description" 
          rows={4} 
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-3 text-end">
          <label htmlFor="wd-points" className="form-label">
            Points
          </label>
        </div>
        <div className="col-md-9">
          <input
            id="wd-points"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="form-control"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3 text-end">
          <label htmlFor="wd-group" className="form-label">
            Assignment Group
          </label>
        </div>
        <div className="col-md-9">
          <select id="wd-group" className="form-select">
            <option>ASSIGNMENTS</option>
            <option>QUIZZES</option>
            <option>EXAMS</option>
            <option>PROJECT</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3 text-end">
          <label htmlFor="wd-display-grade-as" className="form-label">
            Display Grade as
          </label>
        </div>
        <div className="col-md-9">
          <select id="wd-display-grade-as" className="form-select">
            <option>Percentage</option>
            <option>Points</option>
            <option>Letter Grade</option>
            <option>Complete/Incomplete</option>
            <option>Not Graded</option>
            <option>Not Counted</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3 text-end">
          <label htmlFor="wd-submission-type" className="form-label">
            Submission Type
          </label>
        </div>

        <div className="col-md-9">
          <div className="p-3 border rounded">
            <select 
              id="wd-submission-type" 
              className="form-select mb-2"
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
            >
              <option>Online</option>
              <option>On Paper</option>
            </select>

            {submissionType === "Online" && (
              <>
                <div className="mb-2">
                  <strong>Online Entry Options</strong>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="wd-text-entry"
                  />
                  <label className="form-check-label" htmlFor="wd-text-entry">
                    Text Entry
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="wd-website-url"
                  />
                  <label className="form-check-label" htmlFor="wd-website-url">
                    Website URL
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="wd-media-recordings"
                  />
                  <label className="form-check-label" htmlFor="wd-media-recordings">
                    Media Recordings
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="wd-student-annotation"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="wd-student-annotation"
                  >
                    Student Annotation
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="wd-file-upload"
                  />
                  <label className="form-check-label" htmlFor="wd-file-upload">
                    File Upload
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3 text-end">
          <label className="form-label">Assign</label>
        </div>
        <div className="col-md-9">
          <div className="p-3 border rounded">
            <div className="mb-3">
              <label htmlFor="wd-assign-to" className="form-label fw-bold">
                Assign to
              </label>
              <select id="wd-assign-to" className="form-select">
                <option>Everyone</option>
                <option>Section 1</option>
                ...
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="wd-due-date" className="form-label fw-bold">
                Due
              </label>
              <input
                type="date"
                id="wd-due-date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="row">
              <div className="col">
                <label
                  htmlFor="wd-available-from"
                  className="form-label fw-bold"
                >
                  Available from
                </label>
                <input
                  type="date"
                  id="wd-available-from"
                  className="form-control"
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                />
              </div>
              <div className="col">
                <label
                  htmlFor="wd-available-until"
                  className="form-label fw-bold"
                >
                  Until
                </label>
                <input
                  type="date"
                  id="wd-available-until"
                  className="form-control"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="text-end">
        <button 
          className="btn btn-secondary me-2" 
          id="wd-cancel-assignment"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          className="btn btn-danger" 
          id="wd-save-assignment"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

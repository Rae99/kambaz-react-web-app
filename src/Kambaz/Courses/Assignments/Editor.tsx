export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="container">
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <input id="wd-name" value="A1 - ENV + HTML" className="form-control" />
      </div>

      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Description
        </label>
        <textarea id="wd-description" rows={4} className="form-control">
          The assignment is available online Submit a link to the landing page
          of
        </textarea>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="wd-points" className="form-label">
            Points
          </label>
        </div>
        <div className="col-md-9">
          <input id="wd-points" value={100} className="form-control" />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
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
        <div className="col-md-3">
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
        <div className="col-md-3">
          <label htmlFor="wd-submission-type" className="form-label">
            Submission Type
          </label>
        </div>
        <div className="col-md-9">
          <select id="wd-submission-type" className="form-select mb-2">
            <option>Online</option>
            <option>On Paper</option>
          </select>

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
            <label className="form-check-label" htmlFor="wd-student-annotation">
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
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="wd-assign-to" className="form-label">
            Assign to
          </label>
        </div>
        <div className="col-md-9">
          <select id="wd-assign-to" className="form-select mb-2">
            <option>Everyone</option>
            <option>Section 1</option>
            <option>Section 2</option>
            <option>Section 3</option>
          </select>

          <label htmlFor="wd-due-date" className="form-label">
            Due
          </label>
          <input
            type="date"
            id="wd-due-date"
            className="form-control mb-2"
            defaultValue="2024-05-13"
          />

          <div className="row">
            <div className="col">
              <label htmlFor="wd-available-from" className="form-label">
                Available From
              </label>
              <input
                type="date"
                id="wd-available-from"
                className="form-control"
                defaultValue="2024-05-06"
              />
            </div>
            <div className="col">
              <label htmlFor="wd-available-until" className="form-label">
                Until
              </label>
              <input
                type="date"
                id="wd-available-until"
                className="form-control"
                defaultValue="2024-05-20"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="text-end">
        <button className="btn btn-secondary me-2" id="wd-cancel-assignment">
          Cancel
        </button>
        <button className="btn btn-danger" id="wd-save-assignment">
          Save
        </button>
      </div>
    </div>
  );
}

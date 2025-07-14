export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" value="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description" rows={4} cols={50}>
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>

          <td>
            <input id="wd-points" value={100} />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group">
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
              <option>EXAMS</option>
              <option>PROJECT</option>
            </select>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
            <select id="wd-display-grade-as">
              <option>Percentage</option>
              <option>Points</option>
              <option>Letter Grade</option>
              <option>Complete/Incomplete</option>
              <option>Not Graded</option>
              <option>Not Counted</option>
            </select>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-submission-type">
              <option>Online</option>
              <option>On Paper</option>
            </select>

            <div>
              Online Entry options <br />
              <input type="checkbox" name="online-entry" id="wd-text-entry" />
              <label htmlFor="wd-text-entry">Text Entry</label>
            </div>
            <div>
              <input type="checkbox" name="online-entry" id="wd-website-url" />
              <label htmlFor="wd-website-url">Website URL</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="online-entry"
                id="wd-media-recordings"
              />
              <label htmlFor="wd-media-recordings">Media Recordings</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="online-entry"
                id="wd-student-annotation"
              />
              <label htmlFor="wd-student-annotation">Student Annotation</label>
            </div>
            <div>
              <input type="checkbox" name="online-entry" id="wd-file-upload" />
              <label htmlFor="wd-file-upload">File Upload</label>
            </div>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assign-to">Assign</label>
          </td>
          <td>
            <table>
              <tr>
                <label htmlFor="wd-assign-to">Assign to</label>
              </tr>
              <tr />
              <select id="wd-assign-to">
                <option>Everyone</option>
                <option>Section 1</option>
                <option>Section 2</option>
                <option>Section 3</option>
              </select>
              <tr>
                <label htmlFor="wd-due-date·">Due</label>
              </tr>
              <tr>
                <input type="datetime-local" id="wd-due-date" />
              </tr>
              <tr>
                <table>
                  <tr>
                    <td valign="top">
                      <label htmlFor="wd-available-from">Available From</label>
                    </td>
                    <td valign="top">
                      <label htmlFor="wd-available-until">Until</label>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input type="datetime-local" id="wd-available-from" />
                    </td>

                    <td>
                      <input type="datetime-local" id="wd-available-until" />
                    </td>
                  </tr>
                </table>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <hr />
      <div style={{ textAlign: "right" }}>
        <button id="wd-cancel-assignment">Cancel</button>{" "}
        <button id="wd-save-assignment">Save</button>
      </div>
    </div>
  );
}

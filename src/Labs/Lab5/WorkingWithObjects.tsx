import { useState } from 'react';
import { FormControl, FormCheck } from 'react-bootstrap';
const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: 'NodeJS Assignment',
    description: 'Create a NodeJS server with ExpressJS',
    due: '2021-10-10',
    completed: false,
    score: 0,
  });

  const moduleData = {
    id: '1',
    name: 'Module 1',
    description: 'Module 1 Description',
    course: 'NodeJS',
  };

  const [module, setModule] = useState(moduleData);

  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  // In the UI, create a link labeled Get Module that retrieves the module object from the server mapped at /lab5/module

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      <div className="row">
        <div className="col-md-6">
          <h4>Retrieving Objects</h4>
          <a
            id="wd-retrieve-assignments"
            className="col btn btn-primary"
            href={`${HTTP_SERVER}/lab5/assignment`}
          >
            Get Assignment
          </a>
          <hr />
          <h4>Retrieving Properties</h4>
          <a
            id="wd-retrieve-assignment-title"
            className="col btn btn-primary"
            href={`${HTTP_SERVER}/lab5/assignment/title`}
          >
            Get Title
          </a>
          <hr />
          <h4>Modifying Properties</h4>

          <div className="row mb-3">
            <div className="col d-flex justify-content-between align-items-start mb-2">
              <FormControl
                className="me-2"
                id="wd-assignment-title"
                defaultValue={assignment.title}
                onChange={(e) =>
                  setAssignment({ ...assignment, title: e.target.value })
                }
              />
              <a
                id="wd-update-assignment-title"
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
                href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
              >
                Update Title
              </a>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col d-flex justify-content-between align-items-start mb-2">
              <FormControl
                className="me-2"
                id="wd-assignment-score"
                defaultValue={assignment.score}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    score: parseInt(e.target.value),
                  })
                }
              />
              <a
                id="wd-update-assignment-score"
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
                href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
              >
                Update Score
              </a>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col d-flex justify-content-between align-items-start mb-2">
              <FormCheck
                className="me-2"
                type="checkbox"
                id="wd-assignment-completed"
                checked={assignment.completed}
                onChange={(e) => {
                  setAssignment({
                    ...assignment,
                    completed: e.target.checked,
                  });
                }}
                label="Completed"
              />
              <a
                id="wd-update-assignment-completed"
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
                href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
              >
                Update Completed
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h4>Retrieving Objects</h4>
          <a
            id="wd-retrieve-module"
            className="btn btn-primary"
            href={MODULE_API_URL}
          >
            Get Module
          </a>
          <hr />
          <h4>Retrieving Properties</h4>
          <a
            id="wd-retrieve-module-name"
            className="btn btn-primary"
            href={`${MODULE_API_URL}/name`}
          >
            Get Module Name
          </a>
          <hr />
          <h4>Modifying Properties</h4>
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <FormControl
                className="me-2"
                id="wd-module-name"
                defaultValue={module.name}
                onChange={(e) => setModule({ ...module, name: e.target.value })}
              />
              <a
                id="wd-update-module-name"
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
                href={`${MODULE_API_URL}/name/${module.name}`}
              >
                Update Module Name
              </a>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FormControl
                className="me-2"
                id="wd-module-description"
                defaultValue={module.description}
                onChange={(e) =>
                  setModule({ ...module, description: e.target.value })
                }
              />
              <a
                id="wd-update-module-description"
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
                href={`${MODULE_API_URL}/description/${module.description}`}
              >
                Update Module Description
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr />
    </div>
  );
}

import { FormControl, ListGroup } from 'react-bootstrap';
import ModulesControls from './ModulesControls';
import { BsGripVertical } from 'react-icons/bs';
import LessonControlButtons from './LessonControlButtons';
import ModuleControlButtons from './ModuleControlButtons';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import {
  setModules,
  addModule,
  editModule,
  updateModule,
  deleteModule,
} from './reducer';
import { useSelector, useDispatch } from 'react-redux';
import * as coursesClient from '../client';
import * as modulesClient from './client';

export default function Modules() {
  const { cid } = useParams();
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  const saveModule = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  const removeModule = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };

  const createModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await coursesClient.createModuleForCourse(cid, newModule);
    dispatch(addModule(module));
  };

  const fetchModules = async () => {
    const modules = await coursesClient.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const [moduleName, setModuleName] = useState('');
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === 'FACULTY';
  // @ts-ignore
  window.testStore = useSelector((state) => state);

  // const modules = db.modules;
  // ✅ const modules = db.modules; is a normal variable assignment

  // This line is just saying:
  // From the db object (imported as * as db), get the property modules, and assign it to a new constant called modules.
  // It’s not a destructuring assignment, and it doesn’t need {}.
  return (
    <div>
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={createModuleForCourse}
      />

      <ListGroup className="rounded-0" id="wd-modules">
        {modules.map((module: any) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            {/* p-0 removes padding, mb-5 adds bottom margin*/}
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />{' '}
              {!module.editing && module.name}
              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveModule({ ...module, editing: false });
                    }
                  }}
                  defaultValue={module.name}
                />
              )}
              {isFaculty && (
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => removeModule(moduleId)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />
              )}
            </div>
            {/* React Best Practice • UI events and handlers are often defined in
              the component that owns the relevant state. 
              Presentational components receive handler functions as props, and just “call back” to the parent when needed. */}
            {module.lessons && ( // This checks if module.lessons exists
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroup.Item
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
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

// Uses any type because the module objects are complex and the developer hasn't defined proper types

import { FaPlus } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { useState } from "react";
import ModuleEditor from "./ModuleEditor";
import { useSelector } from "react-redux";
export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
}: {
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: () => void;
}) {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  console.log("currentUser", currentUser);
  console.log("role", currentUser?.role);
  // @ts-ignore
  window.testStore = useSelector((state) => state);
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      {isFaculty && (
        <>
          <Button
            variant="danger"
            size="lg"
            className="me-1 float-end"
            id="wd-add-module-btn"
            onClick={handleShow}
          >
            <FaPlus
              className="position-relative me-2"
              style={{ bottom: "1px" }}
            />
            {/* Normally, you can’t use top, bottom, left, or right unless the element is positioned.
	    position: relative activates those offset properties.
        
        bottom: "1px" nudges the icon down slightly to align it better with the text */}
            Module
          </Button>
          <Dropdown className="float-end me-2">
            <Dropdown.Toggle
              variant="secondary"
              size="lg"
              id="wd-publish-all-btn"
            >
              {/* variant="secondary gives it a gray background */}
              <GreenCheckmark /> Publish All
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item id="wd-publish-all-modules-and-items">
                <GreenCheckmark /> Publish all modules and items
              </Dropdown.Item>
              <Dropdown.Item id="wd-publish-modules-only">
                <GreenCheckmark /> Publish modules only
              </Dropdown.Item>
              {/* Create two more items with IDs wd-unpublish-all-modules-and-items and wd-unpublish-modules-only with
             labels Unpublish all modules and items and Unpublish modules only */}

              <Dropdown.Item id="wd-unpublish-all-modules-and-items">
                <MdDoNotDisturbAlt /> Unpublish all modules and items
              </Dropdown.Item>
              <Dropdown.Item id="wd-unpublish-modules-only">
                <MdDoNotDisturbAlt /> Unpublish modules only
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
      {/* Implement the View Progress and Collapse All buttons with IDs wd-view-progress and wd-collapse-all */}
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        id="wd-view-progress"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        View Progress
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        id="wd-collapse-all"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Collapse All
      </Button>
      <div className="clearfix"></div>
      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}

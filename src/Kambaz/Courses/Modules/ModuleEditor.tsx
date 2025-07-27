import { Modal, FormControl, Button } from "react-bootstrap";
export default function ModuleEditor({
  show,
  handleClose,
  dialogTitle,
  moduleName,
  setModuleName,
  addModule,
}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: () => void;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      {/* React-Bootstrap will call your function handleClose whenever the user tries to close the modal (by X, ESC, backdrop, etc.). */}
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl
          value={moduleName}
          onChange={(e) => {
            setModuleName(e.target.value);
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {" "}
          Cancel{" "}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            addModule();
            handleClose();
          }}
        >
          {" "}
          Add Module{" "}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// A modal is a type of popup window (sometimes called a “dialog box”).
// It appears on top of the page, often to get user input or confirm an action.
// You can’t interact with the rest of the page until you close the modal.

import { Button } from "react-bootstrap";
import {
  BsCaretDownFill,
  BsGripVertical,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
export default function Header() {
  return (
    <div className="d-flex justify-content-between p-3 bg-light border">
      <div className="d-flex align-items-center">
        <BsGripVertical className="me-2 fs-3" />
        <BsCaretDownFill className="me-2 fs-6" />
        <span className=" fw-bold fs-5">ASSIGNMENTS</span>
      </div>
      <div>
        <Button
          variant="outline-secondary"
          size="lg"
          className="rounded-pill me-2"
        >
          40% of Total
        </Button>
        <FaPlus className="me-2 fs-4" />
        <BsThreeDotsVertical className="fs-4 me-2" />
      </div>
    </div>
  );
}

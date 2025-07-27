import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { FaTrash } from "react-icons/fa";
export default function ModuleControlButtons({ moduleId, deleteModule }: { moduleId: string; deleteModule: (moduleId: string) => void; }) {
  return (
    <div className="float-end">
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => deleteModule(moduleId)}
      />

      <GreenCheckmark />
      <BsPlus className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

import { IoEllipsisVertical } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

export default function AssignmentControlButtons({
  assignmentId,
  assignmentTitle,
  deleteAssignment,
}: {
  assignmentId: string;
  assignmentTitle: string;
  deleteAssignment: (assignmentId: string) => void;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { cid } = useParams();
  const navigate = useNavigate();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    deleteAssignment(assignmentId);
    setShowDeleteModal(false);
    // Navigate back to Assignments list after deletion
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleCancelDelete = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowDeleteModal(false);
    // Navigate back to Assignments list when canceling
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleModalHide = () => {
    setShowDeleteModal(false);
    // Navigate back to Assignments list when modal is hidden
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <FaCheckCircle className="text-success fs-4 me-3" />
        <FaTrash
          className="text-danger fs-4 me-2"
          onClick={handleDeleteClick}
          style={{ cursor: "pointer" }}
        />
        <BsThreeDotsVertical className="fs-4 text-muted" />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleModalHide}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the assignment "{assignmentTitle}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
} 
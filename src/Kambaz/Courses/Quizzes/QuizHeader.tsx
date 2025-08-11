import { BsThreeDotsVertical } from 'react-icons/bs';

export default function QuizHeader() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <span className="fw-bold fs-5">Assignment Quizzes</span>
        </div>
        <div className="d-flex align-items-center">
          <BsThreeDotsVertical className="fs-4" />
        </div>
      </div>
      
    </>
  );
}

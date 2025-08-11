import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { addQuiz, updateQuiz } from './reducer';
import * as quizzesClient from './client';
import type { Quiz, QuizFormData } from './types';

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const isNewQuiz = qid === 'new';

  const quiz = isNewQuiz ? null : quizzes.find((q: Quiz) => q._id === qid);

  // Navigate back to Quizzes if the quiz doesn't exist (was deleted)
  useEffect(() => {
    if (!isNewQuiz && !quiz) {
      console.log('Quiz not found, navigating back to Quizzes');
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      return;
    }
  }, [quiz, isNewQuiz, cid, navigate]);

  // State for form fields
  const [title, setTitle] = useState(quiz?.title || 'New Quiz');
  const [description, setDescription] = useState(
    quiz?.description || 'Quiz description'
  );
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit || 30);
  const [dueDate, setDueDate] = useState(
    quiz?.dueDate ? new Date(quiz.dueDate).toISOString().slice(0, 16) : ''
  );
  const [availableDate, setAvailableDate] = useState(
    quiz?.availableDate
      ? new Date(quiz.availableDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [isPublished, setIsPublished] = useState(quiz?.isPublished || false);
  const [quizType, setQuizType] = useState('Graded Quiz');
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  // Update form when quiz changes
  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description);
      setTimeLimit(quiz.timeLimit || 30);
      setDueDate(
        quiz.dueDate ? new Date(quiz.dueDate).toISOString().slice(0, 16) : ''
      );
      setAvailableDate(
        quiz.availableDate
          ? new Date(quiz.availableDate).toISOString().slice(0, 16)
          : ''
      );
      setIsPublished(quiz.isPublished);
    }
  }, [quiz]);

  const handleSave = async () => {
    const quizData: QuizFormData = {
      title,
      description,
      timeLimit,
      availableDate: availableDate
        ? new Date(availableDate).toISOString()
        : new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      isPublished,
      questions: quiz?.questions || [],
    };

    try {
      if (isNewQuiz) {
        const newQuiz = await quizzesClient.createQuiz(quizData, cid!);
        dispatch(addQuiz(newQuiz));
      } else {
        const updatedQuiz = await quizzesClient.updateQuiz(qid!, quizData);
        dispatch(updateQuiz(updatedQuiz));
      }

      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  // Don't render the form if quiz doesn't exist (was deleted)
  if (!isNewQuiz && !quiz) {
    return null;
  }

  return (
    <div id="wd-quiz-editor" className="container">
      {/* Header with Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{isNewQuiz ? 'Create New Quiz' : 'Edit Quiz'}</h3>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Points:{' '}
            {quiz?.questions?.reduce((sum, q) => sum + q.points, 0) || 0}
          </span>
          <span
            className={`badge ${isPublished ? 'bg-success' : 'bg-secondary'}`}
          >
            {isPublished ? 'Published' : 'Not Published'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a className="nav-link active" href="#details" data-bs-toggle="tab">
            Details
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#questions" data-bs-toggle="tab">
            Questions
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Details Tab */}
        <div className="tab-pane fade show active" id="details">
          <div className="mb-3">
            <label htmlFor="wd-quiz-title" className="form-label">
              Quiz Title
            </label>
            <input
              id="wd-quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="Enter quiz title"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="wd-quiz-description" className="form-label">
              Quiz Instructions
            </label>
            <textarea
              id="wd-quiz-description"
              rows={4}
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz instructions"
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="wd-quiz-type" className="form-label">
                Quiz Type
              </label>
              <select
                id="wd-quiz-type"
                className="form-select"
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
              >
                <option>Graded Quiz</option>
                <option>Practice Quiz</option>
                <option>Graded Survey</option>
                <option>Ungraded Survey</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="wd-time-limit" className="form-label">
                Time Limit (minutes)
              </label>
              <input
                id="wd-time-limit"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                className="form-control"
                min="1"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Options</label>
            <div className="p-3 border rounded">
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-shuffle-answers"
                  checked={shuffleAnswers}
                  onChange={(e) => setShuffleAnswers(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="wd-shuffle-answers"
                >
                  Shuffle Answers
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-allow-multiple-attempts"
                  checked={allowMultipleAttempts}
                  onChange={(e) => setAllowMultipleAttempts(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="wd-allow-multiple-attempts"
                >
                  Allow Multiple Attempts
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-show-correct-answers"
                  checked={showCorrectAnswers}
                  onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="wd-show-correct-answers"
                >
                  Show Correct Answers
                </label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Assign</label>
            <div className="p-3 border rounded">
              <div className="mb-3">
                <label htmlFor="wd-assign-to" className="form-label fw-bold">
                  Assign to
                </label>
                <select id="wd-assign-to" className="form-select">
                  <option>Everyone</option>
                  <option>Section 1</option>
                  <option>Section 2</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="wd-due-date" className="form-label fw-bold">
                  Due
                </label>
                <input
                  type="datetime-local"
                  id="wd-due-date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col">
                  <label
                    htmlFor="wd-available-from"
                    className="form-label fw-bold"
                  >
                    Available from
                  </label>
                  <input
                    type="datetime-local"
                    id="wd-available-from"
                    className="form-control"
                    value={availableDate}
                    onChange={(e) => setAvailableDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wd-publish-quiz"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="wd-publish-quiz">
                Publish quiz
              </label>
            </div>
          </div>
        </div>

        {/* Questions Tab */}
        <div className="tab-pane fade" id="questions">
          <div className="text-center py-5">
            <p className="text-muted">
              Questions editor will be implemented here
            </p>
            <p className="text-muted">
              This will allow you to add, edit, and manage quiz questions
            </p>
          </div>
        </div>
      </div>

      <hr />

      <div className="text-end">
        <button className="btn btn-secondary me-2" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

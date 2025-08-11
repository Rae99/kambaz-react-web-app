import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { addQuiz, updateQuiz } from './reducer';
import * as quizzesClient from './client';
import QuizDetailsEditor from './QuizDetailsEditor';
import QuizQuestionsEditor from './QuizQuestionsEditor';
import type { Quiz, QuizFormData } from './types';
import * as coursesClient from '../client';

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
  const [quizForm, setQuizForm] = useState<QuizFormData>({
    title: quiz?.title || 'New Quiz',
    description: quiz?.description || 'Quiz description',
    timeLimit: quiz?.timeLimit || 30,
    dueDate: quiz?.dueDate
      ? new Date(quiz.dueDate).toISOString().slice(0, 16)
      : '',
    availableDate: quiz?.availableDate
      ? new Date(quiz.availableDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    isPublished: quiz?.isPublished || false,
    questions: quiz?.questions || [],
    quizType: 'Graded Quiz',
    shuffleAnswers: false,
    allowMultipleAttempts: false,
    showCorrectAnswers: false,
  });

  // Update form when quiz changes
  useEffect(() => {
    if (quiz) {
      setQuizForm({
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit || 30,
        dueDate: quiz.dueDate
          ? new Date(quiz.dueDate).toISOString().slice(0, 16)
          : '',
        availableDate: quiz.availableDate
          ? new Date(quiz.availableDate).toISOString().slice(0, 16)
          : '',
        isPublished: quiz.isPublished,
        questions: quiz.questions,
        quizType: 'Graded Quiz',
        shuffleAnswers: false,
        allowMultipleAttempts: false,
        showCorrectAnswers: false,
      });
    }
  }, [quiz]);

  const handleFormChange = (field: keyof QuizFormData, value: any) => {
    setQuizForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const quizData: QuizFormData = {
      ...quizForm,
      availableDate: quizForm.availableDate
        ? new Date(quizForm.availableDate).toISOString()
        : new Date().toISOString(),
      dueDate: quizForm.dueDate
        ? new Date(quizForm.dueDate).toISOString()
        : undefined,
    };

    try {
      if (isNewQuiz) {
        const newQuiz = await coursesClient.createQuizForCourse(cid!, quizData);
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
            {quizForm.questions?.reduce(
              (sum: number, q: any) => sum + q.points,
              0
            ) || 0}
          </span>
          <span
            className={`badge ${
              quizForm.isPublished ? 'bg-success' : 'bg-secondary'
            }`}
          >
            {quizForm.isPublished ? 'Published' : 'Not Published'}
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
        <QuizDetailsEditor
          quizForm={quizForm}
          onFormChange={handleFormChange}
        />
        <QuizQuestionsEditor />
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

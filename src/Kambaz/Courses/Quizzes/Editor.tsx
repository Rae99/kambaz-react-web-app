import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { addQuiz, updateQuiz } from './reducer';
import * as quizzesClient from './client';
import QuizDetailsEditor from './QuizDetailsEditor';
import QuizQuestionsEditor from './QuizQuestionsEditor';
import type { Quiz } from './types';
import * as coursesClient from '../client';

export default function QuizEditor() {
  const params = useParams();
  const { cid, qid } = params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log('QuizEditor params:', params);
  console.log('QuizEditor cid:', cid);
  console.log('QuizEditor qid:', qid);

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const isNewQuiz = qid === 'new';
  const [activeTab, setActiveTab] = useState<'details' | 'questions'>(
    'details'
  );

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
  const [quizForm, setQuizForm] = useState<Quiz>({
    title: quiz?.title ?? 'New Quiz',
    description: quiz?.description ?? 'Quiz description',
    courseId: quiz?.courseId || cid || '',
    quizType: quiz?.quizType ?? 'Graded Quiz',
    points: quiz?.points ?? 100,
    assignmentGroup: quiz?.assignmentGroup ?? 'Quizzes',
    shuffleAnswers: quiz?.shuffleAnswers ?? true, // Default: Yes
    timeLimit: quiz?.timeLimit ?? 20, // Default: 20 Minutes
    multipleAttempts: quiz?.multipleAttempts ?? false, // Default: No
    attemptsAllowed: quiz?.attemptsAllowed ?? 1, // Default: 1
    showCorrectAnswers: quiz?.showCorrectAnswers ?? 'Never',
    accessCode: quiz?.accessCode ?? '',
    oneQuestionAtATime: quiz?.oneQuestionAtATime ?? true, // Default: Yes
    webcamRequired: quiz?.webcamRequired ?? false, // Default: No
    lockQuestionsAfterAnswering: quiz?.lockQuestionsAfterAnswering ?? false, // Default: No
    dueDate: quiz?.dueDate
      ? new Date(quiz.dueDate).toISOString().slice(0, 16)
      : '',
    availableDate: quiz?.availableDate
      ? new Date(quiz.availableDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    untilDate: quiz?.untilDate
      ? new Date(quiz.untilDate).toISOString().slice(0, 16)
      : '',
    questions: quiz?.questions ?? [],
    isPublished: quiz?.isPublished ?? false,
    createdAt: quiz?.createdAt ?? new Date().toISOString(),
    updatedAt: quiz?.updatedAt ?? new Date().toISOString(),
  });

  // Update form when quiz changes
  useEffect(() => {
    if (quiz) {
      setQuizForm({
        title: quiz.title,
        description: quiz.description,
        courseId: quiz.courseId,
        quizType: quiz.quizType ?? 'Graded Quiz',
        points: quiz.points ?? 100,
        assignmentGroup: quiz.assignmentGroup ?? 'Quizzes',
        shuffleAnswers: quiz.shuffleAnswers ?? true,
        timeLimit: quiz.timeLimit ?? 20,
        multipleAttempts: quiz.multipleAttempts ?? false,
        attemptsAllowed: quiz.attemptsAllowed ?? 1,
        showCorrectAnswers: quiz.showCorrectAnswers ?? 'Never',
        accessCode: quiz.accessCode ?? '',
        oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
        webcamRequired: quiz.webcamRequired ?? false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering ?? false,
        dueDate: quiz.dueDate
          ? new Date(quiz.dueDate).toISOString().slice(0, 16)
          : '',
        availableDate: quiz.availableDate
          ? new Date(quiz.availableDate).toISOString().slice(0, 16)
          : '',
        untilDate: quiz.untilDate
          ? new Date(quiz.untilDate).toISOString().slice(0, 16)
          : '',
        questions: quiz.questions,
        isPublished: quiz.isPublished,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      });
    }
  }, [quiz]);

  const handleFormChange = (field: keyof Quiz, value: any) => {
    console.log('=== HANDLE FORM CHANGE ===');
    console.log('1. field:', field);
    console.log('2. value:', value);
    console.log('3. previous quizForm:', quizForm);

    setQuizForm((prev) => {
      const newForm = {
        ...prev,
        [field]: value,
      };
      console.log('4. new quizForm:', newForm);
      console.log('5. questions count in newForm:', newForm.questions?.length);
      return newForm;
    });
  };

  const handleSave = async (shouldNavigate: boolean = true) => {
    console.log('=== HANDLE SAVE START ===');
    console.log('1. shouldNavigate:', shouldNavigate);
    console.log('2. isNewQuiz:', isNewQuiz);
    console.log('3. cid:', cid);
    console.log('4. qid:', qid);
    console.log('5. quizForm.questions count:', quizForm.questions?.length);
    console.log('6. quizForm.questions:', quizForm.questions);

    const quizData: Quiz = {
      ...quizForm,
      availableDate: quizForm.availableDate
        ? new Date(quizForm.availableDate).toISOString()
        : new Date().toISOString(),
      dueDate: quizForm.dueDate
        ? new Date(quizForm.dueDate).toISOString()
        : undefined,
      untilDate: quizForm.untilDate
        ? new Date(quizForm.untilDate).toISOString()
        : undefined,
    };

    console.log('7. quizData prepared:', quizData);
    console.log('8. quizData.questions count:', quizData.questions?.length);

    try {
      if (isNewQuiz) {
        console.log('Creating new quiz...');
        const newQuiz = await coursesClient.createQuizForCourse(cid!, quizData);
        console.log('Quiz created successfully:', newQuiz);
        dispatch(addQuiz(newQuiz));
      } else {
        console.log('Updating existing quiz...');
        const updatedQuiz = await quizzesClient.updateQuiz(qid!, quizData);
        dispatch(updateQuiz(updatedQuiz));
      }

      // Only navigate if the user explicitly saved
      if (shouldNavigate) {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  };

  const handleCancel = () => {
    if (isNewQuiz) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } else {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
    }
  };

  // Debug logging
  console.log('Editor render:', { isNewQuiz, qid, quiz, quizForm });

  // Don't render the form if quiz doesn't exist (was deleted)
  if (!isNewQuiz && !quiz) {
    console.log('Returning null - quiz not found and not new');
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
          <Button
            variant={quizForm.isPublished ? 'success' : 'secondary'}
            size="sm"
            onClick={() =>
              handleFormChange('isPublished', !quizForm.isPublished)
            }
            className="d-flex align-items-center gap-2"
          >
            {quizForm.isPublished ? 'Published' : 'Not Published'}
            <span className="ms-1">{quizForm.isPublished ? '✅' : '🚫'}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
            href="#details"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('details');
            }}
          >
            Details
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
            href="#questions"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('questions');
            }}
          >
            Questions
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'details' && (
          <QuizDetailsEditor
            quizForm={quizForm}
            onFormChange={handleFormChange}
            onSave={() => handleSave(true)}
            onCancel={handleCancel}
          />
        )}
        {activeTab === 'questions' && (
          <QuizQuestionsEditor
            questions={quizForm.questions}
            onQuestionsChange={(questions) => {
              console.log('=== QUESTIONS CHANGE IN EDITOR ===');
              console.log('1. New questions count:', questions.length);
              console.log(
                '2. Current quizForm.questions count:',
                quizForm.questions?.length
              );
              handleFormChange('questions', questions);
            }}
          />
        )}
      </div>
    </div>
  );
}

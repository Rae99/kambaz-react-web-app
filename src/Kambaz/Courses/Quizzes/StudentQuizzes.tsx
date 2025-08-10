import React from 'react';
import { Button, Card, Badge } from 'react-bootstrap';
import type { Quiz } from './types';

interface StudentQuizzesProps {
  courseId: string;
  quizzes: Quiz[];
}

export default function StudentQuizzes({
  courseId,
  quizzes,
}: StudentQuizzesProps) {
  const publishedQuizzes = quizzes.filter((quiz) => quiz.isPublished);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Available Quizzes</h3>
        <div className="text-muted">
          {publishedQuizzes.length} quiz
          {publishedQuizzes.length !== 1 ? 'es' : ''} available
        </div>
      </div>

      {publishedQuizzes.length === 0 ? (
        <div className="alert alert-info">
          No quizzes are currently available for this course.
        </div>
      ) : (
        <div className="row">
          {publishedQuizzes.map((quiz) => (
            <div key={quiz._id} className="col-md-6 mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{quiz.title}</Card.Title>
                  <Card.Text>{quiz.description}</Card.Text>

                  <div className="mb-3">
                    <small className="text-muted">
                      {quiz.timeLimit && (
                        <>
                          <strong>Time Limit:</strong> {quiz.timeLimit} minutes
                          <br />
                        </>
                      )}
                      {quiz.dueDate && (
                        <>
                          <strong>Due Date:</strong>{' '}
                          {new Date(quiz.dueDate).toLocaleDateString()}
                          <br />
                        </>
                      )}
                      <strong>Questions:</strong> {quiz.questions.length}
                      <br />
                      <strong>Total Points:</strong>{' '}
                      {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <Button variant="primary" size="sm">
                      Start Quiz
                    </Button>
                    <Button variant="outline-info" size="sm">
                      View Previous Attempts
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

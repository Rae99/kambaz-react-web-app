import React from 'react';
import { Button, Card, Badge } from 'react-bootstrap';
import type { Quiz } from './types';

interface FacultyQuizzesProps {
  courseId: string;
  quizzes: Quiz[];
}

export default function FacultyQuizzes({
  courseId,
  quizzes,
}: FacultyQuizzesProps) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Faculty Quiz Management</h3>
        <Button variant="primary" size="lg">
          Create New Quiz
        </Button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Quiz Statistics</Card.Title>
              <Card.Text>
                Total Quizzes: {quizzes.length}
                <br />
                Published: {quizzes.filter((q) => q.isPublished).length}
                <br />
                Draft: {quizzes.filter((q) => !q.isPublished).length}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      <h4 className="mt-4 mb-3">Course Quizzes</h4>
      {quizzes.length === 0 ? (
        <div className="alert alert-info">
          No quizzes created yet. Click "Create New Quiz" to get started!
        </div>
      ) : (
        <div className="row">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="col-md-6 mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{quiz.title}</Card.Title>
                    <Badge bg={quiz.isPublished ? 'success' : 'secondary'}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <Card.Text>{quiz.description}</Card.Text>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline-info" size="sm">
                      Preview
                    </Button>
                    <Button variant="outline-success" size="sm">
                      Results
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      Delete
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

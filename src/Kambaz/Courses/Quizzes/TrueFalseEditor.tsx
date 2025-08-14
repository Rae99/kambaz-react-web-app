import React from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import type { Question } from './types';

interface TrueFalseEditorProps {
  question: Question;
  onQuestionChange: (question: Question) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function TrueFalseEditor({
  question,
  onQuestionChange,
  onSave,
  onCancel,
}: TrueFalseEditorProps) {
  const handleQuestionChange = (field: keyof Question, value: any) => {
    onQuestionChange({
      ...question,
      [field]: value,
    });
  };

  const handleCorrectAnswerChange = (value: string) => {
    onQuestionChange({
      ...question,
      correctAnswer: value,
    });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>True/False Question Editor</h5>

        <Row className="mb-3">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={question.title || ''}
                onChange={(e) => handleQuestionChange('title', e.target.value)}
                placeholder="Enter question title..."
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={question.points || 1}
                onChange={(e) =>
                  handleQuestionChange('points', parseInt(e.target.value) || 1)
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={question.text || ''}
            onChange={(e) => handleQuestionChange('text', e.target.value)}
            placeholder="Enter your question here..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Explanation (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={question.explanation || ''}
            onChange={(e) =>
              handleQuestionChange('explanation', e.target.value)
            }
            placeholder="Explain why this answer is correct..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Correct Answer</Form.Label>
          <div>
            <Form.Check
              type="radio"
              name="correctAnswer"
              id="true-answer"
              label="True"
              value="true"
              checked={question.correctAnswer === 'true'}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              name="correctAnswer"
              id="false-answer"
              label="False"
              value="false"
              checked={question.correctAnswer === 'false'}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
            />
          </div>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="success" onClick={onSave}>
            <FaSave className="me-2" />
            Save Question
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            <FaTimes className="me-2" />
            Cancel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

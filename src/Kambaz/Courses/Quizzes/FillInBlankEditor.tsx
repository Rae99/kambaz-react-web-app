import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import type { Question } from './types';

interface FillInBlankEditorProps {
  question: Question;
  onQuestionChange: (question: Question) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function FillInBlankEditor({
  question,
  onQuestionChange,
  onSave,
  onCancel,
}: FillInBlankEditorProps) {
  const [answers, setAnswers] = useState<string[]>(
    question.options && question.options.length > 0 ? question.options : ['']
  );

  const handleQuestionChange = (field: keyof Question, value: any) => {
    onQuestionChange({
      ...question,
      [field]: value,
    });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // Update the question with new answers
    onQuestionChange({
      ...question,
      options: newAnswers,
    });
  };

  const addAnswer = () => {
    const newAnswers = [...answers, ''];
    setAnswers(newAnswers);
    onQuestionChange({
      ...question,
      options: newAnswers,
    });
  };

  const removeAnswer = (index: number) => {
    if (answers.length > 1) {
      // Keep at least 1 answer
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
      onQuestionChange({
        ...question,
        options: newAnswers,
      });
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Fill in the Blank Question Editor</h5>

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
            placeholder="Enter your question here... (use ___ for blank spaces)"
          />
        </Form.Group>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0">Possible Correct Answers</Form.Label>
            <Button variant="outline-primary" size="sm" onClick={addAnswer}>
              <FaPlus className="me-1" />
              Add Answer
            </Button>
          </div>

          <small className="text-muted mb-2 d-block">
            Add multiple possible correct answers. Answers are case insensitive.
          </small>

          {answers.map((answer, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Form.Control
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                className="me-2"
              />
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeAnswer(index)}
                disabled={answers.length <= 1}
              >
                <FaTrash />
              </Button>
            </div>
          ))}
        </div>

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

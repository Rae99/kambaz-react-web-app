import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import type { Question } from './types';

interface MultipleChoiceEditorProps {
  question: Question;
  onQuestionChange: (question: Question) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function MultipleChoiceEditor({
  question,
  onQuestionChange,
  onSave,
  onCancel,
}: MultipleChoiceEditorProps) {
  const [choices, setChoices] = useState<string[]>(
    question.options && question.options.length > 0
      ? question.options
      : ['', '']
  );

  const handleQuestionChange = (field: keyof Question, value: any) => {
    onQuestionChange({
      ...question,
      [field]: value,
    });
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);

    // Update the question with new choices
    onQuestionChange({
      ...question,
      options: newChoices,
    });
  };

  const addChoice = () => {
    const newChoices = [...choices, ''];
    setChoices(newChoices);
    onQuestionChange({
      ...question,
      options: newChoices,
    });
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      // Keep at least 2 choices
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);

      // If the removed choice was the correct answer, clear it
      let newCorrectAnswer = question.correctAnswer;
      if (question.correctAnswer === choices[index]) {
        newCorrectAnswer = '';
      }

      onQuestionChange({
        ...question,
        options: newChoices,
        correctAnswer: newCorrectAnswer,
      });
    }
  };

  const handleCorrectAnswerChange = (choice: string) => {
    onQuestionChange({
      ...question,
      correctAnswer: choice,
    });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Multiple Choice Question Editor</h5>

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

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0">Choices</Form.Label>
            <Button variant="outline-primary" size="sm" onClick={addChoice}>
              <FaPlus className="me-1" />
              Add Choice
            </Button>
          </div>

          {choices.map((choice, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Form.Check
                type="radio"
                name="correctAnswer"
                id={`choice-${index}`}
                checked={question.correctAnswer === choice}
                onChange={() => handleCorrectAnswerChange(choice)}
                className="me-2"
              />
              <Form.Control
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="me-2"
              />
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeChoice(index)}
                disabled={choices.length <= 2}
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

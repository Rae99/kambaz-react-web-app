import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import type { Question, BlankOption } from './types';

interface FillInBlankEditorProps {
  question: Question;
  onQuestionChange: (question: Question) => void;
  onQuestionTypeChange: (
    newType: 'multiple-choice' | 'true-false' | 'fill-in-the-blank'
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function FillInBlankEditor({
  question,
  onQuestionChange,
  onQuestionTypeChange,
  onSave,
  onCancel,
}: FillInBlankEditorProps) {
  const [blanks, setBlanks] = useState<BlankOption[]>(
    question.blanks && question.blanks.length > 0
      ? question.blanks
      : [
          {
            id: 'blank1',
            options: ['', '', ''],
            correctAnswer: '',
          },
        ]
  );

  const handleQuestionChange = (field: keyof Question, value: any) => {
    onQuestionChange({
      ...question,
      [field]: value,
    });
  };

  const addBlank = () => {
    const newBlankId = `blank${blanks.length + 1}`;
    const newBlanks = [
      ...blanks,
      {
        id: newBlankId,
        options: ['', '', ''],
        correctAnswer: '',
      },
    ];
    setBlanks(newBlanks);
    onQuestionChange({
      ...question,
      blanks: newBlanks,
    });
  };

  const removeBlank = (index: number) => {
    if (blanks.length > 1) {
      const newBlanks = blanks.filter((_, i) => i !== index);
      setBlanks(newBlanks);
      onQuestionChange({
        ...question,
        blanks: newBlanks,
      });
    }
  };

  const updateBlankOption = (
    blankIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newBlanks = [...blanks];
    newBlanks[blankIndex].options[optionIndex] = value;
    setBlanks(newBlanks);
    onQuestionChange({
      ...question,
      blanks: newBlanks,
    });
  };

  const addOptionToBlank = (blankIndex: number) => {
    const newBlanks = [...blanks];
    newBlanks[blankIndex].options.push('');
    setBlanks(newBlanks);
    onQuestionChange({
      ...question,
      blanks: newBlanks,
    });
  };

  const removeOptionFromBlank = (blankIndex: number, optionIndex: number) => {
    const newBlanks = [...blanks];
    if (newBlanks[blankIndex].options.length > 2) {
      // Keep at least 2 options
      // If removing the correct answer, clear it
      if (
        newBlanks[blankIndex].correctAnswer ===
        newBlanks[blankIndex].options[optionIndex]
      ) {
        newBlanks[blankIndex].correctAnswer = '';
      }
      newBlanks[blankIndex].options.splice(optionIndex, 1);
      setBlanks(newBlanks);
      onQuestionChange({
        ...question,
        blanks: newBlanks,
      });
    }
  };

  const setCorrectAnswer = (blankIndex: number, correctAnswer: string) => {
    const newBlanks = [...blanks];
    newBlanks[blankIndex].correctAnswer = correctAnswer;
    setBlanks(newBlanks);
    onQuestionChange({
      ...question,
      blanks: newBlanks,
    });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Fill in the Blank Question Editor</h5>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Question Type</Form.Label>
              <Form.Select
                value={question.type}
                onChange={(e) =>
                  onQuestionTypeChange(
                    e.target.value as
                      | 'multiple-choice'
                      | 'true-false'
                      | 'fill-in-the-blank'
                  )
                }
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="fill-in-the-blank">Fill in the Blank</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

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
            <Form.Label className="mb-0">Blanks</Form.Label>
            <Button variant="outline-primary" size="sm" onClick={addBlank}>
              <FaPlus className="me-1" />
              Add Blank
            </Button>
          </div>

          <small className="text-muted mb-3 d-block">
            Each blank will be a dropdown for students to select from. Configure
            the options and correct answer for each blank.
          </small>

          {blanks.map((blank, blankIndex) => (
            <Card key={blank.id} className="mb-3 border-secondary">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Blank {blankIndex + 1}</h6>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeBlank(blankIndex)}
                    disabled={blanks.length <= 1}
                  >
                    <FaTrash className="me-1" />
                    Remove Blank
                  </Button>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="mb-0">
                      Options for this blank
                    </Form.Label>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addOptionToBlank(blankIndex)}
                    >
                      <FaPlus className="me-1" />
                      Add Option
                    </Button>
                  </div>

                  {blank.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="d-flex align-items-center mb-2"
                    >
                      <Form.Control
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateBlankOption(
                            blankIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        className="me-2"
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          removeOptionFromBlank(blankIndex, optionIndex)
                        }
                        disabled={blank.options.length <= 2}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>

                <Form.Group>
                  <Form.Label>Correct Answer for this blank</Form.Label>
                  <Form.Select
                    value={blank.correctAnswer}
                    onChange={(e) =>
                      setCorrectAnswer(blankIndex, e.target.value)
                    }
                  >
                    <option value="">Select correct answer...</option>
                    {blank.options.map((option, optionIndex) => (
                      <option
                        key={optionIndex}
                        value={option}
                        disabled={!option.trim()}
                      >
                        {option || `Option ${optionIndex + 1}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
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

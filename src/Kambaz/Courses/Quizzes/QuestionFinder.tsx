import { useState, useMemo } from 'react';
import { Form, InputGroup, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes, FaPlus } from 'react-icons/fa';
import type { Question } from './types';

interface QuestionFinderProps {
  questions: Question[];
  onAddQuestion: (question: Question) => void;
  allQuestions?: Question[]; // Optional: questions from other quizzes or question bank
}

export default function QuestionFinder({
  questions,
  onAddQuestion,
  allQuestions = [],
}: QuestionFinderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPoints, setSelectedPoints] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Combine current quiz questions with external questions (if any)
  const allAvailableQuestions = useMemo(() => {
    const currentQuizQuestions = questions.map(q => ({ ...q, source: 'current' }));
    const externalQuestions = allQuestions.map(q => ({ ...q, source: 'external' }));
    return [...currentQuizQuestions, ...externalQuestions];
  }, [questions, allQuestions]);

  // Filter questions based on search and filters
  const filteredQuestions = useMemo(() => {
    return allAvailableQuestions.filter(question => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (question.title && question.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (question.explanation && question.explanation.toLowerCase().includes(searchTerm.toLowerCase()));

      // Type filter
      const matchesType = selectedType === 'all' || question.type === selectedType;

      // Points filter
      const matchesPoints = selectedPoints === 'all' || 
        (selectedPoints === '1' && question.points === 1) ||
        (selectedPoints === '2-5' && question.points >= 2 && question.points <= 5) ||
        (selectedPoints === '6+' && question.points >= 6);

      return matchesSearch && matchesType && matchesPoints;
    });
  }, [allAvailableQuestions, searchTerm, selectedType, selectedPoints]);

  const handleAddToQuiz = (question: Question) => {
    // Create a copy of the question without the source property
    const { source, ...questionCopy } = question as Question & { source?: string };
    onAddQuestion(questionCopy);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedPoints('all');
  };

  const getQuestionPreview = (question: Question) => {
    if (question.type === 'multiple-choice' && question.options) {
      return question.options.slice(0, 2).join(', ') + (question.options.length > 2 ? '...' : '');
    } else if (question.type === 'true-false') {
      return 'True / False';
    } else if (question.type === 'fill-in-the-blank') {
      return 'Fill in the blank question';
    }
    return '';
  };

  return (
    <div className="question-finder">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>
          <FaSearch className="me-2" />
          Find Questions
        </h5>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="me-1" />
          Filters
        </Button>
      </div>

      {/* Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search questions by text, title, or explanation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="outline-secondary"
            onClick={() => setSearchTerm('')}
          >
            <FaTimes />
          </Button>
        )}
      </InputGroup>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="fill-in-the-blank">Fill in the Blank</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Points</Form.Label>
                  <Form.Select
                    value={selectedPoints}
                    onChange={(e) => setSelectedPoints(e.target.value)}
                  >
                    <option value="all">All Points</option>
                    <option value="1">1 point</option>
                    <option value="2-5">2-5 points</option>
                    <option value="6+">6+ points</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="outline-secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">
          Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
        </span>
        {(searchTerm || selectedType !== 'all' || selectedPoints !== 'all') && (
          <Button variant="link" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        )}
      </div>

      {/* Question Results */}
      <div className="question-results" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredQuestions.length === 0 ? (
          <Card>
            <Card.Body className="text-center text-muted">
              <p>No questions found matching your criteria.</p>
              {searchTerm && (
                <Button variant="link" onClick={() => setSearchTerm('')}>
                  Clear search to see all questions
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          filteredQuestions.map((question, index) => {
            const questionWithSource = question as Question & { source?: string };
            const isFromCurrent = questionWithSource.source === 'current';
            
            return (
              <Card key={index} className="mb-2">
                <Card.Body className="py-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        {question.title && (
                          <strong className="text-primary">{question.title}</strong>
                        )}
                        <Badge bg={question.type === 'multiple-choice' ? 'primary' : 
                                   question.type === 'true-false' ? 'success' : 'info'}>
                          {question.type.replace('-', ' ')}
                        </Badge>
                        <Badge bg="secondary">{question.points} pts</Badge>
                        {isFromCurrent && (
                          <Badge bg="warning" text="dark">Current Quiz</Badge>
                        )}
                      </div>
                      <p className="mb-1 text-truncate">
                        {question.text}
                      </p>
                      {getQuestionPreview(question) && (
                        <small className="text-muted">
                          {getQuestionPreview(question)}
                        </small>
                      )}
                    </div>
                    <div className="ms-2">
                      {!isFromCurrent && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleAddToQuiz(question)}
                          title="Add to quiz"
                        >
                          <FaPlus />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

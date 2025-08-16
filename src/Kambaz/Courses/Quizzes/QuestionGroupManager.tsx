import { useState } from 'react';
import { Button, Card, Form, Modal, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import type { QuestionGroup, Question } from './types';

interface QuestionGroupManagerProps {
  groups: QuestionGroup[];
  questions: Question[];
  onGroupsChange: (groups: QuestionGroup[]) => void;
  onQuestionsChange: (questions: Question[]) => void;
}

export default function QuestionGroupManager({
  groups,
  questions,
  onGroupsChange,
  onQuestionsChange,
}: QuestionGroupManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<QuestionGroup | null>(null);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    pickQuestions: 0,
    questionsPerPage: 1,
  });

  const handleAddGroup = () => {
    setEditingGroup(null);
    setGroupForm({
      name: '',
      description: '',
      pickQuestions: 0,
      questionsPerPage: 1,
    });
    setShowModal(true);
  };

  const handleEditGroup = (group: QuestionGroup) => {
    setEditingGroup(group);
    setGroupForm({
      name: group.name,
      description: group.description || '',
      pickQuestions: group.pickQuestions || 0,
      questionsPerPage: group.questionsPerPage || 1,
    });
    setShowModal(true);
  };

  const handleSaveGroup = () => {
    const newGroup: QuestionGroup = {
      id: editingGroup?.id || `group-${Date.now()}`,
      name: groupForm.name,
      description: groupForm.description,
      pickQuestions: groupForm.pickQuestions,
      questionsPerPage: groupForm.questionsPerPage,
    };

    if (editingGroup) {
      // Edit existing group
      const updatedGroups = groups.map(g => 
        g.id === editingGroup.id ? newGroup : g
      );
      onGroupsChange(updatedGroups);
    } else {
      // Add new group
      onGroupsChange([...groups, newGroup]);
    }

    setShowModal(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group? Questions in this group will be moved to "Ungrouped".')) {
      // Remove group
      const updatedGroups = groups.filter(g => g.id !== groupId);
      onGroupsChange(updatedGroups);

      // Move questions from this group to ungrouped
      const updatedQuestions = questions.map(q => 
        q.groupId === groupId ? { ...q, groupId: undefined } : q
      );
      onQuestionsChange(updatedQuestions);
    }
  };

  const getQuestionsInGroup = (groupId?: string) => {
    return questions.filter(q => q.groupId === groupId);
  };

  const moveQuestionToGroup = (questionIndex: number, groupId?: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      groupId,
    };
    onQuestionsChange(updatedQuestions);
  };

  return (
    <div className="question-group-manager">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>
          <FaUsers className="me-2" />
          Question Groups
        </h5>
        <Button variant="outline-primary" size="sm" onClick={handleAddGroup}>
          <FaPlus className="me-1" />
          Add Group
        </Button>
      </div>

      {/* Ungrouped Questions */}
      <Card className="mb-3">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span>Ungrouped Questions</span>
            <Badge bg="secondary">{getQuestionsInGroup().length}</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {getQuestionsInGroup().map((question) => {
            const actualIndex = questions.findIndex(q => q === question);
            return (
              <div key={actualIndex} className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-truncate">
                  Q{actualIndex + 1}: {question.text || 'Untitled Question'}
                </span>
                <Form.Select
                  size="sm"
                  style={{ width: '200px' }}
                  value=""
                  onChange={(e) => moveQuestionToGroup(actualIndex, e.target.value || undefined)}
                >
                  <option value="">Move to group...</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </Form.Select>
              </div>
            );
          })}
          {getQuestionsInGroup().length === 0 && (
            <p className="text-muted mb-0">No ungrouped questions</p>
          )}
        </Card.Body>
      </Card>

      {/* Question Groups */}
      {groups.map(group => {
        const groupQuestions = getQuestionsInGroup(group.id);
        return (
          <Card key={group.id} className="mb-3">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{group.name}</strong>
                  {group.description && (
                    <small className="text-muted d-block">{group.description}</small>
                  )}
                  {group.pickQuestions && group.pickQuestions > 0 && (
                    <small className="text-info d-block">
                      Pick {group.pickQuestions} random questions
                    </small>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="primary">{groupQuestions.length}</Badge>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditGroup(group)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteGroup(group.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {groupQuestions.map((question) => {
                const actualIndex = questions.findIndex(q => q === question);
                return (
                  <div key={actualIndex} className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-truncate">
                      Q{actualIndex + 1}: {question.text || 'Untitled Question'}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => moveQuestionToGroup(actualIndex, undefined)}
                    >
                      Remove from group
                    </Button>
                  </div>
                );
              })}
              {groupQuestions.length === 0 && (
                <p className="text-muted mb-0">No questions in this group</p>
              )}
            </Card.Body>
          </Card>
        );
      })}

      {/* Group Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingGroup ? 'Edit Question Group' : 'Add Question Group'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                value={groupForm.name}
                onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                placeholder="Enter group name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={groupForm.description}
                onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
                placeholder="Enter group description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Random Question Selection</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={groupForm.pickQuestions}
                onChange={(e) => setGroupForm({...groupForm, pickQuestions: parseInt(e.target.value) || 0})}
              />
              <Form.Text className="text-muted">
                Set to 0 to include all questions, or enter a number to randomly pick that many questions from this group
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Questions Per Page</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={groupForm.questionsPerPage}
                onChange={(e) => setGroupForm({...groupForm, questionsPerPage: parseInt(e.target.value) || 1})}
              />
              <Form.Text className="text-muted">
                Number of questions from this group to show per page
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveGroup}
            disabled={!groupForm.name.trim()}
          >
            {editingGroup ? 'Update Group' : 'Add Group'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

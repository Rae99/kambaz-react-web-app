import { useState, useEffect } from 'react';
import * as client from './client';
import { ListGroup } from 'react-bootstrap';

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };
  const updateCompleted = async (id: string, completed: boolean) => {
    const todo = await client.updateCompleted(id, completed);
    setTodos(todos.map((t) => (t.id === id ? todo : t)));
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      <h4>Todos</h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <input
              type="checkbox"
              className="form-check-input me-2"
              defaultChecked={todo.completed}
              onChange={() => updateCompleted(todo.id, !todo.completed)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.title}{' '}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>{' '}
      <hr />
    </div>
  );
}

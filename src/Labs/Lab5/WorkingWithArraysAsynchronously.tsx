import { useState, useEffect } from 'react';
import * as client from './client';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { FaTrash } from 'react-icons/fa6';
import { FaPlusCircle } from 'react-icons/fa';
export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };
  const removeTodo = async (todo: any) => {
    const updatedTodos = await client.removeTodo(todo);
    setTodos(updatedTodos);
  };

  const updateCompleted = async (id: string, completed: boolean) => {
    try {
      const updatedTodos = await client.updateTodoCompleted(id, completed);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const createNewTodo = async () => {
    const todos = await client.createNewTodo();
    setTodos(todos);
  };

  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({ // <-- also a Promise
      title: 'New Posted Todo',
      completed: false,
    });
    setTodos([...todos, newTodo]);
  };
  // you’re not duplicating what the server sends back. Instead, you’re sending the title and completed status to the server so it can create that todo on its side.
  // what's inside the curly braces is the body of the POST request.
  // and this object is passed as an argument to client.postNewTodo(...).

  // Yes — exactly, it is a chain:
  // React component → client.ts function → Axios → HTTP → Express server → back again.

  

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      <h4>
        Todos{' '}
        <FaPlusCircle
          onClick={createNewTodo}
          className="text-success float-end fs-3"
        />
        <FaPlusCircle
          onClick={postNewTodo}
          className="text-primary float-end fs-3 me-3"
          id="wd-post-todo"
        />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <FaTrash
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1"
              id="wd-remove-todo"
            />
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={todo.completed}
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

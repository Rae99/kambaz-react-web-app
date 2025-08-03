import { useState, useEffect } from 'react';
import * as client from './client';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import { FaPlusCircle } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { FormControl } from 'react-bootstrap';
export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const editTodo = (todo: any) => {
    const updatedTodos = todos.map((t) =>
      t.id === todo.id ? { ...todo, editing: true } : t
    );
    setTodos(updatedTodos);
  };

  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };

  const removeTodo = async (todo: any) => {
    const updatedTodos = await client.removeTodo(todo);
    setTodos(updatedTodos);
  };

  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo); // The server is still called, but we don't wait for it to finish, and the response is ignored.
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };
  // A different approach than how we handle postNewTodo.
  // ⚠ This is called optimistic UI update — it assumes the server will succeed.

  // const updateCompleted = async (id: string, completed: boolean) => {
  //   try {
  //     const updatedTodos = await client.updateTodoCompleted(id, completed);
  //     setTodos(updatedTodos);
  //   } catch (error) {
  //     console.error('Error updating todo:', error);
  //   }
  // };

  const createNewTodo = async () => {
    const todos = await client.createNewTodo();
    setTodos(todos);
  };

  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({
      // <-- also a Promise
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
      {errorMessage && (
        <div
          id="wd-todo-error-message"
          className="alert alert-danger mb-2 mt-2"
        >
          {errorMessage}
        </div>
      )}
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
            <TiDelete
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end me-2 fs-3"
              id="wd-delete-todo"
            />
            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
            />

            <input
              type="checkbox"
              defaultChecked={todo.completed}
              className="form-check-input me-2"
              onChange={(e) =>
                updateTodo({ ...todo, completed: e.target.checked })
              }
            />
            {!todo.editing ? (
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.title}
              </span>
            ) : (
              <FormControl
                className="w-50"
                defaultValue={todo.title}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={(e) => updateTodo({ ...todo, title: e.target.value })}
              />
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>{' '}
      <hr />
    </div>
  );
}

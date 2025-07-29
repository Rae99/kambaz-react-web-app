import { useSelector } from "react-redux";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { ListGroup } from "react-bootstrap";

export default function TodoList() {
  const todos = useSelector((state: any) => state.todosReducer.todos);

  return (
    <div className="bg-white rounded shadow">
      <h2 className="fw-bold text-dark mb-3">Todo List</h2>
      <div className="bg-light rounded p-2 mb-2">
        <TodoForm />
      </div>
      <div className="bg-light rounded p-2">
        {todos.map((todo: any) => (
          <div key={todo.id} className="mb-1">
            <TodoItem todo={todo} />
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
}

// See notes.txt
// The user seems confused about how the update function works.
// There are two pieces of state: the todos array and the todo draft.
// When adding a new todo, addTodo generates a new item with a unique id
// and adds it to the list, then resets the draft.
// For updating an existing todo, updateTodo replaces the item in the array
// if the ids match.
// Clicking “Edit” simply loads the existing item into the draft,
// without duplicating it yet.
// However, if the draft id doesn’t match an existing todo, a duplication happens.

import { ListGroup } from "react-bootstrap";

const TodoItem = ({
  todo = { done: true, title: "Buy milk", status: "COMPLETED" }, // default value
}) => {
  // This uses destructuring to grab todo from props.
  // If todo is not passed, it defaults to a sample one (Buy milk etc).
  return (
    <ListGroup.Item>
      <input type="checkbox" className="me-2" defaultChecked={todo.done} />
      {todo.title} ({todo.status})
    </ListGroup.Item>
  );
};
export default TodoItem;

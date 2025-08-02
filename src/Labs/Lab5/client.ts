import axios from "axios";
const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
export const fetchWelcomeMessage = async () => {
  const response = await axios.get(`${HTTP_SERVER}/lab5/welcome`);
  return response.data;
};
const ASSIGNMENT_API = `${HTTP_SERVER}/lab5/assignment`;
export const fetchAssignment = async () => {const response = await axios.get(`${ASSIGNMENT_API}`);
return response.data;
};
export const updateTitle = async (title: string) => {
const response = await axios.get(`${ASSIGNMENT_API}/title/${title}`);
return response.data;
};

const TODOS_API = `${HTTP_SERVER}/lab5/todos`;
export const fetchTodos = async () => {
  const response = await axios.get(TODOS_API);
  return response.data;
};
export const updateTodoCompleted = async (id: string, completed: boolean) => {
  const response = await axios.get(`${TODOS_API}/${id}/completed/${completed}`);
  return response.data;
};
export const createNewTodo = async () => {
  const response = await axios.get(`${TODOS_API}/create`);
  return response.data;
};
export const postNewTodo = async (todo: any) => {
  const response = await axios.post(`${TODOS_API}`, todo); // <-- returns a Promise
  return response.data; // only runs after the request finishes
};
// the todo object is the body of the POST request.
// axios.post(url, body) automatically serializes(see note) that object to JSON and puts it in the HTTP request body.
// 	So the actual HTTP request looks like:
// POST /lab5/todos HTTP/1.1
// Host: localhost:4000
// Content-Type: application/json

// {
//   "title": "New Posted Todo",
//   "completed": false
// }

// 1. Why async is always needed here
  // The key is:
  // •	Network requests are asynchronous — they take time.
  // •	In JavaScript, axios.post() returns a Promise, not the final result.
// •	If you want to use await to pause until the Promise is resolved, the enclosing function must be declared async.
  




export const removeTodo = async (todo: any) => {
  const response = await axios.get(`${TODOS_API}/${todo.id}/delete`);
  return response.data;
};




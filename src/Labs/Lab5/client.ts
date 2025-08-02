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
export const updateCompleted = async (id: string, completed: boolean) => {
  const response = await axios.get(`${TODOS_API}/${id}/completed/${completed}`);
  return response.data;
};
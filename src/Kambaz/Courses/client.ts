import axios from "axios";
const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};

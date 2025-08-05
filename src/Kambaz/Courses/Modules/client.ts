import axios from "axios";
const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
export const deleteModule = async (moduleId: string) => {
 const response = await axios.delete(`${MODULES_API}/${moduleId}`);
 return response.data; };
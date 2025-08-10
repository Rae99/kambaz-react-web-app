import axios from "axios";

const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;

export const findAllEnrollments = async () => {
  const { data } = await axios.get(ENROLLMENTS_API);
  return data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const { data } = await axios.get(`${USERS_API}/${userId}/enrollments`);
  return data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/enrollments`);
  return data;
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

// export const enrollUserInCourse = async (userId: string, courseId: string) => {
//   const { data } = await axios.post(`${COURSES_API}/${courseId}/enroll/${userId}`);
//   return data;
// };

// export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
//   const { data } = await axios.delete(`${COURSES_API}/${courseId}/unenroll/${userId}`);
//   return data;
// };

export const checkEnrollmentStatus = async (userId: string, courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users/${userId}/enrollment`);
  return data;
};
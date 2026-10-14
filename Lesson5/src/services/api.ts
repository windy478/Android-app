import axios from 'axios';

const BASE_URL = 'https://6ace0103f338359cf1c2d9de.mockapi.io/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
});

export const api = {
  getCategories: () => apiClient.get('/categories'),
  getCourses: () => apiClient.get('/courses'),
  getCourseById: (id: string) => apiClient.get(`/courses/${id}`),
  addCourse: (data: any) => apiClient.post('/courses', data),
  updateCourse: (id: string, data: any) => apiClient.put(`/courses/${id}`, data),
  deleteCourse: (id: string) => apiClient.delete(`/courses/${id}`),
};
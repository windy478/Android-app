import axios from 'axios';

const BASE_URL = 'https://6ace0103f338359cf1c2d9de.mockapi.io/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const api = {
  getCategories: () => apiClient.get('/BIT240268_DishCategory'),
  addCategory: (data: any) => apiClient.post('/BIT240268_DishCategory', data),
  updateCategory: (id: string, data: any) => apiClient.put(`/BIT240268_DishCategory/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/BIT240268_DishCategory/${id}`),

  getDishes: () => apiClient.get('/BIT240268_Dish'),
  getDishById: (id: string) => apiClient.get(`/BIT240268_Dish/${id}`),
  addDish: (data: any) => apiClient.post('/BIT240268_Dish', data),
  updateDish: (id: string, data: any) => apiClient.put(`/BIT240268_Dish/${id}`, data),
  deleteDish: (id: string) => apiClient.delete(`/BIT240268_Dish/${id}`),
};
import axios from "axios"
import type { UserUI } from "../model/userModel"
import type { ProdUI } from "../model/prodModel"
import type { SlideUI } from "../model/slideModel";

export type Category = {
  _id: string
  name: string
  description?: string
}

const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: API_URL
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["ngrok-skip-browser-warning"] = "true"
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response 
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("Acesso negado ou expirado. Redirecionando...")
      localStorage.removeItem('token')
      
      if (!window.location.pathname.includes('/')) {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

//Funçoes de usuario

export async function getUsersService() {
  const response = await api.get(`/users`)
  return response.data
}

export async function getUserByName(data: { username: string }) {
  const response = await api.get(`/user/${data.username}`)
  return response.data
}

export const validateToken = async () => {
  const response = await api.get("/me")
  return response.data
}

export async function updateUserService(id: string, data: Partial<UserUI>) {
  const response = await api.patch(`/user/${id}`, data)
  return response.data
}

export async function loginUserService(username: string, password: string) {
  const response = await api.post(`/login`, { username, password })
  return response.data
}

export async function registerUserService(user: UserUI) {
  return await api.post(`/register`, user)
}


export async function deleteUserService(id: string) {
  return await api.delete(`/user/${id}`)
}

//Funçoes de produtos

export async function getProductsService(limit: number) {
  const response = await api.get(`/lista/prod`, {
    params: { limit }
  })
  return response.data
}

export async function getProdById(_id: string) {
  const response = await api.get(`/lista/prod/${_id}`)
  return response.data
}

export async function getProdByQuery(query: string) {
  const response = await api.get(`prod?search=${query}`)
  return response.data
}

export async function getFeatures() {
  const response = await api.get("/prod/feature")
  return response.data
}

export async function createProdService(data: ProdUI) {
  const response = await api.post(`/prod`, data)
  return response.data
}

export async function editProdService(_id: string, data: Partial<ProdUI>) {
  const response = await api.put(`/lista/prod/${_id}`, data)
  return response.data
}

export async function deleteProdService(_id: string) {
  return await api.delete(`/lista/prod/${_id}`)
}

export async function getOnSales() {
  return await api.get("/prod/on-sale")
}

//Funçoes de carinho

export async function getCartService() {
  const response = await api.get("/cart")
  return response.data
}

export async function addProductsService(data: { productId: string }) {
  const response = await api.post("/cart/add", data)
  return response.data
}

export async function decreItemService(productId: string) {
  return await api.patch("/cart/dec", { productId })
}

export async function clearCart() {
  await api.delete("/cart/clean")
}

//Paymentts functions

export async function getPayments() {
  const response = await api.get("/payments")
  return response.data
}

export async function getPaymentsbyID(id: string) {
   const response = await api.get(`/payments/${id}`)
   return response.data
}

export async function getPaymentsbyUser(userId: string) {
   const response = await api.get(`/payments/${userId}`)
   return response.data
}

export async function getMonthValue() {
  const response = await api.get("/payments/stats/monthly")
  return response.data
}

export async function bestSelling() {
  const response = await api.get("/best-selling")
  return response.data
}

export async function checkOut(items: any[]) {
  const response = await api.post("/payments/checkout", {items})
  return response.data
}

export async function getHistory() {
  const response = await api.get("/history")
  return response.data
}

//slides functions

export async function getCategoriesService(): Promise<Category[]> {
  const response = await api.get("/categories")
  return response.data
}

export const getSlidesService = async (showAll = false): Promise<SlideUI[]> => {
    // Caso queira trazer tudo do banco no painel, envia o parâmetro ?all=true
    const response = await api.get(`/slides${showAll ? '?all=true' : ''}`);
    return response.data;
};

export const createSlideService = async (data: Omit<SlideUI, '_id'>): Promise<SlideUI> => {
    const response = await api.post("/slides", data);
    return response.data;
};

export const editSlideService = async (id: string, data: Partial<SlideUI>): Promise<any> => {
    const response = await api.put(`/slides/${id}`, data);
    return response.data;
};

export const deleteSlideService = async (id: string): Promise<any> => {
    const response = await api.delete(`/slides/${id}`);
    return response.data;
};

// Favorites functions
export async function getFavoritesService(): Promise<string[]> {
    const response = await api.get("/favorites")
    return response.data
}

export async function toggleFavoriteService(productId: string) {
    const response = await api.post("/favorites/toggle", { productId })
    return response.data
}

export async function addFavoriteService(productId: string) {
    const response = await api.post("/favorites", { productId })
    return response.data
}

export async function removeFavoriteService(productId: string) {
    const response = await api.delete(`/favorites/${productId}`)
    return response.data
}

export async function checkFavoriteService(productId: string): Promise<boolean> {
    const response = await api.get(`/favorites/check/${productId}`)
    return response.data.isFavorite
}
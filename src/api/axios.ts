import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

export const axiosPrivate = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/client`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

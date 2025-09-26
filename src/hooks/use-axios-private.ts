import { axiosPrivate } from '@/api/axios'

import useRefreshToken from '@/hooks/use-refresh-token'

let isRefreshing = false
let refreshSubscribers: (() => void)[] = []

const processQueue = () => {
  refreshSubscribers.forEach((callback) => callback())
  refreshSubscribers = []
}

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(axiosPrivate(error.config)))
        })
      }

      error.config._retry = true
      isRefreshing = true

      try {
        const refresh = useRefreshToken()
        await refresh()
        processQueue()
        return axiosPrivate(error.config)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default axiosPrivate

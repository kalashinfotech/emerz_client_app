import axios from '@/api/axios'

const useRefreshToken = () => {
  const refresh = async () => {
    return await axios.get('/client/auth/refresh', { withCredentials: true })
  }

  return refresh
}

export default useRefreshToken

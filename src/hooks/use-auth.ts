import { useContext } from 'react'

import AuthContext from '@/context/auth-context'

const useAuth = () => {
  const authContext = useContext(AuthContext)
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }
  return authContext
}

export { useAuth }

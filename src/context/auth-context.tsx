import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'

import type { CreateParticipantRqDto, SessionInfo, SignInRq, SignInRs, TError } from '@/types'

import axios from '@/api/axios'

import axiosPrivate from '@/hooks/use-axios-private'

type SignOutResponse = {
  status?: number
}

export type AuthContextValue = {
  signUp: ({ emailId, firstName, lastName, tosAgreed, password, promoCode }: CreateParticipantRqDto) => Promise<SignInRs>
  signIn: ({ emailId, password, rememberMe }: SignInRq) => Promise<SignInRs>
  signOut: () => Promise<SignOutResponse>
  sessionInfo: SessionInfo | null
  setSessionInfo: (client: SessionInfo | null) => void
  authInitialized: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthenticationProvider(props: { children: ReactNode }) {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [authInitialized, setAuthInitialized] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const fetchProfile = async () => {
    if (!sessionInfo) {
      await axiosPrivate
        .get<SessionInfo, AxiosResponse<SessionInfo, TError>>('/participant/me', {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
        })
        .then((user) => {
          setSessionInfo(user.data)
        })
        .catch((error) => {
          console.error('Error in fetching user profile', error)
        })
        .finally(() => setAuthInitialized(true))
    }
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchProfile()
    }
    fetch()
  }, [])

  const logout = async (): Promise<SignOutResponse> => {
    try {
      await axios.get<null, AxiosResponse<null, TError>>(`${import.meta.env.VITE_BACKEND_URL}/client/auth/logout`, {
        withCredentials: true,
      })
      queryClient.invalidateQueries()
      return { status: 0 }
    } catch (error) {
      console.error('Error in logging out', error)
      return { status: -1 }
    } finally {
      setSessionInfo(null)
    }
  }
  const signUp = async (request: CreateParticipantRqDto): Promise<SignInRs> => {
    try {
      const response = await axios.post<null, AxiosResponse<null, TError>>(
        `${import.meta.env.VITE_BACKEND_URL}/client/participant`,
        request,
      )
      return { status: response.status, error: undefined }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          const err = error as AxiosError<TError>
          return { status: -1, error: err.response?.data.error.message }
        } else if (error.request) {
          return {
            status: -1,
            error: `An unexpected error (${error.code}) ocurred. Please try after sometime.`,
          }
        }
      }
      return {
        status: -1,
        error: `Something went terribly wrong (${JSON.stringify(error)}). Please contact support.`,
      }
    }
  }

  const signIn = async ({ emailId, password, rememberMe }: SignInRq): Promise<SignInRs> => {
    const config = { withCredentials: true }
    try {
      const user = await axios.post<null, AxiosResponse<null, TError>>(
        `${import.meta.env.VITE_BACKEND_URL}/client/auth`,
        { emailId, password, rememberMe },
        config,
      )
      await fetchProfile()
      return { status: user.status, error: undefined }
    } catch (error) {
      setSessionInfo(null)
      if (isAxiosError(error)) {
        if (error.response) {
          const err = error as AxiosError<TError>
          return { status: -1, error: err.response?.data.error.message }
        } else if (error.request) {
          return {
            status: -1,
            error: `An unexpected error (${error.code}) ocurred. Please try after sometime.`,
          }
        }
      }
      return {
        status: -1,
        error: `Something went terribly wrong (${JSON.stringify(error)}). Please contact support.`,
      }
    }
  }
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: logout,
        signUp,
        sessionInfo,
        setSessionInfo,
        authInitialized,
      }}>
      {authInitialized ? props.children : null}
    </AuthContext.Provider>
  )
}

export default AuthContext

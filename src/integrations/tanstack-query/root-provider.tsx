import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, err) => {
          if ((err.response?.status || 0) < 500) {
            return false
          }

          const defaultRetry = new QueryClient().getDefaultOptions().queries?.retry

          return Number.isSafeInteger(defaultRetry) ? failureCount < Number(defaultRetry) : false
        },
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

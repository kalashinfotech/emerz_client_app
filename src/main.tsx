import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from 'sonner'

import { useAuth } from '@/hooks/use-auth'

import { AuthenticationProvider } from '@/context/auth-context'
import { ThemeProvider } from '@/context/theme-context'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { routeTree } from './routeTree.gen'
// Import the generated route tree

import './styles.css'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  scrollRestorationBehavior: 'smooth',
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const InnerApp = () => {
  const auth = useAuth()
  return (
    <>
      <RouterProvider router={router} context={{ auth, ...TanStackQueryProvider }} />
      <Toaster />
    </>
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AuthenticationProvider>
          <ThemeProvider>
            <InnerApp />
          </ThemeProvider>
        </AuthenticationProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

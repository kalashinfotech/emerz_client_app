import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtools } from '@tanstack/react-form-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import type { AuthContextValue } from '@/context/auth-context'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContextValue
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackDevtools
        plugins={[
          {
            name: 'TanStack Query',
            render: <ReactQueryDevtoolsPanel />,
          },
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: 'TanStack Form',
            render: <FormDevtools />,
          },
        ]}
      />
    </>
  ),
})

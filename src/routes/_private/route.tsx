import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import type { FallbackProps } from 'react-error-boundary'

import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { SidebarProvider } from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/blocks/app-sidebar'
import { ErrorPage } from '@/components/blocks/error-page'
import Header from '@/components/blocks/header'
import LoadingPage from '@/components/blocks/loading-page'
import { MinimalFooter } from '@/components/blocks/minimal-footer'

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  return <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
}

export const Route = createFileRoute('/_private')({
  beforeLoad: ({ context }) => {
    if (context.auth.authInitialized && !context.auth.sessionInfo) {
      throw redirect({ to: '/login', search: { redirect: location.pathname } })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <Header />
        <div className="min-h-[calc(100vh-6rem)] w-full pb-4">
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Suspense fallback={<LoadingPage />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
        <MinimalFooter />
      </main>
    </SidebarProvider>
  )
}

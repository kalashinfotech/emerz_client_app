import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="from-background via-background dark:to-primary-700/30 to-primary-100/30 flex min-h-screen w-full bg-radial-[at_50%_75%] to-90% md:h-screen">
        <div className="flex h-full w-full items-center justify-center py-18 md:py-0">
          <Outlet />
        </div>
      </div>
    </>
  )
}

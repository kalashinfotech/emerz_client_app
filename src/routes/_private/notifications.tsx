import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="p-8">Hello "/_private/notifications"!</div>
}

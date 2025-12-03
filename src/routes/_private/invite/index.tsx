import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/invite/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/invite/"!</div>
}

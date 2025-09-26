import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/disclaimer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/disclaimer"!</div>
}

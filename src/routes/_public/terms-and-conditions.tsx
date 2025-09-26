import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/terms-and-conditions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/terms-and-conditions"!</div>
}

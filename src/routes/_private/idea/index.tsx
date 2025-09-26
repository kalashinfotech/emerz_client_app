import { createFileRoute } from '@tanstack/react-router'

import { Container } from '@/components/elements/container'

export const Route = createFileRoute('/_private/idea/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Container title="Idea">Listing All Ideas</Container>
}

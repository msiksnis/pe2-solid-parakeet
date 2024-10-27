import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/venue/$id')({
  component: () => <div>Hello /venue/$id!</div>,
})

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manage-reservations')({
  component: () => <div>Hello /manage-reservations!</div>,
})

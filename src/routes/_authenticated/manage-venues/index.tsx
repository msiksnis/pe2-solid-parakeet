import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/manage-venues/')({
  component: () => <div>Hello /_authenticated/manage-venues/!</div>,
})

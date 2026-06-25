import * as React from "react"

const listeners = new Set()
let toasts = []
let toastId = 0

function notify() {
  listeners.forEach((listener) => listener([...toasts]))
}

export function toast({ title, description, variant = "default", action, duration = 4000 }) {
  const id = `toast-${++toastId}`
  const toastItem = {
    id,
    title,
    description,
    variant,
    action,
  }

  toasts = [...toasts, toastItem]
  notify()

  if (duration > 0) {
    window.setTimeout(() => {
      toasts = toasts.filter((item) => item.id !== id)
      notify()
    }, duration)
  }

  return id
}

export function useToast() {
  const [state, setState] = React.useState(toasts)

  React.useEffect(() => {
    const listener = (nextToasts) => setState(nextToasts)
    listeners.add(listener)
    listener(toasts)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return { toasts: state }
}

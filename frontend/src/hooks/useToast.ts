// src/hooks/use-toast.ts
import * as React from "react"
import type { ToastProps } from "@/components/ui/toast"

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const TOAST_LIMIT = 1

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

// Estado interno SEMPRE tem id
type ToastInternal = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

// Entrada pública (id opcional)
export type ToastInput = Omit<ToastInternal, "id"> & {
  id?: string
}

type Action =
  | { type: "ADD"; toast: ToastInternal }
  | { type: "UPDATE"; toast: Partial<ToastInternal> & { id: string } }
  | { type: "DISMISS"; toastId?: string }
  | { type: "REMOVE"; toastId?: string }

interface State {
  toasts: ToastInternal[]
}

/* -------------------------------------------------------------------------- */
/*                                  Reducer                                   */
/* -------------------------------------------------------------------------- */

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          action.toastId === undefined || t.id === action.toastId
            ? { ...t, open: false }
            : t
        ),
      }

    case "REMOVE":
      return {
        ...state,
        toasts:
          action.toastId === undefined
            ? []
            : state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

/* -------------------------------------------------------------------------- */
/*                              Store in memory                               */
/* -------------------------------------------------------------------------- */

let memoryState: State = { toasts: [] }
const listeners = new Set<(state: State) => void>()

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

/* -------------------------------------------------------------------------- */
/*                                   Hook                                     */
/* -------------------------------------------------------------------------- */

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  const toast = React.useCallback((input: ToastInput) => {
    const id = input.id ?? crypto.randomUUID()

    dispatch({
      type: "ADD",
      toast: {
        ...input,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dispatch({ type: "DISMISS", toastId: id })
          }
        },
      },
    })

    return {
      id,
      dismiss: () => dispatch({ type: "DISMISS", toastId: id }),
      update: (data: ToastInput) =>
        dispatch({ type: "UPDATE", toast: { id, ...data } }),
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS", toastId }),
    remove: (toastId?: string) =>
      dispatch({ type: "REMOVE", toastId }),
  }
}

export { reducer }

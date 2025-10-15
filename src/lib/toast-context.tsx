"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, message, type }

    setToasts(prev => [...prev, newToast])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  )

  const error = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast]
  )

  const info = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast]
  )

  const warning = useCallback(
    (message: string) => showToast(message, "warning"),
    [showToast]
  )

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          text: "text-green-900",
          icon: CheckCircle2,
          iconColor: "text-green-600",
        }
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-900",
          icon: AlertCircle,
          iconColor: "text-red-600",
        }
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-900",
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
        }
      case "info":
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-900",
          icon: Info,
          iconColor: "text-blue-600",
        }
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}

      {/* Toast Container */}
      <div
        className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end gap-3 p-4 sm:p-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(toast => {
          const styles = getToastStyles(toast.type)
          const Icon = styles.icon

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${styles.bg} p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full`}
              role="alert"
            >
              <Icon className={`h-5 w-5 shrink-0 ${styles.iconColor}`} />
              <p className={`flex-1 text-sm font-medium ${styles.text}`}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 ${styles.text}`}
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

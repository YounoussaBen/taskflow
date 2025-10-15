"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, AlertTriangle } from "lucide-react"
import { Task } from "@/lib/types"

interface DeleteTaskDialogProps {
  task: Task
  onClose: () => void
}

export default function DeleteTaskDialog({
  task,
  onClose,
}: DeleteTaskDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to delete task")
        return
      }

      router.refresh()
      onClose()
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h2 className="text-xl font-semibold">Delete Task</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-secondary transition-colors hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-secondary">
            Are you sure you want to delete the task:{" "}
            <span className="font-medium text-foreground">
              &quot;{task.title}&quot;
            </span>
            ?
          </p>
          <p className="mt-2 text-sm text-secondary">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-destructive px-4 py-2 font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Task } from "@/lib/types"
import { getUsers } from "@/lib/data"

interface EditTaskDialogProps {
  task: Task
  onClose: () => void
}

export default function EditTaskDialog({ task, onClose }: EditTaskDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState(task.title)
  const [assignedTo, setAssignedTo] = useState(task.assignedTo)
  const [status, setStatus] = useState(task.status)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const users = getUsers()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          assignedTo,
          status,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update task")
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
      <div className="w-full max-w-md rounded-lg bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-secondary transition-colors hover:bg-background hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground"
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-foreground"
            >
              Assign To
            </label>
            <select
              id="assignedTo"
              required
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {users.map(user => (
                <option key={user.email} value={user.email}>
                  {user.email} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground"
            >
              Status
            </label>
            <select
              id="status"
              required
              value={status}
              onChange={e =>
                setStatus(e.target.value as "pending" | "in_progress" | "done")
              }
              className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

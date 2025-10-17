"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Task } from "@/lib/types"
import { getUsersSync } from "@/lib/data-client"
import MenuSelect from "./menu-select"
import StatusSelect from "./status-select"
import { useToast } from "@/lib/toast-context"

interface EditTaskDialogProps {
  task: Task
  onClose: () => void
}

export default function EditTaskDialog({ task, onClose }: EditTaskDialogProps) {
  const router = useRouter()
  const { success, error: showErrorToast } = useToast()
  const [title, setTitle] = useState(task.title)
  const [assignedTo, setAssignedTo] = useState(task.assignedTo)
  const [status, setStatus] = useState(task.status)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const users = getUsersSync()

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
        const errorMsg = data.error || "Failed to update task"
        setError(errorMsg)
        showErrorToast(errorMsg)
        return
      }

      success("Task updated successfully")
      router.refresh()
      onClose()
    } catch (err) {
      const errorMsg = "An error occurred. Please try again."
      setError(errorMsg)
      showErrorToast(errorMsg)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Task</h2>
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
            <div className="mt-1">
              <MenuSelect
                value={assignedTo}
                onChange={setAssignedTo}
                options={users.map(u => ({
                  value: u.email,
                  label: `${u.email} (${u.role})`,
                }))}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground"
            >
              Status
            </label>
            <div className="mt-1">
              <StatusSelect value={status} onChange={setStatus} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Task, TaskStatus } from "@/lib/types"
import StatusSelect from "./status-select"
import { useToast } from "@/lib/toast-context"

interface TaskStatusSelectorProps {
  task: Task
  projectOwner: string
}

export default function TaskStatusSelector({ task }: TaskStatusSelectorProps) {
  const router = useRouter()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleStatusChange(newStatus: TaskStatus) {
    if (newStatus === task.status) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Failed to update status:", data.error)
        error(data.error || "Failed to update task status")
        return
      }

      const statusLabel = newStatus.replace("_", " ")
      success(`Task status updated to ${statusLabel}`)
      router.refresh()
    } catch (err) {
      console.error("Error updating status:", err)
      error("An error occurred while updating task status")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500/10 text-green-700"
      case "in_progress":
        return "bg-blue-500/10 text-blue-700"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700"
      default:
        return "bg-foreground/5 text-foreground"
    }
  }

  return (
    <div className={`rounded-full ${getStatusClasses(task.status)}`}>
      <StatusSelect
        value={task.status}
        onChange={v => handleStatusChange(v as TaskStatus)}
        disabled={isLoading}
      />
    </div>
  )
}

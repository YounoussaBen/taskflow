"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Task, TaskStatus } from "@/lib/types"

interface TaskStatusSelectorProps {
  task: Task
  projectOwner: string
}

export default function TaskStatusSelector({ task }: TaskStatusSelectorProps) {
  const router = useRouter()
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

      if (!response.ok) {
        const data = await response.json()
        console.error("Failed to update status:", data.error)
        return
      }

      router.refresh()
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <select
      value={task.status}
      onChange={e => handleStatusChange(e.target.value as TaskStatus)}
      disabled={isLoading}
      className={`rounded-lg border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 ${getStatusColor(task.status)}`}
    >
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  )
}

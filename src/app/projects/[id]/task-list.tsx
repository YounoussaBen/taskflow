"use client"

import { Task, Session } from "@/lib/types"
import { useState } from "react"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react"
import TaskStatusSelector from "./task-status-selector"
import EditTaskDialog from "./edit-task-dialog"
import DeleteTaskDialog from "./delete-task-dialog"

interface TaskListProps {
  tasks: Task[]
  session: Session
  projectOwner: string
  canManage: boolean
}

export default function TaskList({
  tasks,
  session,
  projectOwner,
  canManage,
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-secondary" />
        <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
        <p className="mt-2 text-secondary">
          {canManage
            ? "Create your first task to get started."
            : "Tasks will appear here when they are created."}
        </p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const canEdit = () => {
    if (session.role === "admin") return true
    if (session.role === "manager" && session.email === projectOwner)
      return true
    return false
  }

  const canDelete = () => {
    if (session.role === "admin") return true
    if (session.role === "manager" && session.email === projectOwner)
      return true
    return false
  }

  const canUpdateStatus = (task: Task) => {
    if (session.role === "admin") return true
    if (session.role === "manager" && session.email === projectOwner)
      return true
    if (session.role === "member" && task.assignedTo === session.email)
      return true
    return false
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:border-accent/50"
          >
            <div className="flex flex-1 items-center gap-4">
              {getStatusIcon(task.status)}
              <div className="flex-1">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-secondary">
                  Assigned to: {task.assignedTo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {canUpdateStatus(task) && (
                <TaskStatusSelector task={task} projectOwner={projectOwner} />
              )}

              {(canEdit() || canDelete()) && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === task.id ? null : task.id)
                    }
                    className="rounded-md p-2 text-secondary transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {openMenuId === task.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface shadow-lg">
                        {canEdit() && (
                          <button
                            onClick={() => {
                              setEditingTask(task)
                              setOpenMenuId(null)
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-background"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Task
                          </button>
                        )}
                        {canDelete() && (
                          <button
                            onClick={() => {
                              setDeletingTask(task)
                              setOpenMenuId(null)
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-destructive transition-colors hover:bg-background"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Task
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {deletingTask && (
        <DeleteTaskDialog
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
        />
      )}
    </>
  )
}

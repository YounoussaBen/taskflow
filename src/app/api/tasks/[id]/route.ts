import { NextRequest, NextResponse } from "next/server"
import { requireAuth, canEditTask, canDeleteTask } from "@/lib/auth"
import {
  getTaskById,
  updateTask,
  deleteTask as deleteTaskData,
  getProjectById,
} from "@/lib/data"
import { TaskStatus } from "@/lib/types"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await requireAuth()
    const { id } = await context.params
    const taskId = parseInt(id, 10)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const task = await getTaskById(taskId)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const project = await getProjectById(task.projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check permissions
    if (
      !canEditTask(session.role, session.email, task.assignedTo, project.owner)
    ) {
      return NextResponse.json(
        { error: "You don't have permission to edit this task" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, assignedTo, status } = body

    const updates: Partial<{
      title: string
      assignedTo: string
      status: TaskStatus
    }> = {}

    if (title !== undefined) updates.title = title
    if (assignedTo !== undefined) updates.assignedTo = assignedTo
    if (status !== undefined) updates.status = status as TaskStatus

    const updatedTask = await updateTask(taskId, updates)

    if (!updatedTask) {
      return NextResponse.json(
        { error: "Failed to update task" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, task: updatedTask })
  } catch (error) {
    console.error("Update task error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "An error occurred while updating the task" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await requireAuth()
    const { id } = await context.params
    const taskId = parseInt(id, 10)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const task = await getTaskById(taskId)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const project = await getProjectById(task.projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check permissions
    if (!canDeleteTask(session.role, session.email, project.owner)) {
      return NextResponse.json(
        { error: "You don't have permission to delete this task" },
        { status: 403 }
      )
    }

    const success = await deleteTaskData(taskId)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete task error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "An error occurred while deleting the task" },
      { status: 500 }
    )
  }
}

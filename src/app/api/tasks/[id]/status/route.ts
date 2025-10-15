import { NextRequest, NextResponse } from "next/server"
import { requireAuth, canUpdateTaskStatus } from "@/lib/auth"
import { getTaskById, updateTaskStatus, getProjectById } from "@/lib/data"
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
      !canUpdateTaskStatus(
        session.role,
        session.email,
        task.assignedTo,
        project.owner
      )
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this task's status" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !["pending", "in_progress", "done"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updatedTask = await updateTaskStatus(taskId, status as TaskStatus)

    if (!updatedTask) {
      return NextResponse.json(
        { error: "Failed to update task status" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, task: updatedTask })
  } catch (error) {
    console.error("Update task status error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "An error occurred while updating the task status" },
      { status: 500 }
    )
  }
}

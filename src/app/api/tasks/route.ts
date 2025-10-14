import { NextRequest, NextResponse } from "next/server"
import { requireAuth, canCreateTask } from "@/lib/auth"
import { createTask, getProjectById } from "@/lib/data"
import { TaskStatus } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { projectId, title, assignedTo, status } = body

    if (!projectId || !title || !assignedTo || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = getProjectById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check permissions
    if (!canCreateTask(session.role, project.owner, session.email)) {
      return NextResponse.json(
        { error: "You don't have permission to create tasks in this project" },
        { status: 403 }
      )
    }

    const newTask = createTask({
      projectId,
      title,
      assignedTo,
      status: status as TaskStatus,
    })

    return NextResponse.json({ success: true, task: newTask }, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "An error occurred while creating the task" },
      { status: 500 }
    )
  }
}

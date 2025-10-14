import { requireAuth, canManageProject, canCreateTask } from "@/lib/auth"
import { getProjectById, getTasksByProject } from "@/lib/data"
import Navbar from "@/components/navbar"
import { notFound } from "next/navigation"
import TaskList from "./task-list"
import CreateTaskButton from "./create-task-button"
import { Folder, User } from "lucide-react"

export const dynamic = "force-dynamic"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const session = await requireAuth()

  const projectId = parseInt(id, 10)
  if (isNaN(projectId)) {
    notFound()
  }

  const project = getProjectById(projectId)
  if (!project) {
    notFound()
  }

  const tasks = getTasksByProject(projectId)
  const canManage = canManageProject(session.email, session.role, project.owner)
  const canCreate = canCreateTask(session.role, project.owner, session.email)

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="mb-8 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10">
                <Folder className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="mt-2 text-secondary">{project.description}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-secondary">
                  <User className="h-4 w-4" />
                  <span>Owner: {project.owner}</span>
                </div>
              </div>
            </div>

            {canCreate && <CreateTaskButton projectId={projectId} />}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <span className="text-sm text-secondary">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          <TaskList
            tasks={tasks}
            session={session}
            projectOwner={project.owner}
            canManage={canManage}
          />
        </div>
      </main>
    </div>
  )
}

import { requireAuth, canManageProject, canCreateTask } from "@/lib/auth"
import {
  getProjectById,
  getTasksByProject,
  getTaskStatsByProject,
} from "@/lib/data"
import Sidebar from "@/components/sidebar"
import TopbarMobile from "@/components/topbar-mobile"
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
  const taskStats = getTaskStatsByProject(projectId)
  const canManage = canManageProject(session.email, session.role, project.owner)
  const canCreate = canCreateTask(session.role, project.owner, session.email)

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-dvh md:flex">
        <Sidebar session={session} />

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <TopbarMobile />
          {/* Project Header */}
          <div className="mb-8 rounded-2xl bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10">
                  <Folder className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{project.name}</h1>
                  <p className="mt-2 text-secondary">{project.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-secondary">
                    <span className="inline-flex items-center gap-2">
                      <User className="h-4 w-4" /> Owner: {project.owner}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 font-medium text-yellow-700">
                      Pending {taskStats.pending}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 font-medium text-blue-700">
                      In progress {taskStats.inProgress}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 font-medium text-green-700">
                      Done {taskStats.done}
                    </span>
                  </div>
                </div>
              </div>

              {canCreate && <CreateTaskButton projectId={projectId} />}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="rounded-2xl bg-surface p-6">
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
    </div>
  )
}

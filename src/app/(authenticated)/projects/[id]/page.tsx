import { requireAuth, canManageProject, canCreateTask } from "@/lib/auth"
import {
  getProjectById,
  getTasksByProject,
  getTaskStatsByProject,
} from "@/lib/data"
import { notFound } from "next/navigation"
import TaskList from "./task-list"
import CreateTaskButton from "./create-task-button"
import { Folder, User } from "lucide-react"

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

  const project = await getProjectById(projectId)
  if (!project) {
    notFound()
  }

  const tasks = await getTasksByProject(projectId)
  const taskStats = await getTaskStatsByProject(projectId)
  const canManage = canManageProject(session.email, session.role, project.owner)
  const canCreate = canCreateTask(session.role, project.owner, session.email)

  return (
    <>
      {/* Project Header */}
      <div className="mb-8 rounded-2xl bg-surface p-4 sm:p-6">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left section: Icon + Info */}
          <div className="flex gap-3 sm:gap-4">
            {/* Folder icon - smaller on mobile, hidden on very small screens */}
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 xs:flex sm:h-16 sm:w-16">
              <Folder className="h-6 w-6 text-accent sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold sm:text-3xl">{project.name}</h1>
              <p className="mt-1 text-sm text-secondary sm:mt-2 sm:text-base">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
                <span className="inline-flex items-center gap-1.5 text-secondary sm:gap-2">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Owner: </span>
                  {project.owner}
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

          {/* Create Task button - full width on mobile, auto on desktop */}
          {canCreate && (
            <div className="w-full sm:w-auto sm:shrink-0">
              <CreateTaskButton projectId={projectId} />
            </div>
          )}
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
    </>
  )
}

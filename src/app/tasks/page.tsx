import { requireAuth } from "@/lib/auth"
import { getTasks, getProjects } from "@/lib/data"
import Sidebar from "@/components/sidebar"
import TopbarMobile from "@/components/topbar-mobile"
import Link from "next/link"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Folder,
  ArrowRight,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const session = await requireAuth()
  const allTasks = getTasks()
  const projects = getProjects()

  // Filter tasks based on user role
  let tasks = allTasks
  if (session.role === "member") {
    // Members can only see their own tasks
    tasks = allTasks.filter(task => task.assignedTo === session.email)
  } else if (session.role === "manager") {
    // Managers can see tasks in their projects
    const managerProjects = projects
      .filter(p => p.owner === session.email)
      .map(p => p.id)
    tasks = allTasks.filter(task => managerProjects.includes(task.projectId))
  }
  // Admin sees all tasks

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || "Unknown Project"
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

  const getStatusColor = (status: string) => {
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
    <div className="min-h-screen bg-background">
      <div className="min-h-dvh md:flex">
        <Sidebar session={session} />

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <TopbarMobile />
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="mt-2 text-secondary">
              {session.role === "member"
                ? "View and manage your assigned tasks"
                : session.role === "manager"
                  ? "Manage tasks in your projects"
                  : "View and manage all tasks"}
            </p>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl bg-surface p-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-secondary" />
              <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
              <p className="mt-2 text-secondary">
                {session.role === "member"
                  ? "You don't have any tasks assigned to you yet."
                  : "No tasks available. Create a task in a project to get started."}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface p-6">
              <ul className="space-y-1">
                {tasks.map(task => (
                  <li key={task.id}>
                    <Link
                      href={`/projects/${task.projectId}`}
                      className="group flex items-center justify-between rounded-lg p-4 sm:p-5 transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent/40"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <span className="shrink-0">
                          {getStatusIcon(task.status)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="truncate text-base font-semibold md:text-lg group-hover:text-accent">
                              {task.title}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium md:text-xs ${getStatusColor(task.status)}`}
                            >
                              {task.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-secondary">
                            <span className="inline-flex items-center gap-1">
                              <Folder className="h-4 w-4" />
                              <span className="truncate">
                                {getProjectName(task.projectId)}
                              </span>
                            </span>
                            <span className="hidden text-secondary sm:inline">
                              •
                            </span>
                            <span className="truncate">{task.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="ml-3 h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

import { requireAuth } from "@/lib/auth"
import { getTasks, getProjects } from "@/lib/data"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

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
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-secondary" />
            <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
            <p className="mt-2 text-secondary">
              {session.role === "member"
                ? "You don't have any tasks assigned to you yet."
                : "No tasks available. Create a task in a project to get started."}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tasks.map(task => (
                    <tr
                      key={task.id}
                      className="transition-colors hover:bg-background/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <span className="font-medium">{task.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        <Link
                          href={`/projects/${task.projectId}`}
                          className="hover:text-accent hover:underline"
                        >
                          {getProjectName(task.projectId)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {task.assignedTo}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/projects/${task.projectId}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

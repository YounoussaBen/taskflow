import { requireAuth } from "@/lib/auth"
import { getProjects, getTaskStats, getTasksByAssignee } from "@/lib/data"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, ListTodo } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await requireAuth()
  const projects = getProjects()
  const taskStats = getTaskStats()
  const myTasks = getTasksByAssignee(session.email)

  const myPendingTasks = myTasks.filter(t => t.status === "pending")
  const myInProgressTasks = myTasks.filter(t => t.status === "in_progress")
  const myDoneTasks = myTasks.filter(t => t.status === "done")

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-secondary">
            Welcome back, {session.email.split("@")[0]}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  Total Tasks
                </p>
                <p className="mt-2 text-3xl font-bold">{taskStats.total}</p>
              </div>
              <ListTodo className="h-8 w-8 text-accent" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">Pending</p>
                <p className="mt-2 text-3xl font-bold">{taskStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  In Progress
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {taskStats.inProgress}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">Completed</p>
                <p className="mt-2 text-3xl font-bold">{taskStats.done}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Projects */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {projects.length === 0 ? (
              <p className="text-secondary">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block rounded-lg border border-border bg-background p-4 transition-colors hover:border-accent"
                  >
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="mt-1 text-sm text-secondary">
                      {project.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* My Tasks */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <Link
                href="/tasks"
                className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {myTasks.length === 0 ? (
              <p className="text-secondary">No tasks assigned to you.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-secondary">
                    Pending ({myPendingTasks.length})
                  </h3>
                  {myPendingTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className="mb-2 rounded-lg border border-border bg-background p-3"
                    >
                      <p className="text-sm">{task.title}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium text-secondary">
                    In Progress ({myInProgressTasks.length})
                  </h3>
                  {myInProgressTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className="mb-2 rounded-lg border border-border bg-background p-3"
                    >
                      <p className="text-sm">{task.title}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium text-secondary">
                    Done ({myDoneTasks.length})
                  </h3>
                  {myDoneTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className="mb-2 rounded-lg border border-border bg-background p-3"
                    >
                      <p className="text-sm">{task.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

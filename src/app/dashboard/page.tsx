import { requireAuth } from "@/lib/auth"
import {
  getProjects,
  getTasksByAssignee,
  getProjectsByOwner,
  getTasks,
} from "@/lib/data"
import Navbar from "@/components/navbar"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Folder,
  TrendingUp,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await requireAuth()
  const projects = getProjects()
  const myTasks = getTasksByAssignee(session.email)
  const myProjects = getProjectsByOwner(session.email)
  const allTasks = getTasks()

  const myPendingTasks = myTasks.filter(t => t.status === "pending")
  const myInProgressTasks = myTasks.filter(t => t.status === "in_progress")
  const myDoneTasks = myTasks.filter(t => t.status === "done")

  // Calculate completion rate
  const completionRate =
    myTasks.length > 0
      ? Math.round((myDoneTasks.length / myTasks.length) * 100)
      : 0

  // Get role-specific stats
  const roleStats =
    session.role === "admin"
      ? {
          label: "Total System Tasks",
          value: allTasks.length,
          icon: Target,
        }
      : session.role === "manager"
        ? {
            label: "My Projects",
            value: myProjects.length,
            icon: Folder,
          }
        : {
            label: "Tasks Assigned",
            value: myTasks.length,
            icon: Target,
          }

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

        {/* Stats Grid - Personalized for User */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  {roleStats.label}
                </p>
                <p className="mt-2 text-3xl font-bold">{roleStats.value}</p>
              </div>
              <roleStats.icon className="h-8 w-8 text-accent" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  Pending Tasks
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {myPendingTasks.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  In Progress Tasks
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {myInProgressTasks.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  Completed Tasks
                </p>
                <p className="mt-2 text-3xl font-bold">{myDoneTasks.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Personalized Progress Chart */}
        <div className="mb-8 rounded-lg border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Progress</h2>
              <p className="mt-1 text-sm text-secondary">
                Track your task completion rate
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span className="text-2xl font-bold text-accent">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-green-700">
                  Completed Tasks
                </span>
                <span className="text-secondary">
                  {myDoneTasks.length} of {myTasks.length}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${myTasks.length > 0 ? (myDoneTasks.length / myTasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-blue-700">
                  In Progress Tasks
                </span>
                <span className="text-secondary">
                  {myInProgressTasks.length} of {myTasks.length}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${myTasks.length > 0 ? (myInProgressTasks.length / myTasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-yellow-700">
                  Pending Tasks
                </span>
                <span className="text-secondary">
                  {myPendingTasks.length} of {myTasks.length}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{
                    width: `${myTasks.length > 0 ? (myPendingTasks.length / myTasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          {myTasks.length > 0 && (
            <div className="mt-6 rounded-lg bg-background p-4">
              <p className="text-sm text-secondary">
                {completionRate === 100 ? (
                  <span className="font-medium text-green-700">
                    🎉 Excellent work! All your tasks are completed!
                  </span>
                ) : completionRate >= 70 ? (
                  <span className="font-medium text-blue-700">
                    💪 Great progress! You&apos;re almost there!
                  </span>
                ) : myInProgressTasks.length > 0 ? (
                  <span className="font-medium text-yellow-700">
                    ⚡ Keep going! You have {myInProgressTasks.length} task
                    {myInProgressTasks.length > 1 ? "s" : ""} in progress.
                  </span>
                ) : (
                  <span className="font-medium text-secondary">
                    📋 You have {myPendingTasks.length} pending task
                    {myPendingTasks.length > 1 ? "s" : ""} to start working on.
                  </span>
                )}
              </p>
            </div>
          )}
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

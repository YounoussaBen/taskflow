import { requireAuth } from "@/lib/auth"
import {
  getProjects,
  getTasksByAssignee,
  getProjectsByOwner,
  getTasks,
} from "@/lib/data"
import Sidebar from "@/components/sidebar"
import TopbarMobile from "@/components/topbar-mobile"
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
  // Compute role-aware projects list
  let projects = getProjects()
  const myTasks = getTasksByAssignee(session.email)
  if (session.role === "manager") {
    projects = getProjectsByOwner(session.email)
  } else if (session.role === "member") {
    const allowedIds = new Set(myTasks.map(t => t.projectId))
    projects = projects.filter(p => allowedIds.has(p.id))
  }
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
      ? { label: "Total System Tasks", value: allTasks.length, icon: Target }
      : session.role === "manager"
        ? { label: "My Projects", value: myProjects.length, icon: Folder }
        : { label: "Tasks Assigned", value: myTasks.length, icon: Target }

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-dvh md:flex">
        <Sidebar session={session} />

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <TopbarMobile />
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-secondary">
              Welcome back, {session.email.split("@")[0]}!
            </p>
          </div>

          {/* Stats Grid - Personalized for User */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-surface p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    {roleStats.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold">{roleStats.value}</p>
                </div>
                {(() => {
                  const Icon = roleStats.icon
                  return <Icon className="h-8 w-8 text-accent" />
                })()}
              </div>
            </div>

            <div className="rounded-2xl bg-surface p-6">
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

            <div className="rounded-2xl bg-surface p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    In Progress Tasks
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {myInProgressTasks.length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="rounded-2xl bg-surface p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Completed Tasks
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {myDoneTasks.length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Personalized Progress Chart */}
          <div className="mb-8 rounded-2xl bg-surface p-6">
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
              <div className="mt-6 rounded-xl bg-background p-4">
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
                      {myPendingTasks.length > 1 ? "s" : ""} to start working
                      on.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Content Columns */}
          <div className="grid gap-8 xl:grid-cols-3">
            {/* Projects */}
            <div className="rounded-2xl bg-surface p-6 xl:col-span-1">
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
                <ul className="space-y-1">
                  {projects.map(project => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.id}`}
                        className="group flex items-start justify-between rounded-lg p-3 transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent/40"
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-accent/10">
                            <Folder className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-medium group-hover:text-accent">
                              {project.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-secondary">
                              {project.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* My Tasks */}
            <div className="rounded-2xl bg-surface p-6 xl:col-span-2">
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
                (() => {
                  const order: Record<string, number> = {
                    in_progress: 0,
                    pending: 1,
                    done: 2,
                  }
                  const myTasksSorted = [...myTasks].sort(
                    (a, b) => order[a.status] - order[b.status]
                  )
                  return (
                    <ul className="space-y-1">
                      {myTasksSorted.slice(0, 6).map(task => {
                        const projectName =
                          projects.find(p => p.id === task.projectId)?.name ||
                          "Project"
                        const meta =
                          task.status === "pending"
                            ? {
                                label: "Pending",
                                chipClass: "bg-yellow-500/10 text-yellow-700",
                                Icon: Clock,
                                iconWrapClass: "bg-yellow-500/10",
                                iconClass: "text-yellow-500",
                              }
                            : task.status === "in_progress"
                              ? {
                                  label: "In progress",
                                  chipClass: "bg-blue-500/10 text-blue-700",
                                  Icon: Target,
                                  iconWrapClass: "bg-blue-500/10",
                                  iconClass: "text-blue-500",
                                }
                              : {
                                  label: "Done",
                                  chipClass: "bg-green-500/10 text-green-700",
                                  Icon: CheckCircle2,
                                  iconWrapClass: "bg-green-500/10",
                                  iconClass: "text-green-500",
                                }

                        const StatusIcon = meta.Icon
                        return (
                          <li key={task.id}>
                            <div className="flex items-start justify-between rounded-lg p-3 transition-colors hover:bg-background">
                              <div className="flex gap-3">
                                <div
                                  className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-md ${meta.iconWrapClass}`}
                                >
                                  <StatusIcon
                                    className={`h-4 w-4 ${meta.iconClass}`}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    {task.title}
                                  </p>
                                  <p className="text-xs text-secondary">
                                    {projectName}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.chipClass}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {meta.label}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )
                })()
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

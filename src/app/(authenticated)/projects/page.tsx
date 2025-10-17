import { requireAuth } from "@/lib/auth"
import {
  getProjects,
  getTaskStatsByProject,
  getTasksByAssignee,
} from "@/lib/data"
import Link from "next/link"
import { Folder, User, ArrowRight, TrendingUp } from "lucide-react"

export default async function ProjectsPage() {
  const session = await requireAuth()
  const allProjects = await getProjects()

  // Filter projects based on role
  let projects = allProjects
  if (session.role === "manager") {
    // Managers see only their own projects
    projects = allProjects.filter(p => p.owner === session.email)
  } else if (session.role === "member") {
    // Members see only projects that contain tasks assigned to them
    const myTasks = await getTasksByAssignee(session.email)
    const allowedIds = new Set(myTasks.map(t => t.projectId))
    projects = allProjects.filter(p => allowedIds.has(p.id))
  }

  // Fetch stats for all projects
  const projectStats = await Promise.all(
    projects.map(p => getTaskStatsByProject(p.id))
  )

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-secondary">
            {session.role === "admin"
              ? "Manage all projects and tasks"
              : session.role === "manager"
                ? "Manage your projects and tasks"
                : "Browse projects and tasks"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent"
          >
            <TrendingUp className="h-4 w-4" /> View Tasks
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl bg-surface p-12 text-center">
          <Folder className="mx-auto h-12 w-12 text-secondary" />
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="mt-2 text-secondary">
            {session.role === "manager"
              ? "You don't have any projects yet."
              : "No projects available at the moment."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface p-6">
          <ul className="space-y-1">
            {projects.map((project, index) => {
              const stats = projectStats[index]
              return (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="group flex items-start justify-between rounded-lg p-3 transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-md bg-accent/10">
                        <Folder className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold group-hover:text-accent">
                          {project.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-secondary">
                          {project.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-secondary">
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3.5 w-3.5" /> {project.owner}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 font-medium text-yellow-700">
                            Pending {stats.pending}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 font-medium text-blue-700">
                            In progress {stats.inProgress}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 font-medium text-green-700">
                            Done {stats.done}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}

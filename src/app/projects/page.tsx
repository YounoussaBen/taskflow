import { requireAuth } from "@/lib/auth"
import { getProjects } from "@/lib/data"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { Folder, User, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const session = await requireAuth()
  const allProjects = getProjects()

  // Filter projects based on role
  let projects = allProjects
  if (session.role === "manager") {
    // Managers see only their own projects
    projects = allProjects.filter(p => p.owner === session.email)
  }
  // Admin and members see all projects

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-secondary">
            {session.role === "admin"
              ? "Manage all projects and tasks"
              : session.role === "manager"
                ? "Manage your projects and tasks"
                : "View projects and your assigned tasks"}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <Folder className="mx-auto h-12 w-12 text-secondary" />
            <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
            <p className="mt-2 text-secondary">
              {session.role === "manager"
                ? "You don't have any projects yet."
                : "No projects available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-lg border border-border bg-surface p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Folder className="h-6 w-6 text-accent" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-secondary transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </div>

                <h3 className="mb-2 text-xl font-semibold group-hover:text-accent">
                  {project.name}
                </h3>

                <p className="mb-4 text-sm text-secondary line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-secondary">
                  <User className="h-4 w-4" />
                  <span>{project.owner}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

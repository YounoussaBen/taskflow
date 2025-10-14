import { requireRole } from "@/lib/auth"
import { getUsers, getTaskStats } from "@/lib/data"
import Navbar from "@/components/navbar"
import UserRoleManager from "./user-role-manager"
import { Users, ListTodo, CheckCircle2, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  // Only admins can access this page
  const session = await requireRole(["admin"])
  const users = getUsers()
  const taskStats = getTaskStats()

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="mt-2 text-secondary">
            Manage users, roles, and view system analytics
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  Total Users
                </p>
                <p className="mt-2 text-3xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </div>

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
              <AlertCircle className="h-8 w-8 text-yellow-500" />
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

        {/* Task Progress */}
        <div className="mb-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold">Task Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Completed</span>
                <span className="text-secondary">
                  {taskStats.done} / {taskStats.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{
                    width: `${taskStats.total > 0 ? (taskStats.done / taskStats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">In Progress</span>
                <span className="text-secondary">
                  {taskStats.inProgress} / {taskStats.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${taskStats.total > 0 ? (taskStats.inProgress / taskStats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Pending</span>
                <span className="text-secondary">
                  {taskStats.pending} / {taskStats.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full bg-yellow-500 transition-all"
                  style={{
                    width: `${taskStats.total > 0 ? (taskStats.pending / taskStats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Management</h2>
            <span className="text-sm text-secondary">
              {users.length} {users.length === 1 ? "user" : "users"}
            </span>
          </div>

          <UserRoleManager users={users} />
        </div>
      </main>
    </div>
  )
}

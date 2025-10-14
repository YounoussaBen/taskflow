"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Role } from "@/lib/types"
import { Shield, User as UserIcon } from "lucide-react"

interface UserRoleManagerProps {
  users: User[]
}

export default function UserRoleManager({ users }: UserRoleManagerProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function handleRoleChange(email: string, newRole: Role) {
    setError("")
    setIsUpdating(email)

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update user role")
        return
      }

      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsUpdating(null)
    }
  }

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "member":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                User
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Current Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Change Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr
                key={user.email}
                className="transition-colors hover:bg-background/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <UserIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-secondary">
                        {user.email.split("@")[0]}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                  >
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={e =>
                      handleRoleChange(user.email, e.target.value as Role)
                    }
                    disabled={isUpdating === user.email}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="member">Member</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Descriptions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            <h3 className="font-semibold text-red-800">Admin</h3>
          </div>
          <p className="text-sm text-secondary">
            Full system access. Can manage all projects, tasks, and users.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold text-blue-800">Manager</h3>
          </div>
          <p className="text-sm text-secondary">
            Can create and manage tasks in their own projects only.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold text-green-800">Member</h3>
          </div>
          <p className="text-sm text-secondary">
            Can view projects and update status of their assigned tasks.
          </p>
        </div>
      </div>
    </div>
  )
}

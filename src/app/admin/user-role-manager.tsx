"use client"

import type { Role, User } from "@/lib/types"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import MenuSelect from "../projects/[id]/menu-select"
import { useToast } from "@/lib/toast-context"

type Props = { users: User[] }

export default function UserRoleManager({ users }: Props) {
  const [localUsers, setLocalUsers] = useState<User[]>(users)
  const [savingEmail, setSavingEmail] = useState<string | null>(null)
  const { success, error } = useToast()

  const roles: Role[] = ["admin", "manager", "member"]

  function initials(email: string) {
    const name = email.split("@")[0]
    const parts = name.split(/[._-]/).filter(Boolean)
    const chars =
      parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
    return chars.toUpperCase()
  }

  const handleRoleChange = async (email: string, role: Role) => {
    setSavingEmail(email)

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        error(data.error || "Failed to update user role")
        return
      }

      // Update local UI state on success
      setLocalUsers(prev =>
        prev.map(u => (u.email === email ? { ...u, role } : u))
      )
      success(`User role updated to ${role}`)
    } catch (err) {
      console.error("Error updating user role:", err)
      error("An error occurred while updating user role")
    } finally {
      setSavingEmail(null)
    }
  }

  return (
    <div className="divide-y divide-border rounded-2xl bg-surface">
      {localUsers.map(user => (
        <div
          key={user.email}
          className="group flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/10 sm:px-6 sm:py-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/40 text-xs font-semibold">
                {initials(user.email)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{user.email}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium">
              <span
                className={
                  user.role === "admin"
                    ? "h-2 w-2 rounded-full bg-purple-500"
                    : user.role === "manager"
                      ? "h-2 w-2 rounded-full bg-blue-500"
                      : "h-2 w-2 rounded-full bg-green-500"
                }
              />
              {user.role}
            </div>
            <div className="w-36">
              <MenuSelect
                value={user.role}
                onChange={val => handleRoleChange(user.email, val as Role)}
                options={roles.map(r => ({ label: r, value: r }))}
              />
            </div>
            {savingEmail === user.email && (
              <Loader2 className="h-4 w-4 animate-spin text-secondary" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

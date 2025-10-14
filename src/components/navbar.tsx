"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Session } from "@/lib/types"
import { LogOut, User } from "lucide-react"

interface NavbarProps {
  session: Session
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/projects", label: "Projects" },
    { href: "/tasks", label: "Tasks" },
  ]

  // Only show Admin link for admin role
  if (session.role === "admin") {
    navLinks.push({ href: "/admin", label: "Admin" })
  }

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold">
              TaskFlow
            </Link>

            <div className="flex gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-background"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-foreground-secondary" />
              <span className="text-foreground">{session.email}</span>
              <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                {session.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

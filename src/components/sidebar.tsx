"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Session } from "@/lib/types"
import {
  X,
  LogOut,
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Shield,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useEffect, useState, type ComponentType } from "react"

interface SidebarProps {
  session: Session
}

export default function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  type LinkItem = {
    href: string
    label: string
    icon: ComponentType<{ className?: string }>
  }
  const links: LinkItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: ListChecks },
  ]

  if (session.role === "admin") {
    links.push({ href: "/admin", label: "Admin", icon: Shield })
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (e) {
      console.error("Logout error", e)
    }
  }

  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    function onOpenRequest() {
      setOpen(true)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("taskflow:openSidebar", onOpenRequest)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("taskflow:openSidebar", onOpenRequest)
    }
  }, [])

  const NavLinks = () => (
    <nav className="mt-4 space-y-1">
      {links.map(l => {
        const active = pathname === l.href
        const Icon = l.icon
        return (
          <Link
            key={l.href}
            href={l.href}
            title={l.label}
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-background"
            }`}
            onClick={() => setOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {!collapsed && <span>{l.label}</span>}
            {collapsed && <span className="sr-only">{l.label}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar (collapsible) */}
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface px-4 py-5 transition-[width] duration-300 md:flex ${collapsed ? "w-20 min-w-20" : "w-[18rem] min-w-[18rem]"}`}
        aria-label="Primary navigation"
      >
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} px-2`}
        >
          <Image
            src="/logo.png"
            alt="TaskFlow logo"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-contain"
          />
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">
              TaskFlow
            </span>
          )}
        </div>
        <NavLinks />
        <div className="mt-auto space-y-3 px-2">
          {!collapsed && (
            <div className="rounded-xl bg-background p-3 text-xs text-foreground-secondary">
              <div className="font-medium text-foreground">{session.email}</div>
              <div className="mt-1 inline-flex rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
                {session.role}
              </div>
            </div>
          )}
          <div
            className={`flex ${collapsed ? "flex-col items-center gap-2" : "items-center gap-2"}`}
          >
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed(v => !v)}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background/90 p-2 text-foreground hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <ChevronsLeft className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className={`inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent ${collapsed ? "h-9 w-9" : "px-4 py-2 text-sm font-medium"}`}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 z-0 bg-black/20 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute left-0 top-0 z-10 h-full w-72 border-r border-border bg-surface px-4 py-5 transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="TaskFlow"
                width={24}
                height={24}
                className="h-6 w-6 rounded"
              />
              <span className="text-base font-semibold">TaskFlow</span>
            </div>
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full p-2 text-foreground hover:bg-background"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <NavLinks />
          <div className="mt-auto space-y-3 px-2 pt-6">
            <div className="rounded-xl bg-background p-3 text-xs text-foreground-secondary">
              <div className="font-medium text-foreground">{session.email}</div>
              <div className="mt-1 inline-flex rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
                {session.role}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

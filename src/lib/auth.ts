import { cookies } from "next/headers"
import { getUserByEmail } from "./data"
import { Session, Role } from "./types"

const SESSION_COOKIE_NAME = "taskflow_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Session management using cookies

export async function createSession(email: string, role: Role): Promise<void> {
  const session: Session = { email, role }
  const cookieStore = await cookies()

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: JSON.stringify(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie?.value) {
      return null
    }

    const session: Session = JSON.parse(sessionCookie.value)
    return session
  } catch (error) {
    console.error("Error parsing session:", error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<Session | null> {
  const user = getUserByEmail(email)

  if (!user || user.password !== password) {
    return null
  }

  return {
    email: user.email,
    role: user.role,
  }
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  return session
}

export async function requireRole(allowedRoles: Role[]): Promise<Session> {
  const session = await requireAuth()

  if (!allowedRoles.includes(session.role)) {
    throw new Error("Forbidden")
  }

  return session
}

// Helper function to check if user is authenticated (for client-side)
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

// RBAC permission checks
export function canManageProject(
  userEmail: string,
  userRole: Role,
  projectOwner: string
): boolean {
  // Admin can manage all projects
  if (userRole === "admin") return true

  // Manager can manage their own projects
  if (userRole === "manager" && userEmail === projectOwner) return true

  return false
}

export function canCreateTask(
  userRole: Role,
  projectOwner: string,
  userEmail: string
): boolean {
  // Admin can create tasks in any project
  if (userRole === "admin") return true

  // Manager can create tasks in their own projects
  if (userRole === "manager" && userEmail === projectOwner) return true

  return false
}

export function canEditTask(
  userRole: Role,
  userEmail: string,
  taskAssignedTo: string,
  projectOwner: string
): boolean {
  // Admin can edit all tasks
  if (userRole === "admin") return true

  // Manager can edit tasks in their own projects
  if (userRole === "manager" && userEmail === projectOwner) return true

  // Member can only mark their own tasks as done (status update only)
  // This is handled separately in canUpdateTaskStatus
  return false
}

export function canDeleteTask(
  userRole: Role,
  userEmail: string,
  projectOwner: string
): boolean {
  // Admin can delete all tasks
  if (userRole === "admin") return true

  // Manager can delete tasks in their own projects
  if (userRole === "manager" && userEmail === projectOwner) return true

  return false
}

export function canUpdateTaskStatus(
  userRole: Role,
  userEmail: string,
  taskAssignedTo: string,
  projectOwner: string
): boolean {
  // Admin can update all task statuses
  if (userRole === "admin") return true

  // Manager can update task statuses in their own projects
  if (userRole === "manager" && userEmail === projectOwner) return true

  // Member can update status of their own tasks
  if (userRole === "member" && userEmail === taskAssignedTo) return true

  return false
}

export function canAccessAdminPanel(userRole: Role): boolean {
  return userRole === "admin"
}

export function canManageUsers(userRole: Role): boolean {
  return userRole === "admin"
}

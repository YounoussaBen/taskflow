export type Role = "admin" | "manager" | "member"

export type TaskStatus = "pending" | "in_progress" | "done"

export interface User {
  email: string
  password: string
  role: Role
}

export interface Project {
  id: number
  name: string
  description: string
  owner: string
}

export interface Task {
  id: number
  projectId: number
  title: string
  assignedTo: string
  status: TaskStatus
}

export interface Session {
  email: string
  role: Role
}

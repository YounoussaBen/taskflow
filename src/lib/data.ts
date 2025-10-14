import { User, Project, Task, Role, TaskStatus } from "./types"
import usersData from "@/data/users.json"
import projectsData from "@/data/projects.json"
import tasksData from "@/data/tasks.json"

// In-memory data stores
const users: User[] = usersData as User[]
const projects: Project[] = projectsData as Project[]
let tasks: Task[] = tasksData as Task[]

// User operations
export function getUsers(): User[] {
  return users
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email)
}

export function updateUserRole(email: string, role: Role): User | null {
  const userIndex = users.findIndex(u => u.email === email)
  if (userIndex === -1) return null

  users[userIndex] = { ...users[userIndex], role }
  return users[userIndex]
}

// Project operations
export function getProjects(): Project[] {
  return projects
}

export function getProjectById(id: number): Project | undefined {
  return projects.find(p => p.id === id)
}

export function getProjectsByOwner(ownerEmail: string): Project[] {
  return projects.filter(p => p.owner === ownerEmail)
}

export function createProject(project: Omit<Project, "id">): Project {
  const newId = Math.max(...projects.map(p => p.id), 0) + 1
  const newProject: Project = { ...project, id: newId }
  projects.push(newProject)
  return newProject
}

export function updateProject(
  id: number,
  updates: Partial<Omit<Project, "id">>
): Project | null {
  const projectIndex = projects.findIndex(p => p.id === id)
  if (projectIndex === -1) return null

  projects[projectIndex] = { ...projects[projectIndex], ...updates }
  return projects[projectIndex]
}

export function deleteProject(id: number): boolean {
  const projectIndex = projects.findIndex(p => p.id === id)
  if (projectIndex === -1) return false

  projects.splice(projectIndex, 1)
  // Also delete all tasks associated with this project
  tasks = tasks.filter(t => t.projectId !== id)
  return true
}

// Task operations
export function getTasks(): Task[] {
  return tasks
}

export function getTaskById(id: number): Task | undefined {
  return tasks.find(t => t.id === id)
}

export function getTasksByProject(projectId: number): Task[] {
  return tasks.filter(t => t.projectId === projectId)
}

export function getTasksByAssignee(assignedTo: string): Task[] {
  return tasks.filter(t => t.assignedTo === assignedTo)
}

export function createTask(task: Omit<Task, "id">): Task {
  const newId = Math.max(...tasks.map(t => t.id), 0) + 1
  const newTask: Task = { ...task, id: newId }
  tasks.push(newTask)
  return newTask
}

export function updateTask(
  id: number,
  updates: Partial<Omit<Task, "id">>
): Task | null {
  const taskIndex = tasks.findIndex(t => t.id === id)
  if (taskIndex === -1) return null

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
  return tasks[taskIndex]
}

export function deleteTask(id: number): boolean {
  const taskIndex = tasks.findIndex(t => t.id === id)
  if (taskIndex === -1) return false

  tasks.splice(taskIndex, 1)
  return true
}

export function updateTaskStatus(id: number, status: TaskStatus): Task | null {
  return updateTask(id, { status })
}

// Analytics operations
export function getTaskStats(): {
  total: number
  pending: number
  inProgress: number
  done: number
} {
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  }
}

export function getTaskStatsByProject(projectId: number): {
  total: number
  pending: number
  inProgress: number
  done: number
} {
  const projectTasks = getTasksByProject(projectId)
  return {
    total: projectTasks.length,
    pending: projectTasks.filter(t => t.status === "pending").length,
    inProgress: projectTasks.filter(t => t.status === "in_progress").length,
    done: projectTasks.filter(t => t.status === "done").length,
  }
}

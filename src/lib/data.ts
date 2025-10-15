import { User, Project, Task, Role, TaskStatus } from "./types"
import usersData from "@/data/users.json"
import projectsData from "@/data/projects.json"
import tasksData from "@/data/tasks.json"
import {
  getFromKV,
  setInKV,
  USERS_KEY,
  PROJECTS_KEY,
  TASKS_KEY,
  initializeKV,
} from "./redis-store"

// Using globalThis to prevent reinitialization during development
declare global {
  var appData:
    | {
        users: User[]
        projects: Project[]
        tasks: Task[]
      }
    | undefined
  var kvInitialized: boolean | undefined
}

if (!globalThis.appData) {
  globalThis.appData = {
    users: usersData as User[],
    projects: projectsData as Project[],
    tasks: tasksData as Task[],
  }
}

// Initialize KV on first import
if (!globalThis.kvInitialized) {
  globalThis.kvInitialized = true
  initializeKV().catch(() => {
    // Silently fail if KV is not available
  })
}

// Helper to determine if we should use Redis (production) or in-memory (development)
const useKV = process.env.NODE_ENV === "production" && process.env.REDIS_URL

// User operations
export async function getUsers(): Promise<User[]> {
  if (useKV) {
    return await getFromKV(USERS_KEY, globalThis.appData!.users)
  }
  return globalThis.appData!.users
}

export function getUserByEmail(email: string): User | undefined {
  return globalThis.appData!.users.find(u => u.email === email)
}

// Synchronous version for client components (uses in-memory data only)
export function getUsersSync(): User[] {
  return globalThis.appData!.users
}

export async function updateUserRole(
  email: string,
  role: Role
): Promise<User | null> {
  const users = await getUsers()
  const userIndex = users.findIndex(u => u.email === email)
  if (userIndex === -1) return null

  users[userIndex] = { ...users[userIndex], role }

  if (useKV) {
    await setInKV(USERS_KEY, users)
  } else {
    globalThis.appData!.users = users
  }

  return users[userIndex]
}

// Project operations
export async function getProjects(): Promise<Project[]> {
  if (useKV) {
    return await getFromKV(PROJECTS_KEY, globalThis.appData!.projects)
  }
  return globalThis.appData!.projects
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  const projects = await getProjects()
  return projects.find(p => p.id === id)
}

export async function getProjectsByOwner(
  ownerEmail: string
): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(p => p.owner === ownerEmail)
}

export async function createProject(
  project: Omit<Project, "id">
): Promise<Project> {
  const projects = await getProjects()
  const newId = Math.max(...projects.map(p => p.id), 0) + 1
  const newProject: Project = { ...project, id: newId }
  projects.push(newProject)

  if (useKV) {
    await setInKV(PROJECTS_KEY, projects)
  } else {
    globalThis.appData!.projects = projects
  }

  return newProject
}

export async function updateProject(
  id: number,
  updates: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  const projects = await getProjects()
  const projectIndex = projects.findIndex(p => p.id === id)
  if (projectIndex === -1) return null

  projects[projectIndex] = { ...projects[projectIndex], ...updates }

  if (useKV) {
    await setInKV(PROJECTS_KEY, projects)
  } else {
    globalThis.appData!.projects = projects
  }

  return projects[projectIndex]
}

export async function deleteProject(id: number): Promise<boolean> {
  const projects = await getProjects()
  const tasks = await getTasks()

  const projectIndex = projects.findIndex(p => p.id === id)
  if (projectIndex === -1) return false

  projects.splice(projectIndex, 1)

  // Also delete all tasks associated with this project
  const updatedTasks = tasks.filter(t => t.projectId !== id)

  if (useKV) {
    await setInKV(PROJECTS_KEY, projects)
    await setInKV(TASKS_KEY, updatedTasks)
  } else {
    globalThis.appData!.projects = projects
    globalThis.appData!.tasks = updatedTasks
  }

  return true
}

// Task operations
export async function getTasks(): Promise<Task[]> {
  if (useKV) {
    return await getFromKV(TASKS_KEY, globalThis.appData!.tasks)
  }
  return globalThis.appData!.tasks
}

export async function getTaskById(id: number): Promise<Task | undefined> {
  const tasks = await getTasks()
  return tasks.find(t => t.id === id)
}

export async function getTasksByProject(projectId: number): Promise<Task[]> {
  const tasks = await getTasks()
  return tasks.filter(t => t.projectId === projectId)
}

export async function getTasksByAssignee(assignedTo: string): Promise<Task[]> {
  const tasks = await getTasks()
  return tasks.filter(t => t.assignedTo === assignedTo)
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  const tasks = await getTasks()
  const newId = Math.max(...tasks.map(t => t.id), 0) + 1
  const newTask: Task = { ...task, id: newId }
  tasks.push(newTask)

  if (useKV) {
    await setInKV(TASKS_KEY, tasks)
  } else {
    globalThis.appData!.tasks = tasks
  }

  return newTask
}

export async function updateTask(
  id: number,
  updates: Partial<Omit<Task, "id">>
): Promise<Task | null> {
  const tasks = await getTasks()
  const taskIndex = tasks.findIndex(t => t.id === id)
  if (taskIndex === -1) return null

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates }

  if (useKV) {
    await setInKV(TASKS_KEY, tasks)
  } else {
    globalThis.appData!.tasks = tasks
  }

  return tasks[taskIndex]
}

export async function deleteTask(id: number): Promise<boolean> {
  const tasks = await getTasks()
  const taskIndex = tasks.findIndex(t => t.id === id)
  if (taskIndex === -1) return false

  tasks.splice(taskIndex, 1)

  if (useKV) {
    await setInKV(TASKS_KEY, tasks)
  } else {
    globalThis.appData!.tasks = tasks
  }

  return true
}

export async function updateTaskStatus(
  id: number,
  status: TaskStatus
): Promise<Task | null> {
  return updateTask(id, { status })
}

// Analytics operations
export async function getTaskStats(): Promise<{
  total: number
  pending: number
  inProgress: number
  done: number
}> {
  const tasks = await getTasks()
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  }
}

export async function getTaskStatsByProject(projectId: number): Promise<{
  total: number
  pending: number
  inProgress: number
  done: number
}> {
  const projectTasks = await getTasksByProject(projectId)
  return {
    total: projectTasks.length,
    pending: projectTasks.filter(t => t.status === "pending").length,
    inProgress: projectTasks.filter(t => t.status === "in_progress").length,
    done: projectTasks.filter(t => t.status === "done").length,
  }
}

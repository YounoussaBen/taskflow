import "server-only"
import { createClient } from "redis"
import type { RedisClientType } from "redis"
import usersData from "@/data/users.json"
import projectsData from "@/data/projects.json"
import tasksData from "@/data/tasks.json"

const USERS_KEY = "taskflow:users"
const PROJECTS_KEY = "taskflow:projects"
const TASKS_KEY = "taskflow:tasks"

// Singleton Redis client for serverless environments
let redis: RedisClientType | null = null
let isConnecting = false

async function getRedisClient(): Promise<RedisClientType | null> {
  // Return null if no Redis URL configured (local development)
  if (!process.env.REDIS_URL) {
    return null
  }

  // Return existing client if already connected
  if (redis?.isOpen) {
    return redis
  }

  // Wait if connection is in progress
  if (isConnecting) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return getRedisClient()
  }

  try {
    isConnecting = true
    redis = createClient({ url: process.env.REDIS_URL })

    redis.on("error", err => {
      console.error("Redis Client Error:", err)
    })

    await redis.connect()
    isConnecting = false
    return redis
  } catch (error) {
    console.error("Failed to connect to Redis:", error)
    isConnecting = false
    return null
  }
}

// Initialize Redis with seed data if not exists
export async function initializeRedis() {
  const client = await getRedisClient()
  if (!client) return

  try {
    const usersExist = await client.exists(USERS_KEY)
    if (!usersExist) {
      await client.set(USERS_KEY, JSON.stringify(usersData))
      await client.set(PROJECTS_KEY, JSON.stringify(projectsData))
      await client.set(TASKS_KEY, JSON.stringify(tasksData))
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If Redis is not available (e.g., local development without Redis setup),
    // silently fail and fallback to in-memory storage
    console.log("Redis not available, using in-memory storage")
  }
}

// Helper to check if Redis is available
export async function isRedisAvailable(): Promise<boolean> {
  const client = await getRedisClient()
  if (!client) return false

  try {
    await client.ping()
    return true
  } catch {
    return false
  }
}

// Redis operations
export async function getFromRedis<T>(key: string, fallback: T): Promise<T> {
  const client = await getRedisClient()
  if (!client) return fallback

  try {
    const data = await client.get(key)
    if (!data) return fallback
    return JSON.parse(data) as T
  } catch {
    return fallback
  }
}

export async function setInRedis<T>(key: string, value: T): Promise<void> {
  const client = await getRedisClient()
  if (!client) return

  try {
    await client.set(key, JSON.stringify(value))
  } catch (error) {
    console.error("Failed to set in Redis:", error)
  }
}

// Export keys for use in data.ts
export { USERS_KEY, PROJECTS_KEY, TASKS_KEY }

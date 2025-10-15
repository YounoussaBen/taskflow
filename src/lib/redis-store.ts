import { Redis } from "@upstash/redis"
import usersData from "@/data/users.json"
import projectsData from "@/data/projects.json"
import tasksData from "@/data/tasks.json"

const USERS_KEY = "taskflow:users"
const PROJECTS_KEY = "taskflow:projects"
const TASKS_KEY = "taskflow:tasks"

// Initialize Redis client - parse REDIS_URL from Vercel or use Upstash env vars
function getRedisClient() {
  // Try Upstash environment variables first
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return Redis.fromEnv()
  }

  // Parse Vercel REDIS_URL
  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL)
    const token = url.password
    const restUrl = `https://${url.hostname}`

    return new Redis({
      url: restUrl,
      token: token,
    })
  }

  // Return a dummy client if no Redis is configured (local development)
  throw new Error("No Redis configuration found")
}

let redis: Redis | null
try {
  redis = getRedisClient()
} catch {
  // Redis not available in local development
  redis = null
}

// Initialize Redis with seed data if not exists
export async function initializeKV() {
  if (!redis) return

  try {
    const usersExist = await redis.exists(USERS_KEY)
    if (!usersExist) {
      await redis.set(USERS_KEY, usersData)
      await redis.set(PROJECTS_KEY, projectsData)
      await redis.set(TASKS_KEY, tasksData)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If Redis is not available (e.g., local development without Redis setup),
    // silently fail and fallback to in-memory storage
    console.log("KV not available, using in-memory storage")
  }
}

// Helper to check if Redis is available
export async function isKVAvailable(): Promise<boolean> {
  if (!redis) return false

  try {
    await redis.ping()
    return true
  } catch {
    return false
  }
}

// Redis operations
export async function getFromKV<T>(key: string, fallback: T): Promise<T> {
  if (!redis) return fallback

  try {
    const data = await redis.get<T>(key)
    return data || fallback
  } catch {
    return fallback
  }
}

export async function setInKV<T>(key: string, value: T): Promise<void> {
  if (!redis) return

  try {
    await redis.set(key, value)
  } catch (error) {
    console.error("Failed to set in KV:", error)
  }
}

// Export keys for use in data.ts
export { USERS_KEY, PROJECTS_KEY, TASKS_KEY }

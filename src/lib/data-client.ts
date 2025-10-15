import type { User } from "./types"
import usersData from "@/data/users.json"

// For client components - uses in-memory seed data
// NOTE: This doesn't sync with Redis, only used for UI dropdowns
export function getUsersSync(): User[] {
  return usersData as User[]
}

export function getUserByEmailSync(email: string): User | undefined {
  return (usersData as User[]).find(u => u.email === email)
}

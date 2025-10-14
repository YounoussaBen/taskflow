import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await getSession()

  // Redirect to dashboard if authenticated, otherwise to login
  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}

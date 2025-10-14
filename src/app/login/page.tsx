import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import LoginForm from "./login-form"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  // Redirect to dashboard if already logged in
  const session = await getSession()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">TaskFlow</h1>
          <p className="mt-2 text-secondary">Sign in to your account</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

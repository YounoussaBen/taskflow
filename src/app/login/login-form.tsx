"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Mail, Lock, ChevronRight } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid credentials")
        return
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-6" noValidate>
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading ? "Signing in" : "Idle"}
      </div>

      <div aria-live="assertive">
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Email address
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground-secondary">
              <Mail size={18} aria-hidden="true" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-0 block w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-foreground placeholder-foreground-secondary outline-none ring-0 transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground-secondary">
              <Lock size={18} aria-hidden="true" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-0 block w-full rounded-full border border-border bg-background py-3 pl-10 pr-12 text-foreground placeholder-foreground-secondary outline-none ring-0 transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-1 inline-flex items-center rounded-full p-2 text-foreground-secondary transition-colors hover:bg-surface hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            defaultChecked
          />
          Remember me
        </label>
        <a href="#" className="text-xs font-medium text-accent hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-medium text-accent-foreground outline-none transition-colors hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        <span>{isLoading ? "Signing in…" : "Login"}</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}

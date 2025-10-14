import Image from "next/image"
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
    <main className="grid min-h-dvh grid-cols-1 bg-background lg:grid-cols-2">
      {/* Left: auth card */}
      <section className="relative flex items-center justify-center p-6 sm:p-8 lg:pt-28">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:absolute lg:left-8 lg:top-8 lg:mb-0">
            <Image
              src="/logo.png"
              alt="TaskFlow logo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-contain"
            />
            <span className="text-3xl font-semibold tracking-tight sm:text-4xl">
              TaskFlow
            </span>
          </div>
          <div className="rounded-2xl bg-card/60 p-6 backdrop-blur-sm sm:p-8">
            <div className="mb-6 text-left">
              <h2 className="text-base font-medium sm:text-lg">Login</h2>
              <p className="mt-1 text-sm text-foreground-secondary">
                See your growth and manage your work efficiently.
              </p>
            </div>
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-xs text-foreground-secondary">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </section>

      {/* Right: product hero with colored background; flat, blended image */}
      <section className="relative hidden items-center justify-center overflow-hidden bg-surface p-8 lg:flex">
        {/* Subtle accent glow */}
        <div className="absolute inset-0 bg-[radial-gradient(60rem_60rem_at_80%_20%,theme(colors.accent)/18%,transparent_65%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-accent ring-1 ring-black/5">
              TaskFlow Productivity
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Manage your projects more professionally
            </h2>
            <p className="mt-2 text-sm text-foreground-secondary">
              Track tasks, collaborate with your team, and keep delivery on
              schedule—across all devices.
            </p>
          </div>

          {/* Flat image that blends with the section; no shadow or ring */}
          <div className="relative">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.png"
                alt="TaskFlow system preview"
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            {/* Soft blur below to blend nicely into the page */}
            <div
              aria-hidden
              className="pointer-events-none mx-auto mt-4 h-16 w-2/3 rounded-full bg-white/40 blur-2xl"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

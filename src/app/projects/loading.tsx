export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-dvh md:flex">
        {/* Sidebar placeholder to avoid layout shift on desktop */}
        <aside className="sticky top-0 hidden h-dvh w-[18rem] shrink-0 border-r border-border bg-surface px-4 py-5 md:block" />

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          {/* Mobile topbar placeholder */}
          <div className="sticky top-0 z-30 mb-4 flex items-center justify-between rounded-2xl border border-border bg-surface/80 px-3 py-2 backdrop-blur md:hidden">
            <div className="h-9 w-9 animate-pulse rounded-full bg-background" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-background" />
          </div>

          {/* Header skeleton (no blue action button) */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <div className="h-8 w-40 animate-pulse rounded-lg bg-surface" />
              <div className="h-4 w-64 animate-pulse rounded-lg bg-surface" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-36 animate-pulse rounded-lg border border-border bg-surface" />
            </div>
          </div>

          {/* Projects list skeleton (flat rows within a surface) */}
          <div className="rounded-2xl bg-surface p-6">
            <ul className="space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <div className="flex items-start justify-between rounded-lg p-3">
                    <div className="flex gap-3">
                      <div className="mt-0.5 h-11 w-11 animate-pulse rounded-md bg-accent/10" />
                      <div className="space-y-2">
                        <div className="h-4 w-48 animate-pulse rounded bg-background" />
                        <div className="h-4 w-80 animate-pulse rounded bg-background" />
                        <div className="mt-2 flex gap-2">
                          <div className="h-5 w-24 animate-pulse rounded-full bg-background" />
                          <div className="h-5 w-28 animate-pulse rounded-full bg-background" />
                          <div className="h-5 w-20 animate-pulse rounded-full bg-background" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 h-4 w-4 animate-pulse rounded bg-background" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

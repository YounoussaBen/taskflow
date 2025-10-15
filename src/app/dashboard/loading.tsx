export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-dvh md:flex">
        {/* Sidebar placeholder height to avoid layout shift on desktop */}
        <aside className="sticky top-0 hidden h-dvh w-[18rem] shrink-0 border-r border-border bg-surface px-4 py-5 md:block" />

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          {/* Mobile topbar placeholder */}
          <div className="sticky top-0 z-30 mb-4 flex items-center justify-between rounded-2xl border border-border bg-surface/80 px-3 py-2 backdrop-blur md:hidden">
            <div className="h-9 w-9 animate-pulse rounded-full bg-background" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-background" />
          </div>

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <div className="h-8 w-40 animate-pulse rounded-lg bg-surface" />
              <div className="h-4 w-64 animate-pulse rounded-lg bg-surface" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-36 animate-pulse rounded-full bg-accent/30" />
              <div className="h-10 w-32 animate-pulse rounded-full bg-accent" />
            </div>
          </div>

          {/* Stats grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-surface p-5"
                role="status"
                aria-busy="true"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-background" />
                    <div className="h-7 w-16 animate-pulse rounded bg-background" />
                  </div>
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-background" />
                </div>
              </div>
            ))}
          </div>

          {/* Progress + Projects */}
          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-surface p-6 lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div className="h-6 w-40 animate-pulse rounded bg-background" />
                <div className="h-6 w-20 animate-pulse rounded bg-background" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-background p-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-surface" />
                    <div className="mt-2 h-6 w-12 animate-pulse rounded bg-surface" />
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-background p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-surface" />
                  <div className="h-4 w-10 animate-pulse rounded bg-surface" />
                </div>
                <div className="h-3 w-full animate-pulse rounded-full bg-surface" />
                <div className="mt-4 h-14 w-full animate-pulse rounded-xl bg-surface" />
              </div>
            </div>
            <div className="rounded-2xl bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-6 w-28 animate-pulse rounded bg-background" />
                <div className="h-4 w-16 animate-pulse rounded bg-background" />
              </div>
              <ul className="space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i}>
                    <div className="flex items-start justify-between rounded-lg p-3">
                      <div className="flex gap-3">
                        <div className="mt-0.5 h-9 w-9 animate-pulse rounded-md bg-accent/10" />
                        <div className="space-y-2">
                          <div className="h-4 w-40 animate-pulse rounded bg-surface" />
                          <div className="h-4 w-64 animate-pulse rounded bg-surface" />
                        </div>
                      </div>
                      <div className="mt-1 h-4 w-4 animate-pulse rounded bg-surface" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tasks + Insights */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-6 w-28 animate-pulse rounded bg-background" />
                <div className="h-4 w-16 animate-pulse rounded bg-background" />
              </div>
              {/* Unified tasks list skeleton (flat rows) */}
              <ul className="space-y-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i}>
                    <div className="flex items-start justify-between rounded-lg p-3">
                      <div className="flex gap-3">
                        <div className="mt-0.5 h-8 w-8 animate-pulse rounded-md bg-surface" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 animate-pulse rounded bg-surface" />
                          <div className="h-3 w-24 animate-pulse rounded bg-surface" />
                        </div>
                      </div>
                      <div className="h-5 w-20 animate-pulse rounded-full bg-surface" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-surface p-6">
              <div className="mb-4 h-6 w-28 animate-pulse rounded bg-background" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-background p-4">
                    <div className="mb-2 h-4 w-24 animate-pulse rounded bg-surface" />
                    <div className="h-4 w-64 animate-pulse rounded bg-surface" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

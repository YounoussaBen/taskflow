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
          <div className="mb-8">
            <div className="h-8 w-40 animate-pulse rounded-md bg-muted/40" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded-md bg-muted/30" />
          </div>

          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3 w-24 animate-pulse rounded bg-muted/40" />
                    <div className="mt-3 h-7 w-16 animate-pulse rounded bg-muted/30" />
                  </div>
                  <div className="h-8 w-8 animate-pulse rounded-md bg-muted/30" />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 rounded-2xl bg-surface p-6">
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-muted/30" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted/30" />
                    <div className="h-4 w-16 animate-pulse rounded bg-muted/30" />
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                    <div className="h-full w-1/3 animate-pulse bg-muted/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-6 w-48 animate-pulse rounded bg-muted/30" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted/30" />
            </div>

            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-muted/40" />
                    <div className="h-4 w-40 animate-pulse rounded bg-muted/30" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-24 animate-pulse rounded-full bg-muted/30" />
                    <div className="h-9 w-36 animate-pulse rounded-md bg-muted/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

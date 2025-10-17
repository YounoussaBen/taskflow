import { requireAuth } from "@/lib/auth"
import Sidebar from "@/components/sidebar"
import TopbarMobile from "@/components/topbar-mobile"

// Force dynamic rendering for authenticated routes since they use cookies
export const dynamic = "force-dynamic"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-dvh md:flex">
        <Sidebar session={session} />
        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <TopbarMobile />
          {children}
        </main>
      </div>
    </div>
  )
}

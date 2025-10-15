"use client"

import { useCallback } from "react"
import { Menu } from "lucide-react"

export default function TopbarMobile() {
  const openSidebar = useCallback(() => {
    window.dispatchEvent(new Event("taskflow:openSidebar"))
  }, [])

  return (
    <div className="sticky top-0 z-30 mb-4 flex items-center justify-between rounded-2xl border border-border bg-surface/80 px-3 py-2 backdrop-blur md:hidden">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={openSidebar}
        className="inline-flex items-center justify-center rounded-full border border-border bg-background/90 p-2 text-foreground hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="text-sm font-medium text-foreground">Menu</div>
    </div>
  )
}

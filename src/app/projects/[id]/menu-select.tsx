"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Check } from "lucide-react"

interface Option {
  value: string
  label: React.ReactNode
}

interface MenuSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

export default function MenuSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled,
}: MenuSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = useMemo(
    () => options.find(o => o.value === value)?.label ?? placeholder,
    [options, value, placeholder]
  )

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-left text-foreground transition-colors hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="truncate text-sm">{selected}</span>
        <ChevronDown className="ml-2 h-4 w-4 text-secondary" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
            <ul className="max-h-64 overflow-auto py-1">
              {options.map(opt => {
                const isActive = opt.value === value
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value)
                        setOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-background ${isActive ? "text-accent" : ""}`}
                    >
                      <span className="mr-2 line-clamp-1 flex-1">
                        {opt.label}
                      </span>
                      {isActive && <Check className="h-4 w-4" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

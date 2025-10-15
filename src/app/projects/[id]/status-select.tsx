"use client"

import { useMemo } from "react"
import MenuSelect from "./menu-select"

export type StatusValue = "pending" | "in_progress" | "done"

export default function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: StatusValue
  onChange: (v: StatusValue) => void
  disabled?: boolean
}) {
  const options = useMemo(
    () => [
      {
        value: "pending",
        label: (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            <span>Pending</span>
          </span>
        ),
      },
      {
        value: "in_progress",
        label: (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>In Progress</span>
          </span>
        ),
      },
      {
        value: "done",
        label: (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>Done</span>
          </span>
        ),
      },
    ],
    []
  )

  return (
    <MenuSelect
      value={value}
      onChange={v => onChange(v as StatusValue)}
      options={options}
      disabled={disabled}
    />
  )
}

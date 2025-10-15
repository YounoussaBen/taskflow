"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import CreateTaskDialog from "./create-task-dialog"

interface CreateTaskButtonProps {
  projectId: number
}

export default function CreateTaskButton({ projectId }: CreateTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        <Plus className="h-5 w-5" />
        Create Task
      </button>

      {isOpen && (
        <CreateTaskDialog
          projectId={projectId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

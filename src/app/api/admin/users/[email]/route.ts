import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { updateUserRole, getUserByEmail } from "@/lib/data"
import { Role } from "@/lib/types"

interface RouteContext {
  params: Promise<{ email: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // Only admins can update user roles
    await requireRole(["admin"])

    const { email } = await context.params
    const decodedEmail = decodeURIComponent(email)

    // Verify user exists
    const user = getUserByEmail(decodedEmail)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { role } = body

    // Validate role
    if (!role || !["admin", "manager", "member"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user role
    const updatedUser = updateUserRole(decodedEmail, role as Role)

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error("Update user role error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json(
        { error: "Only admins can update user roles" },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "An error occurred while updating user role" },
      { status: 500 }
    )
  }
}

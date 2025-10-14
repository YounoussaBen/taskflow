import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ session: null }, { status: 200 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

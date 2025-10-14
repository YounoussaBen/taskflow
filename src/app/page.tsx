import { Heart, Star, Settings, User, Mail } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container flex min-h-screen flex-col items-center justify-center py-2">
        <h1 className="text-4xl font-bold">
          Welcome to Next.js with Tailwind CSS!
        </h1>
        <div className="mt-6 flex space-x-4">
          <Heart className="text-red-500" />
          <Star className="text-yellow-500" />
          <Settings className="text-gray-500" />
          <User className="text-blue-500" />
          <Mail className="text-green-500" />
        </div>
      </div>
    </div>
  )
}

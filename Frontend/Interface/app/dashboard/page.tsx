import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logout } from "@/app/actions"

export default function Dashboard() {
  const cookieStore = cookies()
  const username = cookieStore.get("username")?.value

  if (!username) {
    redirect("/")
  }

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {username}</h1>
          <form action={logout}>
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Logout</button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Link href="/asl-detection" className="block">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition h-full">
              <h2 className="text-xl font-bold mb-2">ASL Detection</h2>
              <p className="text-gray-600 mb-4">Detect American Sign Language gestures using your camera</p>
              <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=200&width=320"
                  alt="ASL Detection"
                  className="h-32 w-auto opacity-70"
                />
              </div>
            </div>
          </Link>

          <Link href="/rock-paper-scissors" className="block">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition h-full">
              <h2 className="text-xl font-bold mb-2">Rock Paper Scissors</h2>
              <p className="text-gray-600 mb-4">Play Rock-Paper-Scissors against an AI opponent</p>
              <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=200&width=320"
                  alt="Rock Paper Scissors"
                  className="h-32 w-auto opacity-70"
                />
              </div>
            </div>
          </Link>
        </div>

        <Link href="/history" className="block">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">View History</h2>
            <p className="text-gray-600 mb-4">Check your game history and statistics</p>
            <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center">
              <img src="/placeholder.svg?height=100&width=600" alt="History" className="h-16 w-auto opacity-70" />
            </div>
          </div>
        </Link>
      </div>
    </main>
  )
}

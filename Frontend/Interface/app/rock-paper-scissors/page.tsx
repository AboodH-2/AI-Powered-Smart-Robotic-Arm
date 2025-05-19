import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import RPSGame from "@/components/rps-game"
import Link from "next/link"

export default function RockPaperScissorsPage() {
  const cookieStore = cookies()
  const username = cookieStore.get("username")?.value

  if (!username) {
    redirect("/")
  }

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
          <Link href="/dashboard">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center">
              <span className="mr-1">←</span> Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Rock Paper Scissors Game</h1>
        </div>

        <RPSGame username={username} />
      </div>
    </main>
  )
}

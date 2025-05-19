import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserHistory } from "@/app/actions"
import HistoryStats from "@/components/history-stats"

export default async function HistoryPage() {
  const cookieStore = cookies()
  const username = cookieStore.get("username")?.value

  if (!username) {
    redirect("/")
  }

  const history = await getUserHistory(username)

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
          <Link href="/dashboard">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center">
              <span className="mr-1">←</span> Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Game History</h1>
        </div>

        <HistoryStats history={history} username={username} />
      </div>
    </main>
  )
}

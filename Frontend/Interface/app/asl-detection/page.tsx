import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ASLDetection from "@/components/asl-detection"
import Link from "next/link"

export default function ASLDetectionPage() {
  const cookieStore = cookies()
  const username = cookieStore.get("username")?.value

  if (!username) {
    redirect("/")
  }

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-4">
          <Link href="/dashboard">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center">
              <span className="mr-1">←</span> Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">ASL Gesture Detection</h1>
        </div>

        <ASLDetection username={username} />
      </div>
    </main>
  )
}

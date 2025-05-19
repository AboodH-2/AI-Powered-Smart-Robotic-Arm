import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"
import { cookies } from "next/headers"

export default function Home() {
  const cookieStore = cookies()
  const username = cookieStore.get("username")?.value

  if (username) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome</h1>
        <p className="text-center mb-6">ASL Gesture Detection & Rock-Paper-Scissors Game</p>
        <LoginForm />
      </div>
    </main>
  )
}

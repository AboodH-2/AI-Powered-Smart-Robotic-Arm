"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/app/actions"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    await login(username)
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block mb-1 font-medium">
          Enter your name
        </label>
        <input
          id="username"
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Continue"}
      </button>
    </form>
  )
}

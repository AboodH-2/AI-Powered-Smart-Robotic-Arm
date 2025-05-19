"use server"

import { cookies } from "next/headers"
import fs from "fs"
import path from "path"

export async function login(username) {
  cookies().set("username", username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  // Create user data directory if it doesn't exist
  const userDir = path.join(process.cwd(), "data", username)

  try {
    if (!fs.existsSync(path.join(process.cwd(), "data"))) {
      fs.mkdirSync(path.join(process.cwd(), "data"))
    }

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }

    // Initialize user history file if it doesn't exist
    const historyFile = path.join(userDir, "rps_history.json")
    if (!fs.existsSync(historyFile)) {
      fs.writeFileSync(
        historyFile,
        JSON.stringify({
          games: [],
          totalGames: 0,
          userWins: 0,
          aiWins: 0,
          draws: 0,
          agentUsage: {},
        }),
      )
    }
  } catch (error) {
    console.error("Error creating user data:", error)
  }
}

export async function logout() {
  cookies().delete("username")
}

export async function getUserHistory(username) {
  try {
    const historyFile = path.join(process.cwd(), "data", username, "rps_history.json")

    if (fs.existsSync(historyFile)) {
      const data = fs.readFileSync(historyFile, "utf8")
      return JSON.parse(data)
    }

    return {
      games: [],
      totalGames: 0,
      userWins: 0,
      aiWins: 0,
      draws: 0,
      agentUsage: {},
    }
  } catch (error) {
    console.error("Error reading user history:", error)
    return null
  }
}

export async function saveRPSGame(username, result) {
  try {
    const historyFile = path.join(process.cwd(), "data", username, "rps_history.json")

    let history = {
      games: [],
      totalGames: 0,
      userWins: 0,
      aiWins: 0,
      draws: 0,
      agentUsage: {},
    }

    if (fs.existsSync(historyFile)) {
      const data = fs.readFileSync(historyFile, "utf8")
      history = JSON.parse(data)
    }

    // Update history
    history.games.push(result)
    history.totalGames++

    if (result.result === "win") {
      history.userWins++
    } else if (result.result === "lose") {
      history.aiWins++
    } else {
      history.draws++
    }

    // Update agent usage
    const agentId = result.agent.toString()
    history.agentUsage[agentId] = (history.agentUsage[agentId] || 0) + 1

    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2))

    return history
  } catch (error) {
    console.error("Error saving game result:", error)
    return null
  }
}

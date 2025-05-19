"use client"

import { useState } from "react"

export default function HistoryStats({ history, username }) {
  const [activeTab, setActiveTab] = useState("summary")

  // Calculate win rate
  const winRate = history.totalGames > 0 ? ((history.userWins / history.totalGames) * 100).toFixed(1) : "0.0"

  // Get most used agent
  const mostUsedAgent = Object.entries(history.agentUsage).sort((a, b) => b[1] - a[1])[0]

  // Get most successful agent (highest win rate against user)
  const getSuccessfulAgents = () => {
    const agentPerformance = {}

    history.games.forEach((game) => {
      const agentId = game.agent.toString()
      if (!agentPerformance[agentId]) {
        agentPerformance[agentId] = { wins: 0, plays: 0 }
      }

      agentPerformance[agentId].plays++
      if (game.result === "lose") {
        // AI win
        agentPerformance[agentId].wins++
      }
    })

    return Object.entries(agentPerformance)
      .map(([id, stats]) => ({
        id: Number.parseInt(id),
        winRate: stats.plays > 0 ? (stats.wins / stats.plays) * 100 : 0,
        plays: stats.plays,
      }))
      .filter((agent) => agent.plays >= 3) // Only consider agents with enough data
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3) // Top 3
  }

  const topAgents = getSuccessfulAgents()

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get result color
  const getResultColor = (result) => {
    switch (result) {
      case "win":
        return "bg-green-100 text-green-800"
      case "lose":
        return "bg-red-100 text-red-800"
      case "draw":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get move emoji
  const getMoveEmoji = (move) => {
    switch (move) {
      case "rock":
        return "✊"
      case "paper":
        return "✋"
      case "scissors":
        return "✌️"
      default:
        return "?"
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">History for {username}</h2>

      <div className="border-b mb-4">
        <div className="flex">
          <button
            className={`px-4 py-2 ${activeTab === "summary" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "games" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("games")}
          >
            Game History
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "agents" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("agents")}
          >
            AI Agents
          </button>
        </div>
      </div>

      {activeTab === "summary" && (
        <div className="pt-2">
          {history.totalGames === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No games played yet.</p>
              <p className="text-sm text-gray-400 mt-2">Play some Rock-Paper-Scissors games to see your stats!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Total Games</p>
                  <p className="text-3xl font-bold">{history.totalGames}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-600">Your Wins</p>
                  <p className="text-3xl font-bold text-green-700">{history.userWins}</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-red-600">AI Wins</p>
                  <p className="text-3xl font-bold text-red-700">{history.aiWins}</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-yellow-600">Draws</p>
                  <p className="text-3xl font-bold text-yellow-700">{history.draws}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-blue-700">Your Win Rate</p>
                  <p className="text-blue-800 font-bold">{winRate}%</p>
                </div>
                <div className="mt-2 h-3 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${winRate}%` }}></div>
                </div>
              </div>

              {mostUsedAgent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Most Used Agent</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-medium">Agent #{Number.parseInt(mostUsedAgent[0]) + 1}</p>
                      <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">{mostUsedAgent[1]} games</span>
                    </div>
                  </div>

                  {topAgents.length > 0 && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Best AI Agent</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="font-medium">Agent #{topAgents[0].id + 1}</p>
                        <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                          {topAgents[0].winRate.toFixed(1)}% win rate
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "games" && (
        <div className="pt-2">
          {history.games.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No games played yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Game</th>
                    <th className="px-4 py-2 text-center">Your Move</th>
                    <th className="px-4 py-2 text-center">AI Move</th>
                    <th className="px-4 py-2 text-center">Result</th>
                    <th className="px-4 py-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.games
                    .slice()
                    .reverse()
                    .map((game, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-left">#{history.games.length - index}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center">
                            <span className="text-xl mr-2">{getMoveEmoji(game.userMove)}</span>
                            <span className="capitalize">{game.userMove}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center">
                            <span className="text-xl mr-2">{getMoveEmoji(game.aiMove)}</span>
                            <span className="capitalize">{game.aiMove}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getResultColor(game.result)}`}>
                            {game.result === "win" ? "You Won" : game.result === "lose" ? "AI Won" : "Draw"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">{formatDate(game.timestamp)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "agents" && (
        <div className="pt-2">
          {Object.keys(history.agentUsage).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No agent data available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Agent Usage</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(history.agentUsage)
                    .sort((a, b) => Number.parseInt(a[0]) - Number.parseInt(b[0]))
                    .map(([agentId, count]) => (
                      <div key={agentId} className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-500">Agent #{Number.parseInt(agentId) + 1}</p>
                        <p className="font-medium">{count} games</p>
                      </div>
                    ))}
                </div>
              </div>

              {topAgents.length > 0 && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Top Performing Agents</h3>
                  <div className="space-y-3">
                    {topAgents.map((agent) => (
                      <div key={agent.id} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Agent #{agent.id + 1}</p>
                          <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">{agent.plays} games</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Win Rate</span>
                            <span className="font-medium">{agent.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${agent.winRate}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

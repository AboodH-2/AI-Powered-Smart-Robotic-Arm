"use client"

import { useEffect, useRef, useState } from "react"
import { saveRPSGame } from "@/app/actions"

// Mock moves for demonstration
const moves = ["rock", "paper", "scissors"]

// Mock Multi-Armed Bandit implementation
class MultiArmedBandit {
  agents

  constructor(numAgents = 20) {
    this.agents = Array(numAgents)
      .fill(null)
      .map(() => ({ wins: 0, plays: 0 }))
  }

  selectAgent() {
    // Simple epsilon-greedy strategy
    if (Math.random() < 0.2) {
      // Explore: select random agent
      return Math.floor(Math.random() * this.agents.length)
    } else {
      // Exploit: select best performing agent
      const winRates = this.agents.map((agent, index) => {
        const rate = agent.plays > 0 ? agent.wins / agent.plays : 0
        // Add small bonus for less played agents
        return { index, rate: rate + 0.1 * (1 / (agent.plays + 1)) }
      })

      winRates.sort((a, b) => b.rate - a.rate)
      return winRates[0].index
    }
  }

  updateAgent(agentIndex, won) {
    const agent = this.agents[agentIndex]
    agent.plays++
    if (won) {
      agent.wins++
    }
  }

  getAgentWinRate(agentIndex) {
    const agent = this.agents[agentIndex]
    return agent.plays > 0 ? (agent.wins / agent.plays) * 100 : 0
  }

  predictMove(agentIndex, userHistory) {
    // In a real implementation, each agent would have its own strategy
    // For this mock, we'll use a simple random strategy
    return moves[Math.floor(Math.random() * moves.length)]
  }
}

export default function RPSGame({ username }) {
  const videoRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  const [userMove, setUserMove] = useState(null)
  const [aiMove, setAiMove] = useState(null)
  const [result, setResult] = useState(null)
  const [roundCount, setRoundCount] = useState(0)
  const [userHistory, setUserHistory] = useState([])
  const [currentAgent, setCurrentAgent] = useState(null)
  const [agentWinRate, setAgentWinRate] = useState(0)
  const [bandit] = useState(() => new MultiArmedBandit(20))
  const [gameStats, setGameStats] = useState({
    userWins: 0,
    aiWins: 0,
    draws: 0,
  })

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
      setGameActive(false)
    }
  }

  // Start game
  const startGame = () => {
    if (!cameraActive) {
      startCamera().then(() => {
        setGameActive(true)
        playRound()
      })
    } else {
      setGameActive(true)
      playRound()
    }
  }

  // Play a round
  const playRound = () => {
    // Select agent
    const selectedAgent = bandit.selectAgent()
    setCurrentAgent(selectedAgent)

    // In a real app, this would detect the user's hand gesture using MediaPipe
    // For this mock, we'll use a random move
    const mockUserMove = moves[Math.floor(Math.random() * moves.length)]
    setUserMove(mockUserMove)

    // AI selects move based on selected agent's strategy
    const predictedMove = bandit.predictMove(selectedAgent, userHistory)
    setAiMove(predictedMove)

    // Determine winner
    let roundResult
    if (mockUserMove === predictedMove) {
      roundResult = "draw"
      setResult("Draw!")
      setGameStats((prev) => ({ ...prev, draws: prev.draws + 1 }))
    } else if (
      (mockUserMove === "rock" && predictedMove === "scissors") ||
      (mockUserMove === "paper" && predictedMove === "rock") ||
      (mockUserMove === "scissors" && predictedMove === "paper")
    ) {
      roundResult = "win"
      setResult("You win!")
      setGameStats((prev) => ({ ...prev, userWins: prev.userWins + 1 }))
    } else {
      roundResult = "lose"
      setResult("AI wins!")
      setGameStats((prev) => ({ ...prev, aiWins: prev.aiWins + 1 }))
    }

    // Update agent
    bandit.updateAgent(selectedAgent, roundResult === "lose")
    setAgentWinRate(bandit.getAgentWinRate(selectedAgent))

    // Update history
    setUserHistory((prev) => [...prev, mockUserMove])
    setRoundCount((prev) => prev + 1)

    // Save game result
    saveRPSGame(username, {
      userMove: mockUserMove,
      aiMove: predictedMove,
      result: roundResult,
      agent: selectedAgent,
      timestamp: Date.now(),
    })
  }

  // Reset game
  const resetGame = () => {
    setUserMove(null)
    setAiMove(null)
    setResult(null)
    setRoundCount(0)
    setUserHistory([])
    setCurrentAgent(null)
    setAgentWinRate(0)
    setGameStats({
      userWins: 0,
      aiWins: 0,
      draws: 0,
    })
    setGameActive(false)
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Layout with camera taking 75% of the page */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Camera section - 75% width on desktop */}
        <div className="w-full md:w-3/4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 text-6xl">📷</div>
              </div>
            )}

            {gameActive && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                Game Active
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`flex-1 p-2 rounded ${cameraActive ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
            >
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </button>

            {gameActive ? (
              <button onClick={playRound} className="flex-1 p-2 bg-purple-500 text-white rounded">
                Play Round
              </button>
            ) : (
              <button
                onClick={startGame}
                className="flex-1 p-2 bg-gray-200 rounded"
                disabled={!cameraActive && !gameActive}
              >
                Start Game
              </button>
            )}
          </div>
        </div>

        {/* Game info section - 25% width on desktop */}
        <div className="w-full md:w-1/4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <h3 className="font-medium mb-1 text-sm">Your Move</h3>
              <div className="text-3xl font-bold">{userMove ? getEmojiForMove(userMove) : "?"}</div>
              <p className="mt-1 capitalize text-sm">{userMove || "Waiting..."}</p>
            </div>

            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <h3 className="font-medium mb-1 text-sm">AI Move</h3>
              <div className="text-3xl font-bold">{aiMove ? getEmojiForMove(aiMove) : "?"}</div>
              <p className="mt-1 capitalize text-sm">{aiMove || "Waiting..."}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-100 rounded-lg text-center">
            <h3 className="font-medium mb-1 text-sm">Result</h3>
            <p className="text-xl font-bold">{result || "Play a round"}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <p className="text-xs text-green-700">You</p>
              <p className="text-lg font-bold">{gameStats.userWins}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <p className="text-xs text-yellow-700">Draws</p>
              <p className="text-lg font-bold">{gameStats.draws}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <p className="text-xs text-red-700">AI</p>
              <p className="text-lg font-bold">{gameStats.aiWins}</p>
            </div>
          </div>

          {currentAgent !== null && (
            <div className="p-2 bg-gray-100 rounded-lg text-xs">
              <div className="flex justify-between">
                <span>AI Agent: #{currentAgent + 1}</span>
                <span>Win Rate: {agentWinRate.toFixed(1)}%</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${agentWinRate}%` }}></div>
              </div>
            </div>
          )}

          {roundCount > 0 && (
            <button className="w-full p-2 bg-gray-200 rounded hover:bg-gray-300 transition text-sm" onClick={resetGame}>
              Reset Game
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-lg mt-4">
        <p className="font-medium">How to play:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Start the camera and game</li>
          <li>Show your hand gesture (rock, paper, or scissors) to the camera</li>
          <li>The AI will select its move using a Multi-Armed Bandit approach</li>
          <li>Results are saved automatically to your profile</li>
          <li>Click "Play Round" to play another round</li>
        </ul>
      </div>
    </div>
  )
}

// Helper function to get emoji for move
function getEmojiForMove(move) {
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

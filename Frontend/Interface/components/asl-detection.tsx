"use client"

import { useEffect, useRef, useState } from "react"

// Configuration for the API
const API_BASE_URL = "http://localhost:5000"
const DETECTION_INTERVAL = 4000 // 4 seconds between detections

// Type definitions
interface ASLDetectionProps {
  username: string;
}

export default function ASLDetection({ username }: ASLDetectionProps) {
  // Use proper typing for refs
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [detectionActive, setDetectionActive] = useState(false)
  const [currentSign, setCurrentSign] = useState("")
  const [sentence, setSentence] = useState("")
  const [manualInput, setManualInput] = useState("")
  const [apiStatus, setApiStatus] = useState("idle") // idle, connecting, error
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [attemptingCamera, setAttemptingCamera] = useState(false)
  const [lastDetectionTime, setLastDetectionTime] = useState(0)

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null)
      setAttemptingCamera(true)
      console.log("Requesting camera access...")
      
      // Make sure video element exists
      if (!videoRef.current) {
        setCameraError("Video element not found in DOM - try refreshing the page")
        return
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      })
      
      console.log("Camera access granted, setting up video element...")
      
      // Ensure videoRef is available before accessing it
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Set up event handlers using a promise to handle video loading
        const playPromise = new Promise<void>((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              console.log("Video metadata loaded, attempting to play...")
              if (videoRef.current) {
                videoRef.current.play()
                  .then(() => {
                    console.log("Video playback started successfully")
                    resolve()
                  })
                  .catch((err) => {
                    console.error("Error playing video:", err)
                    reject(new Error("Failed to play video: " + err.message))
                  })
              }
            }
            
            videoRef.current.onerror = (event) => {
              console.error("Video element error:", event)
              reject(new Error("Video element error"))
            }
          } else {
            reject(new Error("Video reference disappeared"))
          }
        })
        
        try {
          await playPromise
          setCameraActive(true)
        } catch (err: any) {
          setCameraError(err.message || "Unknown video playback error")
        }
      } else {
        console.error("Video ref is null")
        setCameraError("Video reference not available")
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error)
      setCameraError(error.message || "Unknown camera error")
      alert("Could not access camera. Please check permissions.")
    } finally {
      setAttemptingCamera(false)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
      setDetectionActive(false)
    }
  }

  // Check if API is available
  const checkApiStatus = async () => {
    try {
      setApiStatus("connecting")
      const response = await fetch(`${API_BASE_URL}/`)
      if (response.ok) {
        setApiStatus("idle")
        return true
      } else {
        setApiStatus("error")
        return false
      }
    } catch (error) {
      console.error("API not available:", error)
      setApiStatus("error")
      return false
    }
  }

  // Capture current frame from video
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) {
      console.error("Could not get canvas context")
      return null
    }
    
    try {
      // Match canvas size to video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Get base64 data URL
      return canvas.toDataURL('image/jpeg')
    } catch (err) {
      console.error("Error capturing frame:", err)
      return null
    }
  }

  // Handle detected sign
  const handleDetectedSign = (sign: string) => {
    setCurrentSign(sign)
    
    // Ensure enough time has passed since last detection (4 seconds)
    const now = Date.now()
    if (now - lastDetectionTime < DETECTION_INTERVAL) {
      console.log(`Skipping sign ${sign}, not enough time passed since last detection`)
      return
    }

    // Process special signs the same way as the ASL_Detection app
    if (sign.toLowerCase() === "space") {
      setSentence((prev) => prev + " ")
    } else if (sign.toLowerCase() === "del") {
      setSentence((prev) => prev.slice(0, -1))
    } else if (sign.toLowerCase() === "nothing") {
      // Do nothing for the "nothing" sign
    } else {
      setSentence((prev) => prev + sign)
    }
    
    setLastDetectionTime(now)
  }

  // Send frame to API for detection
  const detectSign = async () => {
    if (!cameraActive || !detectionActive) return
    
    try {
      const frameData = captureFrame()
      if (!frameData) {
        console.warn("Failed to capture frame, skipping detection")
        return
      }

      const response = await fetch(`${API_BASE_URL}/process_frame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: frameData
        })
      })

      const data = await response.json()
      
      if (data.status === "success") {
        const detectedSign = data.sign
        handleDetectedSign(detectedSign)
      } else if (data.status === "no_hand_detected") {
        console.log("No hand detected in frame")
      } else {
        console.error("Detection error:", data)
      }
    } catch (error) {
      console.error("Error during detection:", error)
    }
  }

  // Toggle ASL detection
  const toggleDetection = async () => {
    if (!cameraActive) {
      const apiAvailable = await checkApiStatus()
      if (!apiAvailable) {
        alert("API server is not available. Please make sure the Python backend is running.")
        return
      }
      
      await startCamera()
      setDetectionActive(true)
      setLastDetectionTime(Date.now())
    } else {
      setDetectionActive(!detectionActive)
      if (!detectionActive) {
        setLastDetectionTime(Date.now())
      }
    }
  }

  // Run detection at interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (detectionActive) {
      // Run detection immediately once
      detectSign()
      
      // Then set interval
      interval = setInterval(detectSign, DETECTION_INTERVAL/2) // Check more frequently
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [detectionActive])

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Handle manual input
  const addManualInput = () => {
    if (manualInput.trim()) {
      setSentence((prev) => prev + " " + manualInput)
      setManualInput("")
    }
  }

  // Clear sentence
  const clearSentence = () => {
    setSentence("")
  }

  // Calculate time until next detection
  const timeUntilNextDetection = () => {
    if (!detectionActive) return 0
    const elapsed = Date.now() - lastDetectionTime
    return Math.max(0, Math.round((DETECTION_INTERVAL - elapsed) / 1000))
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Camera takes up 75% of the page */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${cameraActive ? 'border-4 border-green-500' : ''}`}
            />
            
            {!cameraActive && !attemptingCamera && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 text-6xl">📷</div>
              </div>
            )}

            {attemptingCamera && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-white text-lg animate-pulse">Activating camera...</div>
              </div>
            )}

            {cameraActive && (
              <div className="absolute top-2 left-2 bg-green-500 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm z-10">
                Camera Active
              </div>
            )}

            {detectionActive && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                Next detection: {timeUntilNextDetection()}s
              </div>
            )}
            
            {apiStatus === "error" && (
              <div className="absolute top-4 right-4 bg-red-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm">
                API Connection Error
              </div>
            )}
            
            {apiStatus === "connecting" && (
              <div className="absolute top-4 right-4 bg-yellow-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm">
                Connecting to API...
              </div>
            )}
            
            {cameraError && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 bg-opacity-90 text-white px-4 py-2 rounded-md text-sm max-w-xs text-center">
                <p className="font-bold mb-1">Camera Error:</p>
                <p>{cameraError}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`flex-1 p-2 rounded ${cameraActive ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
              disabled={attemptingCamera}
            >
              {attemptingCamera ? "Starting Camera..." : (cameraActive ? "Stop Camera" : "Start Camera")}
            </button>

            <button
              onClick={toggleDetection}
              className={`flex-1 p-2 rounded ${detectionActive ? "bg-purple-500 text-white" : "bg-gray-200"}`}
              disabled={(!cameraActive && !detectionActive) || attemptingCamera}
            >
              {detectionActive ? "Pause Detection" : "Start Detection"}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/4 space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg min-h-[200px]">
            <h3 className="font-medium mb-2">Detected Sentence:</h3>
            <p className="text-lg break-words">{sentence || "No text yet..."}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-500">Current Sign:</span>
              <span className="ml-2 text-xl font-bold">{currentSign || "-"}</span>
            </div>

            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition" onClick={clearSentence}>
              Clear Text
            </button>
          </div>

          <div className="pt-4 border-t">
            <label htmlFor="manualInput" className="block mb-1 font-medium">
              Manual Input:
            </label>
            <div className="flex mt-1 space-x-2">
              <input
                id="manualInput"
                value={manualInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualInput(e.target.value)}
                placeholder="Type text to add..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addManualInput}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-lg mt-4">
        <p className="font-medium">How to use:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Start the camera and detection</li>
          <li>Show ASL signs to the camera</li>
          <li>The system will detect a sign every 4 seconds</li>
          <li>Use manual input for words that are difficult to sign</li>
          <li>Special signs: "space" adds a space, "del" removes the last character</li>
          <li>Make sure your hand is clearly visible in the frame</li>
        </ul>
      </div>
    </div>
  )
}

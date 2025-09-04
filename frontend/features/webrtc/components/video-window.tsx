"use client"

import { useEffect, useState } from "react"
import { useUserMedia } from "../hooks/use-user-media"
import { useWebRTC } from "../hooks/use-webrtc"
import { useSignaling } from "../hooks/use-signaling"
import DeviceSelection from "./device-selection"
import VideoCall from "./video-call"
import LeetCodeProblemCard from "./leetcode-problem-card"
import CollaborativeEditor from "./collaborative-editor"
import api from "@/lib/api"
import { API_HOST_BASE_URL } from "@/lib/constants"

// LeetCode problem interface
export interface LeetCodeProblem {
  id: string
  title: string
  categories: string[]
  url: string
}

export default function VideoWindow({ matchId, peerId, role }: { matchId: string; peerId: string; role: string }) {
  // Device selection state
  const [isDeviceSelectionOpen, setIsDeviceSelectionOpen] = useState(true)
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("")
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("")

  // Status state
  const [statusMessage, setStatusMessage] = useState("Waiting for peer to connect...")
  const [peerLeft, setPeerLeft] = useState(false)

  // LeetCode problem state
  const [problem, setProblem] = useState<LeetCodeProblem | null>(null)
  const [problemLoading, setProblemLoading] = useState(true)
  const [problemError, setProblemError] = useState<string | null>(null)

  // Get user media
  const { stream: localStream, availableDevices, getStreamWithDevices } = useUserMedia()

  // Fetch problem data when component mounts
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setProblemLoading(true)
        setProblemError(null)
        
        // First, get match details to get the problem_id
        const matchResponse = await api.get(`${API_HOST_BASE_URL}match/details/${matchId}`)
        const matchData = matchResponse.data
        
        if (!matchData) {
          throw new Error("Match not found")
        }
        
        // Extract problem_id from the match data (now returns single object)
        const problemId = matchData.problem_id
        if (!problemId) {
          throw new Error("No problem associated with this match")
        }
        
        // Then fetch the problem details
        const problemResponse = await api.get(`${API_HOST_BASE_URL}problem/${problemId}`)
        const problemData = problemResponse.data
        
        // Transform backend data to frontend LeetCode problem format
        const transformedProblem: LeetCodeProblem = {
          id: `LC-${problemData.problem_id}`,
          title: problemData.title,
          categories: problemData.categories || [],
          url: problemData.problem_link,
        }
        
        setProblem(transformedProblem)
      } catch (error) {
        console.error("Error fetching problem data:", error)
        setProblemError("Failed to load problem data")
        
        // Fallback to hardcoded problem to keep the UI functional
        setProblem({
          id: "LC-704",
          title: "Binary Search",
          categories: ["Algorithms", "Arrays", "Binary Search"],
          url: "https://leetcode.com/problems/binary-search/",
        })
      } finally {
        setProblemLoading(false)
      }
    }

    fetchProblemData()
  }, [matchId])

  // Set up WebRTC
  const {
    remoteStream,
    connectionState,
    startConnection,
    toggleAudio,
    toggleVideo,
    hangUp,
    peerConnection,
    dataChannel,
  } = useWebRTC(localStream, {
    matchId,
    peerId,
    role,
  })

  // ✅ Set up signaling only after device selection is done
  useSignaling({
    enabled: !isDeviceSelectionOpen && !!peerConnection,
    matchId,
    peerId,
    role,
    peerConnection,
    createOffer: async () => {
      const offer = await peerConnection!.createOffer()
      await peerConnection!.setLocalDescription(offer)
      return offer
    },
    createAnswer: async (offer) => {
      await peerConnection!.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection!.createAnswer()
      await peerConnection!.setLocalDescription(answer)
      return answer
    },
    setRemoteDescription: async (desc) => {
      await peerConnection!.setRemoteDescription(new RTCSessionDescription(desc))
    },
    addIceCandidate: async (candidate) => {
      await peerConnection!.addIceCandidate(new RTCIceCandidate(candidate))
    },
  })

  // Update connection status message
  useEffect(() => {
    if (connectionState === "disconnected" || connectionState === "failed" || connectionState === "closed") {
      setStatusMessage("Peer has left the call")
      setPeerLeft(true)

      setTimeout(() => {
        window.location.href = "/matchmaking"
      }, 3000)
    }
  }, [connectionState])

  // Handle device selection
  const handleDeviceSelect = (kind: "videoinput" | "audioinput", deviceId: string) => {
    if (kind === "videoinput") {
      setSelectedVideoDevice(deviceId)
    } else {
      setSelectedAudioDevice(deviceId)
    }
  }

  // Preview selected devices
  const previewSelectedDevices = async () => {
    await getStreamWithDevices(selectedVideoDevice, selectedAudioDevice)
  }

  // Start call with selected devices
  const startCall = async () => {
    const stream = await getStreamWithDevices(selectedVideoDevice, selectedAudioDevice)
    if (stream) {
      setIsDeviceSelectionOpen(false)
      startConnection()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-6 mb-20">
        {isDeviceSelectionOpen ? (
          <DeviceSelection
            videoDevices={availableDevices.videoinput}
            audioDevices={availableDevices.audioinput}
            selectedVideoDevice={selectedVideoDevice}
            selectedAudioDevice={selectedAudioDevice}
            onDeviceSelect={handleDeviceSelect}
            onPreview={previewSelectedDevices}
            onStartCall={startCall}
            localStream={localStream}
          />
        ) : (
          <div className="flex flex-col gap-4 max-w-7xl mx-auto">
            {/* Problem Card */}
            <div className="w-full">
              {problemLoading ? (
                <div className="p-4 border rounded-lg">
                  <p>Loading problem...</p>
                </div>
              ) : problemError ? (
                <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                  <p>Error: {problemError}</p>
                </div>
              ) : problem ? (
                <LeetCodeProblemCard problem={problem} />
              ) : null}
            </div>
            
            {/* Main Content - Video and Editor Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
              {/* Video Call */}
              <div className="min-h-0">
                <VideoCall
                  localStream={localStream}
                  remoteStream={remoteStream}
                  statusMessage={statusMessage}
                  peerLeft={peerLeft}
                  onToggleAudio={toggleAudio}
                  onToggleVideo={toggleVideo}
                  onHangUp={hangUp}
                />
              </div>
              
              {/* Collaborative Editor */}
              <div className="min-h-0">
                <CollaborativeEditor
                  matchId={matchId}
                  dataChannel={dataChannel}
                  onCodeChange={(code) => {
                    console.log("Code updated:", code.length, "characters")
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

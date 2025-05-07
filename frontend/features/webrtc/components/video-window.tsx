"use client"

import { useEffect, useState } from "react"
import { useUserMedia } from "../hooks/use-user-media"
import { useWebRTC } from "../hooks/use-webrtc"
import { useSignaling } from "../hooks/use-signaling"
import DeviceSelection from "./device-selection"
import VideoCall from "./video-call"
import LeetCodeProblemCard from "./leetcode-problem-card"

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
  // TODO: crud pull for a random problem with matching category
  const [problem] = useState<LeetCodeProblem>({
    id: "LC-704",
    title: "Binary Search",
    categories: ["Algorithms", "Arrays", "Binary Search"],
    url: "https://leetcode.com/problems/binary-search/",
  })

  // Get user media
  const { stream: localStream, availableDevices, switchDevice, getStreamWithDevices } = useUserMedia()

  // Set up WebRTC
  const {
    remoteStream,
    connectionState,
    startConnection,
    toggleAudio,
    toggleVideo,
    hangUp,
    peerConnection,
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
            <div className="w-full">
              <LeetCodeProblemCard problem={problem} />
            </div>
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
        )}
      </main>
    </div>
  )
}

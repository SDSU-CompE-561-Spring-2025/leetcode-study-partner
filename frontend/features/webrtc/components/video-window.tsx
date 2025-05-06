"use client"

import { useState } from "react"
import { useUserMedia } from "../hooks/use-user-media"
import { useWebRTC } from "../hooks/use-webrtc"
import { useMediaStream } from "../hooks/use-media-stream"
import TextChat from "../components/text-chat"
import ProblemCard from "../components/problem-card"
import DeviceSettings from "../components/device-settings"
import { User, PhoneOff, MicOff, VideoOff, Mic, Video, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function VideoWindow() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ text: string; sender: "me" | "peer" }[]>([])
  const [problemCompleted, setProblemCompleted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  // In a real app, this would come from your authentication system and signaling server
  const [peerUsername, setPeerUsername] = useState("Jane Doe")

  // Get local media stream
  const { stream: localStream, error: mediaError, availableDevices, currentDevices, switchDevice } = useUserMedia()

  // Set up WebRTC connection
  const {
    peerConnection,
    connectionState,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    remoteStream,
  } = useWebRTC(localStream)

  // Connect streams to video elements
  const localVideoRef = useMediaStream(localStream)
  const remoteVideoRef = useMediaStream(remoteStream)

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "me" }])
      setMessage("")
      // Here you would also send the message through your signaling channel
    }
  }

  // Handle hanging up
  const handleHangUp = () => {
    // In a real app, you would close the connection and navigate away
    console.log("Hanging up...")
  }

  // Toggle microphone
  const toggleMicrophone = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  // Toggle camera
  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  return (
    <div className="grid grid-cols-6 gap-4 max-w-7xl mx-auto h-[calc(100vh-12rem)]">
      {/* Problem card as header - row 1 */}
      <div className="col-span-6 h-16">
        <ProblemCard />
      </div>

      {/* Main content area - row 2 */}
      <div className="col-span-6 grid grid-cols-6 gap-4 h-[calc(100vh-20rem)]">
        {/* Video container - 5/6 columns */}
        <div className="col-span-5 relative bg-card rounded-lg overflow-hidden border border-border">
          {remoteStream ? (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-card-foreground/70">Waiting for peer to connect...</p>
            </div>
          )}

          {/* User info and settings in a single container */}
          <div className="absolute top-4 w-full px-4 flex justify-between items-center">
            {/* Username display */}
            <div className="bg-primary/20 text-primary-foreground px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{peerUsername}</span>
            </div>

            {/* Settings button */}
            <DeviceSettings
              availableDevices={availableDevices}
              currentDevices={currentDevices}
              onDeviceChange={switchDevice}
            />
          </div>

          {/* Local video (small overlay) */}
          <div className="absolute bottom-4 right-4 w-1/5 aspect-video bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            {localStream ? (
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-card-foreground/70">Camera off</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat - 1/6 columns */}
        <div className="col-span-1 h-full">
          <TextChat messages={messages} message={message} setMessage={setMessage} onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Controls - row 3 */}
      <div className="col-span-6 flex items-center justify-between bg-card/50 rounded-lg p-3 border border-border">
        {/* Connection status */}
        <div className="text-sm text-muted-foreground">
          Connection status: <span className="font-medium text-foreground">{connectionState}</span>
        </div>

        {/* Media controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="sm"
            onClick={toggleMicrophone}
            className="h-8 w-8 p-0"
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant={isVideoOff ? "destructive" : "secondary"}
            size="sm"
            onClick={toggleCamera}
            className="h-8 w-8 p-0"
          >
            {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </Button>
        </div>

        {/* Problem completion checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="problem-completed"
            checked={problemCompleted}
            onCheckedChange={(checked) => setProblemCompleted(checked as boolean)}
            className={cn(
              "h-5 w-5 border-2 border-white/30 rounded-md",
              problemCompleted ? "bg-amber-500 border-amber-500 text-white" : "bg-transparent",
            )}
            // icon={<Check className="h-3.5 w-3.5" />}
          />
          <Label htmlFor="problem-completed" className="text-sm cursor-pointer">
            Problem completed
          </Label>
        </div>

        {/* Hang up button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleHangUp}
          className="gap-1 bg-red-600 hover:bg-red-700 text-white"
        >
          <PhoneOff className="h-4 w-4" />
          Hang Up
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneOff, MicOff, VideoOff, Mic, Video } from "lucide-react"

interface VideoCallProps {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  statusMessage: string
  peerLeft: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onHangUp: () => void
}

export default function VideoCall({
  localStream,
  remoteStream,
  statusMessage,
  peerLeft,
  onToggleAudio,
  onToggleVideo,
  onHangUp,
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [localStream, remoteStream])

  // Handle toggle audio
  const handleToggleAudio = () => {
    onToggleAudio()
    setIsMuted(!isMuted)
  }

  // Handle toggle video
  const handleToggleVideo = () => {
    onToggleVideo()
    setIsVideoOff(!isVideoOff)
  }

  return (
    <div className="relative bg-card rounded-lg overflow-hidden border border-border h-[calc(100vh-16rem)]">
      {remoteStream ? (
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className={`text-card-foreground text-lg ${peerLeft ? "text-destructive font-medium" : ""}`}>
            {statusMessage}
          </p>
        </div>
      )}

      {/* Local video preview - now in top right */}
      <div className="absolute top-4 right-4 w-1/5 aspect-video bg-card rounded-lg overflow-hidden shadow-lg border border-border">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/50 backdrop-blur-sm flex justify-center space-x-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="sm"
          onClick={handleToggleAudio}
          className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="sm"
          onClick={handleToggleVideo}
          className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onHangUp}
          className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

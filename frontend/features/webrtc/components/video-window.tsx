"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PhoneOff, MicOff, VideoOff, Mic, Video } from "lucide-react"

// Remove the markUserReady function and related code that uses window.clientsReady
// We'll use a simpler approach that doesn't require extending the Window interface

export default function VideoWindow({ matchId, peerId, role }: { matchId: string; peerId: string; role: string }) {
  // Media state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  // Device selection state
  const [isDeviceSelectionOpen, setIsDeviceSelectionOpen] = useState(true)
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("")
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("")

  // WebRTC state
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null)
  const [connectionState, setConnectionState] = useState<string>("disconnected")

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // WebSocket for signaling
  const signalingSocketRef = useRef<WebSocket | null>(null)

  // Get available media devices
  useEffect(() => {
    async function getDevices() {
      try {
        // First request permissions to get labeled devices
        await navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((tempStream) => {
            // Stop the temporary stream immediately
            tempStream.getTracks().forEach((track) => track.stop())
          })
          .catch((err) => {
            console.error("Error getting initial permissions:", err)
          })

        // Now enumerate devices (they should be labeled now)
        const devices = await navigator.mediaDevices.enumerateDevices()

        const videoInputs = devices.filter((device) => device.kind === "videoinput")
        const audioInputs = devices.filter((device) => device.kind === "audioinput")

        setVideoDevices(videoInputs)
        setAudioDevices(audioInputs)

        // Set default selections if available
        if (videoInputs.length > 0) {
          setSelectedVideoDevice(videoInputs[0].deviceId)
        }

        if (audioInputs.length > 0) {
          setSelectedAudioDevice(audioInputs[0].deviceId)
        }

        console.log("Available video devices:", videoInputs)
        console.log("Available audio devices:", audioInputs)
      } catch (err) {
        console.error("Error enumerating devices:", err)
      }
    }

    getDevices()
  }, [])

  // Get user media with selected devices
  const getUserMediaWithSelectedDevices = async () => {
    try {
      // Stop any existing tracks
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }

      // Build constraints based on selected devices
      const constraints: MediaStreamConstraints = {
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
      }

      console.log("Getting user media with constraints:", constraints)

      // Get the stream with selected devices
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setLocalStream(stream)

      // Connect stream to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      console.log(
        "Got local stream with tracks:",
        stream
          .getTracks()
          .map((t) => `${t.kind}: ${t.label}`)
          .join(", "),
      )

      return stream
    } catch (err) {
      console.error("Error getting user media:", err)
      return null
    }
  }

  // Preview selected devices
  const previewSelectedDevices = async () => {
    await getUserMediaWithSelectedDevices()
  }

  // Start WebRTC connection
  const startWebRTCConnection = async () => {
    // Make sure we have a local stream with the selected devices
    const stream = await getUserMediaWithSelectedDevices()
    if (!stream) {
      console.error("Failed to get local stream")
      return
    }

    console.log("Starting WebRTC with stream:", stream.id)
    console.log("Stream has video tracks:", stream.getVideoTracks().length)
    console.log("Stream has audio tracks:", stream.getAudioTracks().length)

    // Ensure the local video element is updated with the stream
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }

    // Close device selection dialog
    setIsDeviceSelectionOpen(false)

    // Create peer connection
    const iceServers = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

    const pc = new RTCPeerConnection(iceServers)
    setPeerConnection(pc)

    // Add local tracks to peer connection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream)
    })

    // Handle remote tracks
    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind)

      // Create remote stream if it doesn't exist
      const newRemoteStream = new MediaStream()
      event.streams[0].getTracks().forEach((track) => {
        newRemoteStream.addTrack(track)
      })

      setRemoteStream(newRemoteStream)

      // Connect to video element
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = newRemoteStream
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log("Connection state changed:", pc.connectionState)
      setConnectionState(pc.connectionState)
    }

    // Connect to signaling server
    connectToSignalingServer(pc)
  }

  // Connect to signaling server
  const connectToSignalingServer = (pc: RTCPeerConnection) => {
    const protocol = "wss"
    const socketUrl = `${protocol}://localhost:8000/ws/signaling/match/${matchId}`

    console.log("Connecting to signaling server:", socketUrl)

    const socket = new WebSocket(socketUrl)
    signalingSocketRef.current = socket

    socket.onopen = () => {
      console.log("Connected to signaling server")

      // Send ready message
      socket.send(
        JSON.stringify({
          event: "client_ready",
          peerId: peerId,
          role: role,
        }),
      )

      // If host, create and send offer
      if (role === "host") {
        createAndSendOffer(pc, socket)
      }
    }

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.event === "room_ready" && role === "host") {
          createAndSendOffer(pc, socket)
        }

        if (data.type === "offer" && role === "guest") {
          await handleOffer(pc, socket, data)
        }

        if (data.type === "answer" && role === "host") {
          await handleAnswer(pc, data)
        }

        if (data.type === "ice-candidate") {
          await handleIceCandidate(pc, data)
        }
      } catch (err) {
        console.error("Error handling signaling message:", err)
      }
    }

    socket.onerror = (err) => {
      console.error("Signaling socket error:", err)
    }

    socket.onclose = () => {
      console.log("Signaling socket closed")
    }

    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
          }),
        )
      }
    }
  }

  // Create and send offer (for host)
  const createAndSendOffer = async (pc: RTCPeerConnection, socket: WebSocket) => {
    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })

      await pc.setLocalDescription(offer)

      socket.send(
        JSON.stringify({
          type: "offer",
          sdp: offer.sdp,
        }),
      )

      console.log("Offer created and sent")
    } catch (err) {
      console.error("Error creating offer:", err)
    }
  }

  // Handle offer (for guest)
  const handleOffer = async (pc: RTCPeerConnection, socket: WebSocket, data: any) => {
    try {
      await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: "offer",
          sdp: data.sdp,
        }),
      )

      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.send(
        JSON.stringify({
          type: "answer",
          sdp: answer.sdp,
        }),
      )

      console.log("Offer received and answer sent")
    } catch (err) {
      console.error("Error handling offer:", err)
    }
  }

  // Handle answer (for host)
  const handleAnswer = async (pc: RTCPeerConnection, data: any) => {
    try {
      await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: "answer",
          sdp: data.sdp,
        }),
      )

      console.log("Answer received and set")
    } catch (err) {
      console.error("Error handling answer:", err)
    }
  }

  // Handle ICE candidate
  const handleIceCandidate = async (pc: RTCPeerConnection, data: any) => {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
      console.log("ICE candidate added")
    } catch (err) {
      console.error("Error adding ICE candidate:", err)
    }
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

  // Handle hang up
  const handleHangUp = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }

    // Close peer connection
    if (peerConnection) {
      peerConnection.close()
    }

    // Close signaling socket
    if (signalingSocketRef.current) {
      signalingSocketRef.current.close()
    }

    // Redirect to matchmaking or home page
    window.location.href = "/matchmaking"
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }

      if (peerConnection) {
        peerConnection.close()
      }

      if (signalingSocketRef.current) {
        signalingSocketRef.current.close()
      }
    }
  }, [])

  // Update local video element when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }

    // Update remote video element when stream changes
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [localStream, remoteStream, isDeviceSelectionOpen])

  // Render the device selection UI or the video call UI based on readiness
  if (isDeviceSelectionOpen) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-6">
        <h2 className="text-xl font-bold text-center">Select Your Devices</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="camera-select">Camera</Label>
            <Select value={selectedVideoDevice} onValueChange={setSelectedVideoDevice}>
              <SelectTrigger id="camera-select">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mic-select">Microphone</Label>
            <Select value={selectedAudioDevice} onValueChange={setSelectedAudioDevice}>
              <SelectTrigger id="mic-select">
                <SelectValue placeholder="Select microphone" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={previewSelectedDevices}>
              Preview
            </Button>

            <Button
              className="flex-1"
              onClick={startWebRTCConnection}
              disabled={!selectedVideoDevice && !selectedAudioDevice}
            >
              Start Call
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main video call UI
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto p-4 h-[calc(100vh-8rem)]">
      <div className="md:col-span-2 relative bg-card rounded-lg overflow-hidden border border-border h-full">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-card-foreground/70">Waiting for peer to connect...</p>
          </div>
        )}

        <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-card rounded-lg overflow-hidden shadow-lg border border-border">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-medium mb-2">Connection Status</h3>
          <p className="text-sm">{connectionState}</p>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-medium mb-2">Controls</h3>
          <div className="flex gap-2">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleMicrophone}
              className="flex-1"
            >
              {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>

            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleCamera}
              className="flex-1"
            >
              {isVideoOff ? <VideoOff className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
              {isVideoOff ? "Show" : "Hide"}
            </Button>
          </div>

          <Button variant="destructive" className="w-full mt-4" onClick={handleHangUp}>
            <PhoneOff className="h-4 w-4 mr-2" />
            Hang Up
          </Button>
        </div>
      </div>
    </div>
  )
}

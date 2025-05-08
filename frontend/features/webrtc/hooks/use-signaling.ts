"use client"

import { useEffect, useRef } from "react"

interface UseSignalingProps {
  enabled: boolean
  matchId: string
  peerId: string
  role: string
  peerConnection: RTCPeerConnection | null
  createOffer: () => Promise<RTCSessionDescriptionInit>
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>
  setRemoteDescription: (desc: RTCSessionDescriptionInit) => Promise<void>
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>
}

export function useSignaling({
  enabled,
  matchId,
  peerId,
  role,
  peerConnection,
  createOffer,
  createAnswer,
  setRemoteDescription,
  addIceCandidate,
}: UseSignalingProps) {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!enabled || !matchId || !peerId || !peerConnection) return

    const socketUrl = `wss://localhost:8000/ws/signaling/match/${matchId}`
    console.log("📡 Connecting to signaling server:", socketUrl)

    const socket = new WebSocket(socketUrl)
    socketRef.current = socket

    socket.onopen = () => {
      console.log("✅ WebSocket signaling connected")
      socket.send(
        JSON.stringify({
          event: "client_ready",
          peerId,
          role,
        }),
      )
    }

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.event === "room_ready") {
          console.log("✅ Room is ready")
          if (role === "host") {
            const offer = await createOffer()
            socket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }))
          }
          return
        }

        if (data.type === "offer" && role === "guest") {
          console.log("📨 Received offer")
          await setRemoteDescription({ type: "offer", sdp: data.sdp })
          const answer = await createAnswer({ type: "offer", sdp: data.sdp })
          socket.send(JSON.stringify({ type: "answer", sdp: answer.sdp }))
        }

        if (data.type === "answer" && role === "host") {
          console.log("📨 Received answer")
          await setRemoteDescription({ type: "answer", sdp: data.sdp })
        }

        if (data.type === "ice-candidate") {
          console.log("📨 Received ICE candidate")
          await addIceCandidate(data.candidate)
        }
      } catch (err) {
        console.error("❌ Failed to process signaling message:", err)
      }
    }

    socket.onerror = (err) => {
      console.warn("⚠️ WebSocket error (non-blocking):", err)
    }

    socket.onclose = () => {
      console.log("🔌 WebSocket closed")
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
          }),
        )
      }
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [
    enabled,
    matchId,
    peerId,
    role,
    peerConnection,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
  ])
}

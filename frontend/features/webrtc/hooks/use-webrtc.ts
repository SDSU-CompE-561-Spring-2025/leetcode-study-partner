"use client"

import { useState, useEffect, useRef } from "react"
import { useSignaling } from "./use-signaling"

interface UseWebRTCReturn {
  peerConnection: RTCPeerConnection | null
  connectionState: RTCPeerConnectionState | "none"
  createOffer: () => Promise<RTCSessionDescriptionInit>
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>
  setRemoteDescription: (description: RTCSessionDescriptionInit) => Promise<void>
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>
  remoteStream: MediaStream | null
}

interface SignalingProps {
  matchId: string
  peerId: string
  role: string
}

export function useWebRTC(localStream: MediaStream | null, signalingProps: SignalingProps): UseWebRTCReturn {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null)
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | "none">("none")
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const remoteStreamRef = useRef<MediaStream | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)

  // Initialize WebRTC peer connection
  useEffect(() => {
    if (typeof window === "undefined" || !localStream) return

    const iceServers = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

    console.log("Initializing WebRTC with stream:", localStream.id)
    console.log("Audio tracks:", localStream.getAudioTracks().length)
    console.log("Video tracks:", localStream.getVideoTracks().length)

    const pc = new RTCPeerConnection(iceServers)
    pcRef.current = pc
    remoteStreamRef.current = new MediaStream()

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate)
      }
    }

    pc.onconnectionstatechange = () => {
      console.log("Connection state changed:", pc.connectionState)
      setConnectionState(pc.connectionState)
    }

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) return

      console.log("Received remote track:", event.track.kind)
      event.streams[0].getTracks().forEach((track) => {
        console.log("Adding remote track to stream:", track.kind)
        remoteStreamRef.current?.addTrack(track)
      })

      setRemoteStream(new MediaStream(remoteStreamRef.current.getTracks()))
    }

    // Add local tracks to the peer connection
    localStream.getTracks().forEach((track) => {
      console.log("Adding local track to peer connection:", track.kind)
      pc.addTrack(track, localStream)
    })

    setPeerConnection(pc)
    setConnectionState(pc.connectionState)

    return () => {
      console.log("Cleaning up WebRTC connection")
      pc.close()
      remoteStreamRef.current?.getTracks().forEach((track) => track.stop())
      remoteStreamRef.current = null
      pcRef.current = null
    }
  }, [localStream])

  // Update tracks when local stream changes
  useEffect(() => {
    if (!peerConnection || !localStream) return

    const senders = peerConnection.getSenders()
    const currentTracks = senders.map((sender) => sender.track)

    // Add new tracks that aren't already in the peer connection
    localStream.getTracks().forEach((track) => {
      if (!currentTracks.find((t) => t && t.id === track.id)) {
        peerConnection.addTrack(track, localStream)
      }
    })

    // Remove tracks that are no longer in the local stream
    senders.forEach((sender) => {
      if (sender.track && !localStream.getTracks().find((t) => t.id === sender.track!.id)) {
        peerConnection.removeTrack(sender)
      }
    })
  }, [peerConnection, localStream])

  const createOffer = async (): Promise<RTCSessionDescriptionInit> => {
    if (!peerConnection) throw new Error("Peer connection not initialized")

    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })

    await peerConnection.setLocalDescription(offer)
    return offer
  }

  const createAnswer = async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
    if (!peerConnection) throw new Error("Peer connection not initialized")

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    return answer
  }

  const setRemoteDescription = async (description: RTCSessionDescriptionInit): Promise<void> => {
    if (!peerConnection) throw new Error("Peer connection not initialized")

    await peerConnection.setRemoteDescription(new RTCSessionDescription(description))
  }

  const addIceCandidate = async (candidate: RTCIceCandidateInit): Promise<void> => {
    if (!peerConnection) throw new Error("Peer connection not initialized")

    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  // Initialize signaling
  useSignaling({
    ...signalingProps,
    peerConnection,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
  })

  return {
    peerConnection,
    connectionState,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    remoteStream,
  }
}

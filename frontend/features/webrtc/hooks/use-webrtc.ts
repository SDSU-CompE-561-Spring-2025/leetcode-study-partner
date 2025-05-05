"use client";

import { useState, useEffect, useRef } from "react";

interface UseWebRTCReturn {
  peerConnection: RTCPeerConnection | null;
  connectionState: RTCPeerConnectionState | "none";
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  setRemoteDescription: (description: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  remoteStream: MediaStream | null;
}

export function useWebRTC(localStream: MediaStream | null): UseWebRTCReturn {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | "none">("none");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Initialize remoteStreamRef safely (only on client)
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // Initialize peer connection (runs only on client)
  useEffect(() => {
    // Skip if not in browser
    if (typeof window === "undefined") return;

    const iceServers = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(iceServers);

    // Initialize remote stream ref
    remoteStreamRef.current = new MediaStream();

    // Set up event listeners
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
      }
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
    };

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) return;
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current?.addTrack(track);
      });
      setRemoteStream(new MediaStream(remoteStreamRef.current.getTracks()));
    };

    setPeerConnection(pc);
    setConnectionState(pc.connectionState);

    return () => {
      pc.close();
      remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    };
  }, []);

  // Add local tracks to peer connection (only if peerConnection and localStream exist)
  useEffect(() => {
    if (!peerConnection || !localStream) return;

    // Remove existing senders
    const senders = peerConnection.getSenders();
    senders.forEach((sender) => {
      peerConnection.removeTrack(sender);
    });

    // Add new tracks
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }, [peerConnection, localStream]);

  // Create an offer
  const createOffer = async (): Promise<RTCSessionDescriptionInit> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  };

  // Create an answer
  const createAnswer = async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  };

  // Set remote description
  const setRemoteDescription = async (description: RTCSessionDescriptionInit): Promise<void> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    await peerConnection.setRemoteDescription(new RTCSessionDescription(description));
  };

  // Add ICE candidate
  const addIceCandidate = async (candidate: RTCIceCandidateInit): Promise<void> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return {
    peerConnection,
    connectionState,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    remoteStream,
  };
}
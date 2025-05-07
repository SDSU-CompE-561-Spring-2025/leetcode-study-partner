"use client";

import { useState, useEffect, useRef } from "react";
import { useSignaling } from "./use-signaling";

interface UseWebRTCReturn {
  peerConnection: RTCPeerConnection | null;
  connectionState: RTCPeerConnectionState | "none";
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  setRemoteDescription: (description: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  remoteStream: MediaStream | null;
}

interface SignalingProps {
  matchId: string;
  peerId: string;
  role: string;
}

export function useWebRTC(localStream: MediaStream | null, signalingProps: SignalingProps): UseWebRTCReturn {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | "none">("none");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const remoteStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const iceServers = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(iceServers);
    remoteStreamRef.current = new MediaStream();

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

  useEffect(() => {
    if (!peerConnection || !localStream) return;

    const senders = peerConnection.getSenders();
    senders.forEach((sender) => peerConnection.removeTrack(sender));

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }, [peerConnection, localStream]);

  const createOffer = async (): Promise<RTCSessionDescriptionInit> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  };

  const setRemoteDescription = async (description: RTCSessionDescriptionInit): Promise<void> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    await peerConnection.setRemoteDescription(new RTCSessionDescription(description));
  };

  const addIceCandidate = async (candidate: RTCIceCandidateInit): Promise<void> => {
    if (!peerConnection) throw new Error("Peer connection not initialized");
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  useSignaling({
    ...signalingProps,
    peerConnection,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
  });

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

import { useEffect } from "react";

interface UseSignalingProps {
  matchId: string;
  peerId: string;
  role: string;
  peerConnection: RTCPeerConnection | null;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  setRemoteDescription: (desc: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
}

export function useSignaling({
  matchId,
  peerId,
  role,
  peerConnection,
  createOffer,
  createAnswer,
  setRemoteDescription,
  addIceCandidate,
}: UseSignalingProps) {
  useEffect(() => {
    if (!matchId || !peerId || !peerConnection) return;

    const protocol = "wss"
    const normalizedMatchId = matchId;
    const socketUrl = `${protocol}://localhost:8000/ws/signaling/match/${normalizedMatchId}`;

    console.log("📡 Connecting to signaling server:", socketUrl);

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("✅ WebSocket signaling connected");
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "room_ready") {
        console.log("✅ Room is ready");
        if (role === "host") {
          const offer = await createOffer();
          socket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
        }
        return;
      }

      if (data.type === "offer" && role === "guest") {
        console.log("📨 Received offer");
        await setRemoteDescription({ type: "offer", sdp: data.sdp });
        const answer = await createAnswer({ type: "offer", sdp: data.sdp });
        socket.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
      }

      if (data.type === "answer" && role === "host") {
        console.log("📨 Received answer");
        await setRemoteDescription({ type: "answer", sdp: data.sdp });
      }

      if (data.type === "ice-candidate") {
        console.log("📨 Received ICE candidate");
        await addIceCandidate(data.candidate);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: "ice-candidate", candidate: event.candidate }));
      }
    };

    return () => {
      socket.close();
    };
  }, [matchId, peerId, role, peerConnection]);
}
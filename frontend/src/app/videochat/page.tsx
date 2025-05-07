'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import VideoWindow from '../../../features/webrtc/components/video-window';

export default function VideoChat() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [matchData, setMatchData] = useState<{
    matchId: string;
    peerId: string;
    role: string;
    signalingUrl: string;
  } | null>(null);

  useEffect(() => {
    const matchId = searchParams.get('match_id');
    const peerId = searchParams.get('peer_id');
    const role = searchParams.get('role');
    const signalingUrl = searchParams.get('signaling_url');

    if (!matchId || !peerId || !role || !signalingUrl) {
      console.error('Missing match data in URL, redirecting...');
      router.push('/matchmaking');
      return;
    }

    setMatchData({
      matchId,
      peerId,
      role,
      signalingUrl,
    });
    setReady(true);
  }, [searchParams, router]);

  if (!ready || !matchData) return <p className="text-white">Loading...</p>;

  return (
    <main className="min-h-[calc(100vh-80px)] p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <VideoWindow
        matchId={matchData.matchId}
        peerId={matchData.peerId}
        role={matchData.role}
        signalingUrl={matchData.signalingUrl}
      />
    </main>
  );
}
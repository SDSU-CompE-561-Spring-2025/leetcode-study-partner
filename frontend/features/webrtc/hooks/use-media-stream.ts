"use client"

import { useRef, useEffect } from "react"

export function useMediaStream(stream: MediaStream | null) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return videoRef
}
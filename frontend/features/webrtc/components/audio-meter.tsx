"use client"

import { useEffect, useRef } from "react"

interface AudioMeterProps {
  stream: MediaStream | null
  onLevelChange?: (level: number) => void
}

export default function AudioMeter({ stream, onLevelChange }: AudioMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!stream || !canvasRef.current) return

    // Create audio context and analyzer
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    // Connect the audio stream to the analyzer
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    // Store references
    audioContextRef.current = audioContext
    analyserRef.current = analyser

    // Get canvas context
    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return

    // Draw function
    const draw = () => {
      if (!analyserRef.current || !canvasCtx) return

      // Request next animation frame
      animationFrameRef.current = requestAnimationFrame(draw)

      // Get audio data
      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate average level
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const average = sum / bufferLength

      // Normalize to 0-100
      const level = Math.min(100, Math.max(0, average * 1.5))

      // Call the callback if provided
      if (onLevelChange) {
        onLevelChange(level)
      }

      // Clear canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      canvasCtx.fillStyle = "var(--color-secondary)"
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw meter
      const meterWidth = (level / 100) * canvas.width

      // Choose color based on level
      let color
      if (level < 30) {
        color = "var(--color-primary)"
      } else if (level < 70) {
        color = "var(--color-chart-4)"
      } else {
        color = "var(--color-destructive)"
      }

      canvasCtx.fillStyle = color
      canvasCtx.fillRect(0, 0, meterWidth, canvas.height)
    }

    // Start drawing
    draw()

    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stream, onLevelChange])

  return <canvas ref={canvasRef} className="w-full h-2 rounded-full" />
}

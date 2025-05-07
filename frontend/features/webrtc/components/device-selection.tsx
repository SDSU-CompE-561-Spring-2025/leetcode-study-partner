"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface DeviceSelectionProps {
  videoDevices: MediaDeviceInfo[]
  audioDevices: MediaDeviceInfo[]
  selectedVideoDevice: string
  selectedAudioDevice: string
  onDeviceSelect: (kind: "videoinput" | "audioinput", deviceId: string) => void
  onPreview: () => Promise<void>
  onStartCall: () => Promise<void>
  localStream: MediaStream | null
}

export default function DeviceSelection({
  videoDevices,
  audioDevices,
  selectedVideoDevice,
  selectedAudioDevice,
  onDeviceSelect,
  onPreview,
  onStartCall,
  localStream,
}: DeviceSelectionProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  // Audio analyzer refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Update local video element when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  // Set up audio analyzer for the audio meter
  useEffect(() => {
    if (!localStream) return

    // Clean up previous analyzer
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Create audio context and analyzer
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256

    // Connect the audio stream to the analyzer
    const source = audioContext.createMediaStreamSource(localStream)
    source.connect(analyser)

    // Store references
    audioContextRef.current = audioContext
    analyserRef.current = analyser

    // Start analyzing audio levels
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const updateAudioLevel = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate average volume level
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const average = sum / dataArray.length

      // Normalize to 0-100
      const normalizedLevel = Math.min(100, Math.max(0, average * 1.5))
      setAudioLevel(normalizedLevel)

      // Continue analyzing
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
    }

    updateAudioLevel()

    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [localStream])

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold text-center">Select Your Devices</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="camera-select">Camera</Label>
          <Select value={selectedVideoDevice} onValueChange={(value) => onDeviceSelect("videoinput", value)}>
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
          <Select value={selectedAudioDevice} onValueChange={(value) => onDeviceSelect("audioinput", value)}>
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

          {/* Audio Meter */}
          {localStream && (
            <div className="mt-2">
              <Label className="text-xs mb-1 block">Audio Level</Label>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${audioLevel}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onPreview}>
            Preview
          </Button>

          <Button className="flex-1" onClick={onStartCall} disabled={!selectedVideoDevice && !selectedAudioDevice}>
            Start Call
          </Button>
        </div>
      </div>
    </div>
  )
}

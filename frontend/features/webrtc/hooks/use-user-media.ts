"use client"

import { useState, useEffect } from "react"

type DeviceKind = "videoinput" | "audioinput" | "audiooutput"

interface UseUserMediaReturn {
  stream: MediaStream | null
  error: Error | null
  availableDevices: {
    videoinput: MediaDeviceInfo[]
    audioinput: MediaDeviceInfo[]
    audiooutput: MediaDeviceInfo[]
  }
  currentDevices: {
    videoinput?: string
    audioinput?: string
    audiooutput?: string
  }
  switchDevice: (kind: DeviceKind, deviceId: string) => void
}

export function useUserMedia(): UseUserMediaReturn {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [availableDevices, setAvailableDevices] = useState<{
    videoinput: MediaDeviceInfo[]
    audioinput: MediaDeviceInfo[]
    audiooutput: MediaDeviceInfo[]
  }>({
    videoinput: [],
    audioinput: [],
    audiooutput: [],
  })
  const [currentDevices, setCurrentDevices] = useState<{
    videoinput?: string
    audioinput?: string
    audiooutput?: string
  }>({})

  // Function to get available devices
  const getAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      const groupedDevices = devices.reduce(
        (acc, device) => {
          if (device.kind === "videoinput") {
            acc.videoinput.push(device)
          } else if (device.kind === "audioinput") {
            acc.audioinput.push(device)
          } else if (device.kind === "audiooutput") {
            acc.audiooutput.push(device)
          }
          return acc
        },
        {
          videoinput: [] as MediaDeviceInfo[],
          audioinput: [] as MediaDeviceInfo[],
          audiooutput: [] as MediaDeviceInfo[],
        },
      )

      setAvailableDevices(groupedDevices)

      // Set default devices if not already set
      setCurrentDevices((prev) => ({
        videoinput: prev.videoinput || groupedDevices.videoinput[0]?.deviceId || undefined,
        audioinput: prev.audioinput || groupedDevices.audioinput[0]?.deviceId || undefined,
        audiooutput: prev.audiooutput || groupedDevices.audiooutput[0]?.deviceId || undefined,
      }))
    } catch (err) {
      console.error("Error enumerating devices:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  // Function to get user media
  const getUserMedia = async () => {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: currentDevices.videoinput ? { deviceId: { exact: currentDevices.videoinput } } : true,
        audio: currentDevices.audioinput ? { deviceId: { exact: currentDevices.audioinput } } : true,
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setError(null)

      // Update device list after getting permission
      await getAvailableDevices()
    } catch (err) {
      console.error("Error getting user media:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setStream(null)
    }
  }

  // Function to switch device
  const switchDevice = (kind: DeviceKind, deviceId: string) => {
    setCurrentDevices((prev) => ({
      ...prev,
      [kind]: deviceId,
    }))
  }

  // Initialize devices and get user media on mount
  useEffect(() => {
    getAvailableDevices()

    // Listen for device changes
    const handleDeviceChange = () => {
      getAvailableDevices()
    }

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange)

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange)
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Get user media when current devices change
  useEffect(() => {
    getUserMedia()
  }, [currentDevices.videoinput, currentDevices.audioinput])

  // Set audio output device when it changes
  useEffect(() => {
    if (currentDevices.audiooutput) {
      // Apply to all audio elements
      document.querySelectorAll("audio, video").forEach((el) => {
        if ("setSinkId" in el) {
          // TypeScript doesn't recognize setSinkId by default
          ;(el as any)
            .setSinkId(currentDevices.audiooutput)
            .catch((err: Error) => console.error("Error setting audio output:", err))
        }
      })
    }
  }, [currentDevices.audiooutput])

  return {
    stream,
    error,
    availableDevices,
    currentDevices,
    switchDevice,
  }
}

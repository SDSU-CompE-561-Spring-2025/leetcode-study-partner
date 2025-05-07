"use client"

import { useState, useEffect, useCallback } from "react"

interface DeviceInfo {
  audioinput: MediaDeviceInfo[]
  videoinput: MediaDeviceInfo[]
  audiooutput: MediaDeviceInfo[]
}

interface UserMediaHook {
  stream: MediaStream | null
  error: Error | null
  availableDevices: DeviceInfo
  currentDevices: {
    audioinput?: string
    videoinput?: string
    audiooutput?: string
  }
  switchDevice: (kind: "audioinput" | "videoinput" | "audiooutput", deviceId: string) => void
}

export function useUserMedia(): UserMediaHook {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [availableDevices, setAvailableDevices] = useState<DeviceInfo>({
    audioinput: [],
    videoinput: [],
    audiooutput: [],
  })
  const [currentDevices, setCurrentDevices] = useState<{
    audioinput?: string
    videoinput?: string
    audiooutput?: string
  }>({})

  // Update the list of available devices
  const updateAvailableDevices = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      const grouped = {
        audioinput: devices.filter((d) => d.kind === "audioinput"),
        videoinput: devices.filter((d) => d.kind === "videoinput"),
        audiooutput: devices.filter((d) => d.kind === "audiooutput"),
      }

      setAvailableDevices(grouped)
    } catch (err) {
      console.warn("Failed to get media devices", err)
    }
  }, [])

  // Initialize media stream
  const getMedia = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })

      setStream(stream)
      setError(null)

      // Update device list after getting stream
      await updateAvailableDevices()

      // Set current devices based on active tracks
      setCurrentDevices({
        audioinput: stream.getAudioTracks()[0]?.getSettings().deviceId,
        videoinput: stream.getVideoTracks()[0]?.getSettings().deviceId,
      })
    } catch (err) {
      console.warn("Video+Audio failed, trying audio only...", err)

      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        })

        setStream(audioOnlyStream)
        setError(null)

        await updateAvailableDevices()

        setCurrentDevices({
          audioinput: audioOnlyStream.getAudioTracks()[0]?.getSettings().deviceId,
        })
      } catch (fallbackErr) {
        setError(fallbackErr as Error)
        console.error("Failed to get any media devices:", fallbackErr)
      }
    }
  }, [updateAvailableDevices])

  // Switch to a different media device
  const switchDevice = useCallback(
    async (kind: "audioinput" | "videoinput" | "audiooutput", deviceId: string) => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices) return

      // Handle audio output device separately
      if (kind === "audiooutput") {
        setCurrentDevices((prev) => ({ ...prev, audiooutput: deviceId }))
        return
      }

      try {
        // Get a new stream with the selected device
        const constraints: MediaStreamConstraints = {}

        // Keep existing tracks that we're not changing
        if (kind === "audioinput") {
          constraints.audio = { deviceId: { exact: deviceId } }
          if (stream?.getVideoTracks().length) {
            const videoTrack = stream.getVideoTracks()[0]
            const videoSettings = videoTrack.getSettings()
            constraints.video = { deviceId: { exact: videoSettings.deviceId } }
          }
        } else if (kind === "videoinput") {
          constraints.video = { deviceId: { exact: deviceId } }
          if (stream?.getAudioTracks().length) {
            const audioTrack = stream.getAudioTracks()[0]
            const audioSettings = audioTrack.getSettings()
            constraints.audio = { deviceId: { exact: audioSettings.deviceId } }
          }
        }

        // Get a completely new stream with the selected devices
        const newStream = await navigator.mediaDevices.getUserMedia(constraints)

        // Stop all tracks in the old stream
        if (stream) {
          stream.getTracks().forEach((track) => {
            if (
              (kind === "audioinput" && track.kind === "audio") ||
              (kind === "videoinput" && track.kind === "video")
            ) {
              track.stop()
            }
          })
        }

        // Create a new stream with the new tracks
        const updatedStream = new MediaStream()

        // Add tracks from the old stream that we're keeping
        if (stream) {
          stream.getTracks().forEach((track) => {
            if (
              (kind === "audioinput" && track.kind !== "audio") ||
              (kind === "videoinput" && track.kind !== "video")
            ) {
              updatedStream.addTrack(track)
            }
          })
        }

        // Add the new tracks
        newStream.getTracks().forEach((track) => {
          updatedStream.addTrack(track)
        })

        // Update the stream state
        setStream(updatedStream)

        // Update current devices state
        setCurrentDevices((prev) => ({ ...prev, [kind]: deviceId }))
      } catch (err) {
        console.error(`Failed to switch ${kind} device:`, err)
      }
    },
    [stream],
  )

  // Initialize on mount
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return

    // Listen for device changes
    navigator.mediaDevices.addEventListener("devicechange", updateAvailableDevices)

    // Get initial media stream
    getMedia()

    return () => {
      // Clean up
      navigator.mediaDevices.removeEventListener("devicechange", updateAvailableDevices)

      // Stop all tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [getMedia, updateAvailableDevices])

  return {
    stream,
    error,
    availableDevices,
    currentDevices,
    switchDevice,
  }
}

"use client"

import { useState, useEffect, useCallback } from "react"

export function useUserMedia() {
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

  // Initialize device list
  useEffect(() => {
    const initDevices = async () => {
      try {
        // First request permissions to get labeled devices
        await navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((tempStream) => {
            // Stop the temporary stream immediately
            tempStream.getTracks().forEach((track) => track.stop())
          })
          .catch((err) => {
            console.error("Error getting initial permissions:", err)
          })

        // Now enumerate devices
        await updateAvailableDevices()
      } catch (err) {
        console.error("Error initializing devices:", err)
      }
    }

    initDevices()

    // Listen for device changes
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener("devicechange", updateAvailableDevices)
    }

    return () => {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        navigator.mediaDevices.removeEventListener("devicechange", updateAvailableDevices)
      }
    }
  }, [updateAvailableDevices])

  // Get stream with specific devices
  const getStreamWithDevices = useCallback(
    async (videoDeviceId?: string, audioDeviceId?: string) => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices) return null

      try {
        // Stop any existing tracks
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }

        // Build constraints based on selected devices
        const constraints: MediaStreamConstraints = {
          video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
          audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
        }

        console.log("Getting user media with constraints:", constraints)

        // Get the stream with selected devices
        const newStream = await navigator.mediaDevices.getUserMedia(constraints)
        setStream(newStream)
        setError(null)

        // Update current devices
        setCurrentDevices({
          videoinput: newStream.getVideoTracks()[0]?.getSettings().deviceId,
          audioinput: newStream.getAudioTracks()[0]?.getSettings().deviceId,
        })

        return newStream
      } catch (err) {
        console.error("Error getting user media:", err)
        setError(err as Error)
        return null
      }
    },
    [stream],
  )

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return {
    stream,
    error,
    availableDevices,
    currentDevices,
    switchDevice,
    getStreamWithDevices,
  }
}

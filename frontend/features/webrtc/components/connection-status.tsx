"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConnectionStatusProps {
  connectionState: string
}

export default function ConnectionStatus({ connectionState }: ConnectionStatusProps) {
  // Helper function to get connection status color and text
  const getConnectionStatusInfo = () => {
    switch (connectionState) {
      case "connected":
        return { color: "bg-green-500", text: "Connected", description: "You are connected to your peer" }
      case "connecting":
        return { color: "bg-yellow-500", text: "Connecting", description: "Establishing connection..." }
      case "disconnected":
        return { color: "bg-red-500", text: "Disconnected", description: "You are not connected" }
      case "failed":
        return { color: "bg-red-700", text: "Failed", description: "Connection attempt failed" }
      case "closed":
        return { color: "bg-gray-500", text: "Closed", description: "Connection was closed" }
      default:
        return { color: "bg-gray-500", text: "Unknown", description: "Connection status unknown" }
    }
  }

  const statusInfo = getConnectionStatusInfo()

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusInfo.color}`}></div>
          <span className="font-medium">{statusInfo.text}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{statusInfo.description}</p>
      </CardContent>
    </Card>
  )
}

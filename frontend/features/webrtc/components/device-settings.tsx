"use client"
import { useState } from "react"
import { Settings, ChevronDown, Mic, Video, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface DeviceSettingsProps {
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
  onDeviceChange: (kind: "videoinput" | "audioinput" | "audiooutput", deviceId: string) => void
}

export default function DeviceSettings({ availableDevices, currentDevices, onDeviceChange }: DeviceSettingsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    camera: false,
    microphone: false,
    speaker: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Helper to get current device name
  const getCurrentDeviceName = (kind: "videoinput" | "audioinput" | "audiooutput") => {
    const deviceId = currentDevices[kind]
    if (!deviceId) return "Default"

    const device = availableDevices[kind].find((d) => d.deviceId === deviceId)
    return device?.label || `Device ${availableDevices[kind].indexOf(device!) + 1}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border-none"
        >
          <Settings className="h-4 w-4 text-primary-foreground" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-2 bg-card border border-border"
        alignOffset={0}
        align="end"
        side="bottom"
        sideOffset={5}
      >
        <h4 className="text-sm font-medium mb-2 px-2 text-card-foreground">Device Settings</h4>

        {/* Camera Section */}
        <Collapsible open={openSections.camera} onOpenChange={() => toggleSection("camera")} className="mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex justify-between items-center p-2 h-auto">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="text-sm">Camera</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground max-w-[100px] truncate">
                  {getCurrentDeviceName("videoinput")}
                </span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.camera && "rotate-180")} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pt-1">
            <div className="space-y-1">
              {availableDevices.videoinput.map((device) => (
                <Button
                  key={device.deviceId}
                  variant={currentDevices.videoinput === device.deviceId ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-7"
                  onClick={() => onDeviceChange("videoinput", device.deviceId)}
                >
                  {device.label || `Camera ${availableDevices.videoinput.indexOf(device) + 1}`}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Microphone Section */}
        <Collapsible open={openSections.microphone} onOpenChange={() => toggleSection("microphone")} className="mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex justify-between items-center p-2 h-auto">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="text-sm">Microphone</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground max-w-[100px] truncate">
                  {getCurrentDeviceName("audioinput")}
                </span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.microphone && "rotate-180")} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pt-1">
            <div className="space-y-1">
              {availableDevices.audioinput.map((device) => (
                <Button
                  key={device.deviceId}
                  variant={currentDevices.audioinput === device.deviceId ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-7"
                  onClick={() => onDeviceChange("audioinput", device.deviceId)}
                >
                  {device.label || `Microphone ${availableDevices.audioinput.indexOf(device) + 1}`}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Speaker Section */}
        <Collapsible open={openSections.speaker} onOpenChange={() => toggleSection("speaker")}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex justify-between items-center p-2 h-auto">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Speaker</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground max-w-[100px] truncate">
                  {getCurrentDeviceName("audiooutput")}
                </span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.speaker && "rotate-180")} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pt-1">
            <div className="space-y-1">
              {availableDevices.audiooutput.map((device) => (
                <Button
                  key={device.deviceId}
                  variant={currentDevices.audiooutput === device.deviceId ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-7"
                  onClick={() => onDeviceChange("audiooutput", device.deviceId)}
                >
                  {device.label || `Speaker ${availableDevices.audiooutput.indexOf(device) + 1}`}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

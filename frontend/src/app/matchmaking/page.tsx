"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckboxGroup } from "./checkbox-group"
import { useState, useEffect, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

//import { PROGRAMMING_LANGUAGES } from "@/lib/utils"

const PROGRAMMING_LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C#",
  "Go",
  "Ruby",
  "Swift",
  "Kotlin",
  "Rust",
  "Dart",
  "Scala",
  "Elixir",
  "Haskell",
  "Lua",
  "C",
  "C++",
]

export default function Matchmaking() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [allowUncategorized, setAllowUncategorized] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  //const [debugMessage, setDebugMessage] = useState<string>("")

  const router = useRouter();

  // Fetch categories from API
  useEffect(() => {
    fetch("https://localhost:8000/api/problem/tags")
      .then((res) => res.json())
      .then((data) => setCategories((data.tags ?? []).sort((a: string, b: string) => a.localeCompare(b))))
      .catch(() => setCategories([]))
  }, [])

  // Check if begin button should be enabled
  const isBeginEnabled = useCallback(() => {
    // At least one programming language must be selected
    const hasLanguage = selectedLanguages.length > 0

    // Either allow uncategorized problems OR at least one category is selected
    const hasCategory = allowUncategorized || selectedCategories.length > 0

    return hasLanguage && hasCategory
  }, [selectedLanguages, selectedCategories, allowUncategorized])

  // Handle begin button click
  const handleBegin = useCallback(() => {
    if (!isBeginEnabled()) return

    try {
      // Get the access token from session
      const token = session?.accessToken;
      
      if (!token) {
        console.error("No access token found in session");
        console.log("Session data:", session);
        setIsConnecting(false);
        return;
      }
    // Create the payload that would be sent
    const init_data = {
      token, 
      ticket:{
      programming_languages: selectedLanguages,
      categories: allowUncategorized
      ? [...selectedCategories, "None"]
      : selectedCategories,
      }
    }

    // Log the payload for debugging
    //console.log("Would send WebSocket payload:", payload)

    setIsConnecting(true)

    // WebSocket connection logic
      
      console.log("Using token for WebSocket connection:", token);
      
      // NOTE: For secure WebSocket connections with self-signed certificates:
      // 1. Run frontend with NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
      // 2. Make sure backend is running with SSL certificates
      const protocol = 'wss'; // Use secure WebSockets
      const host = 'localhost:8000'; // This could come from env config
      
      // Create WebSocket connection with token as query param - removed trailing slash
      const socket = new WebSocket(`${protocol}://${host}/ws/queue`);
      
      //console.log("Attempting WebSocket connection to:", `${protocol}://${host}/ws/connect`);

      socket.onopen = () => {
        // Send create_ticket event
        socket.send(JSON.stringify(init_data))
        console.log("WebSocket connection established, sent:", init_data)
      }

      socket.onmessage = (event) => {
        console.log("Message from server:", event.data)
        const message = JSON.parse(event.data)

        if (message.event === "match_found") {
          socket.close();

          //pass info to videochat page for webrtc connection
          //this is scuffed but i dont wanna mess with states rn sorry!!
          router.push(`/videochat?match_id=${message.match_id}&peer_id=${message.peer_id}&role=${message.role}&signaling_url=${message.signaling_url}`);

        }
      }

      socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnecting(false)
      }

      socket.onclose = (event) => {
        console.log("WebSocket connection closed", event.code, event.reason)
        setIsConnecting(false)
      }
    } catch (error) {
      console.error("Failed to connect:", error)
      setIsConnecting(false)
    }
  }, [selectedLanguages, selectedCategories, allowUncategorized, isBeginEnabled, session])

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Matchmaking - Select Preferences</h2>

      <Card className="w-full max-w-5xl p-6 bg-card rounded-xl shadow-md">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Programming Languages Card */}
          <CheckboxGroup
            title="Programming Languages"
            options={PROGRAMMING_LANGUAGES}
            idPrefix="programming-language"
            onSelectionChange={setSelectedLanguages}
          />

          {/* Categories Card */}
          <CheckboxGroup
            title="Categories"
            options={categories}
            idPrefix="category"
            onSelectionChange={setSelectedCategories}
          />
        </div>

        {/* Inline checkbox and button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={allowUncategorized}
              onCheckedChange={(checked) => setAllowUncategorized(checked === true)}
            />
            <span>Allow Uncategorized Problems?</span>
          </label>

          <Button
            className="self-center min-w-[100px]"
            disabled={!isBeginEnabled() || isConnecting}
            onClick={handleBegin}
          >
            {isConnecting ? "Connecting..." : "Begin"}
          </Button>
          {/*
          {debugMessage && (
            <div className="mt-6 w-full">
              <div className="bg-gray-800 rounded-md p-3 overflow-auto max-h-[200px] text-xs font-mono">
                <h4 className="text-sm font-semibold mb-2 text-green-400">WebSocket Message Preview:</h4>
                <pre>{debugMessage}</pre>
              </div>
            </div>
          )}
          */}
        </div>
      </Card>
    </div>
  )
}
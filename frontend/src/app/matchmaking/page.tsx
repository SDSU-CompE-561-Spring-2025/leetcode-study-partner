"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckboxGroup } from "./checkbox-group"
import { useState, useEffect, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [categories, setCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [allowUncategorized, setAllowUncategorized] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [debugMessage, setDebugMessage] = useState<string>("")

  // Fetch categories from API
  useEffect(() => {
    fetch("http://localhost:8000/api/problem/tags")
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

    // Create the payload that would be sent
    const payload = {
      event: "create_ticket",
      programming_languages: selectedLanguages,
      categories: allowUncategorized
      ? [...selectedCategories, "None"]
      : selectedCategories,
    }

    // Log the payload for debugging
    setDebugMessage(JSON.stringify(payload, null, 2))
    console.log("Would send WebSocket payload:", payload)

    setIsConnecting(true)

    // WebSocket connection logic
    try {
      // Create WebSocket connection
      const socket = new WebSocket("ws://localhost:8000/ws")

      socket.onopen = () => {
        // Send create_ticket event
        socket.send(JSON.stringify(payload))
        console.log("WebSocket connection established, sent:", payload)
      }

      socket.onmessage = (event) => {
        console.log("Message from server:", event.data)
        // Handle server response here
      }

      socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnecting(false)
      }

      socket.onclose = () => {
        console.log("WebSocket connection closed")
        setIsConnecting(false)
      }
    } catch (error) {
      console.error("Failed to connect:", error)
      setIsConnecting(false)
    }
  }, [selectedLanguages, selectedCategories, allowUncategorized, isBeginEnabled])

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
          {debugMessage && (
            <div className="mt-6 w-full">
              <div className="bg-gray-800 rounded-md p-3 overflow-auto max-h-[200px] text-xs font-mono">
                <h4 className="text-sm font-semibold mb-2 text-green-400">WebSocket Message Preview:</h4>
                <pre>{debugMessage}</pre>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

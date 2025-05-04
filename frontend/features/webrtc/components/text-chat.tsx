"use client"

import React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TextChatProps {
  messages: { text: string; sender: "me" | "peer" }[]
  message: string
  setMessage: (message: string) => void
  onSendMessage: () => void
}

// Function to break long strings without whitespace
const formatLongText = (text: string, maxLineLength = 20) => {
  const words = text.split(/(\s+)/) // Split including whitespace
  let result = ''
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    
    if (word.trim().length === 0) {
      // Preserve whitespace
      result += word
      continue
    }
    
    if (word.length > maxLineLength) {
      // Break long word into chunks
      let remaining = word
      while (remaining.length > 0) {
        const chunk = remaining.slice(0, maxLineLength)
        remaining = remaining.slice(maxLineLength)
        result += chunk + (remaining.length > 0 ? '\n' : '')
      }
    } else {
      result += word
    }
  }
  
  return result
}

export default function TextChat({ messages, message, setMessage, onSendMessage }: TextChatProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <Card className="h-full flex flex-col border border-border">
      <CardHeader className="py-2 px-3 border-b border-border">
        <CardTitle className="text-sm">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-[300px] w-full pr-3">
          <div className="space-y-4 p-3">
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-xs">No messages yet</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] rounded-lg px-3 py-1.5 break-words whitespace-pre-wrap ${
                      msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-secondary"
                    }`}
                  >
                    <p className="text-xs whitespace-pre-wrap">{formatLongText(msg.text)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t border-border">
        <div className="flex w-full items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type..."
            className="flex-grow text-xs h-8"
          />
          <Button size="icon" className="h-8 w-8" onClick={onSendMessage} disabled={!message.trim()}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
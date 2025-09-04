"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Dynamic import of Monaco to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading editor...</div>,
})

interface CollaborativeEditorProps {
  matchId: string
  dataChannel: RTCDataChannel | null
  onCodeChange?: (code: string) => void
}

// Custom Yjs sync provider using WebRTC data channel
class DataChannelProvider {
  private doc: any = null
  private yText: any = null
  private binding: any = null
  private awareness: any = null
  private Y: any = null

  constructor(
    private dataChannel: RTCDataChannel,
    private onReady: () => void,
    private onError: (error: any) => void
  ) {
    console.log("🏗️ DataChannelProvider constructor called with:", {
      dataChannel: !!dataChannel,
      readyState: dataChannel?.readyState,
      label: dataChannel?.label
    })
    
    this.setupDataChannel()
    this.initializeYjs()
  }

  private async initializeYjs() {
    console.log("🔄 Initializing Yjs...")
    try {
      // Dynamic import to avoid SSR
      this.Y = await import("yjs")
      const { Awareness } = await import("y-protocols/awareness")
      
      console.log("📚 Yjs modules loaded successfully")
      
      this.doc = new this.Y.Doc()
      this.yText = this.doc.getText("monaco")
      this.awareness = new Awareness(this.doc)
      
      console.log("📄 Yjs document created:", {
        docId: this.doc.guid,
        textLength: this.yText.length
      })
      
      // Listen for document updates
      this.doc.on("update", (update: Uint8Array) => {
        console.log("📤 Yjs update generated:", {
          updateSize: update.length,
          dataChannelState: this.dataChannel.readyState
        })
        
        if (this.dataChannel.readyState === "open") {
          try {
            // Try different approaches to send the data
            if (update.buffer instanceof ArrayBuffer) {
              this.dataChannel.send(update.buffer)
              console.log("✅ Update sent via ArrayBuffer")
            } else {
              // Create a new ArrayBuffer from the Uint8Array
              const buffer = new ArrayBuffer(update.length)
              const view = new Uint8Array(buffer)
              view.set(update)
              this.dataChannel.send(buffer)
              console.log("✅ Update sent via new ArrayBuffer")
            }
          } catch (error) {
            console.error("❌ Error sending Yjs update:", error)
          }
        } else {
          console.warn("⚠️ Data channel not open, cannot send update. State:", this.dataChannel.readyState)
        }
      })

      console.log("✅ Yjs initialized successfully")
      this.onReady()
    } catch (error) {
      console.error("❌ Failed to initialize Yjs:", error)
      this.onError(error)
    }
  }

  private setupDataChannel() {
    console.log("🔗 Setting up data channel message handler")
    
    this.dataChannel.onmessage = async (event) => {
      console.log("📥 Data channel message received:", {
        type: typeof event.data,
        size: event.data?.byteLength || event.data?.length || 0,
        isArrayBuffer: event.data instanceof ArrayBuffer,
        isUint8Array: event.data instanceof Uint8Array
      })
      
      try {
        // Receive updates from remote peer
        let update: Uint8Array
        
        if (event.data instanceof ArrayBuffer) {
          update = new Uint8Array(event.data)
          console.log("📥 Converted ArrayBuffer to Uint8Array")
        } else if (event.data instanceof Uint8Array) {
          update = event.data
          console.log("📥 Using Uint8Array directly")
        } else {
          console.warn("⚠️ Unexpected data type received:", typeof event.data, event.data)
          return
        }
        
        if (this.doc && this.Y) {
          console.log("📝 Applying Yjs update, size:", update.length)
          this.Y.applyUpdate(this.doc, update)
          console.log("✅ Yjs update applied successfully")
        } else {
          console.warn("⚠️ Yjs not ready, cannot apply update")
        }
      } catch (error) {
        console.error("❌ Error applying Yjs update:", error)
      }
    }
  }

  async bindToMonaco(editor: any) {
    console.log("🔗 Attempting to bind Monaco editor:", {
      hasDoc: !!this.doc,
      hasYText: !!this.yText,
      hasEditor: !!editor,
      hasAwareness: !!this.awareness
    })
    
    if (!this.doc || !this.yText || !editor) {
      console.warn("⚠️ Cannot bind Monaco - missing requirements")
      return
    }

    try {
      const { MonacoBinding } = await import("y-monaco")
      
      console.log("📚 MonacoBinding imported successfully")
      
      this.binding = new MonacoBinding(
        this.yText,
        editor.getModel()!,
        new Set([editor]),
        this.awareness
      )
      
      console.log("✅ Monaco binding created successfully:", {
        bindingId: this.binding.constructor.name,
        textLength: this.yText.length
      })
    } catch (error) {
      console.error("❌ Failed to bind Monaco:", error)
      this.onError(error)
    }
  }

  destroy() {
    if (this.binding) {
      this.binding.destroy()
    }
    if (this.doc) {
      this.doc.destroy()
    }
  }
}

export default function CollaborativeEditor({
  matchId,
  dataChannel,
  onCodeChange,
}: CollaborativeEditorProps) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<any>(null)
  const providerRef = useRef<DataChannelProvider | null>(null)

  // Initialize Yjs provider when data channel is ready
  useEffect(() => {
    console.log("🔄 DataChannel effect triggered:", {
      dataChannel: !!dataChannel,
      readyState: dataChannel?.readyState,
      label: dataChannel?.label,
      bufferedAmount: dataChannel?.bufferedAmount,
      bufferedAmountLowThreshold: dataChannel?.bufferedAmountLowThreshold,
      maxPacketLifeTime: dataChannel?.maxPacketLifeTime,
      maxRetransmits: dataChannel?.maxRetransmits,
      negotiated: dataChannel?.negotiated,
      ordered: dataChannel?.ordered,
      protocol: dataChannel?.protocol
    })

    if (!dataChannel) {
      console.log("❌ No data channel available")
      setIsReady(false)
      setError("No data channel")
      return
    }

    // Add comprehensive event listeners for debugging
    const handleOpen = () => {
      console.log("✅ Data channel opened!")
      initializeProvider()
    }
    
    const handleClose = () => {
      console.log("❌ Data channel closed")
      setIsReady(false)
      setError("Data channel closed")
    }
    
    const handleError = (event: any) => {
      console.error("❌ Data channel error:", event)
      setIsReady(false)
      setError("Data channel error")
    }
    
    const handleMessage = (event: MessageEvent) => {
      console.log("📨 Data channel message received:", {
        type: typeof event.data,
        size: event.data?.byteLength || event.data?.length || 0,
        data: event.data
      })
    }

    // Add all event listeners
    dataChannel.addEventListener("open", handleOpen)
    dataChannel.addEventListener("close", handleClose)
    dataChannel.addEventListener("error", handleError)
    dataChannel.addEventListener("message", handleMessage)

    if (dataChannel.readyState === "open") {
      console.log("✅ Data channel is already open, initializing provider immediately...")
      initializeProvider()
    } else {
      console.log("⏳ Data channel not open yet, current state:", dataChannel.readyState)
      setIsReady(false)
      setError(`Data channel state: ${dataChannel.readyState}`)
    }

    function initializeProvider() {
      console.log("🚀 Initializing DataChannelProvider...")
      if (!dataChannel) return
      
      // Clean up existing provider
      if (providerRef.current) {
        console.log("🧹 Cleaning up existing provider")
        providerRef.current.destroy()
      }
      
      const provider = new DataChannelProvider(
        dataChannel,
        () => {
          console.log("✅ Yjs provider ready")
          setIsReady(true)
          setError(null)
          
          // Bind to Monaco if editor is already mounted
          if (editorRef.current) {
            console.log("🔗 Binding to existing Monaco editor")
            provider.bindToMonaco(editorRef.current)
          }
        },
        (error) => {
          console.error("❌ Yjs provider error:", error)
          setError(`Yjs error: ${error.message || error}`)
          setIsReady(false)
        }
      )

      providerRef.current = provider
    }

    return () => {
      console.log("🧹 Cleaning up data channel listeners")
      if (dataChannel) {
        dataChannel.removeEventListener("open", handleOpen)
        dataChannel.removeEventListener("close", handleClose)
        dataChannel.removeEventListener("error", handleError)
        dataChannel.removeEventListener("message", handleMessage)
      }
      
      if (providerRef.current) {
        providerRef.current.destroy()
        providerRef.current = null
      }
    }
  }, [dataChannel])

  // Handle Monaco editor mount
  const handleEditorDidMount = (editor: any) => {
    console.log("🎯 Monaco editor mounted")
    editorRef.current = editor

    // Bind to Yjs if provider is ready
    if (providerRef.current && isReady) {
      console.log("🔗 Provider ready, binding immediately")
      providerRef.current.bindToMonaco(editor)
    } else {
      console.log("⏳ Provider not ready yet, will bind when ready:", {
        hasProvider: !!providerRef.current,
        isReady
      })
    }

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue()
      console.log("📝 Editor content changed, length:", code.length)
      onCodeChange?.(code)
    })

    console.log("✅ Monaco editor setup complete")
  }

  const getStatusColor = () => {
    if (error) return "bg-red-100 text-red-700"
    if (dataChannel?.readyState === "open" && isReady) return "bg-green-100 text-green-700"
    return "bg-yellow-100 text-yellow-700"
  }

  const getStatusText = () => {
    if (error) return "Error"
    if (!dataChannel) return "No Connection"
    if (dataChannel.readyState !== "open") return "Connecting..."
    if (!isReady) return "Initializing..."
    return "Sync Ready"
  }

  return (
    <div className="h-full border border-border rounded-lg overflow-hidden">
      <div className="p-2 border-b bg-muted flex items-center justify-between">
        <h3 className="text-sm font-medium">Collaborative Code Editor</h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <span className="text-xs text-muted-foreground">
            Room: {matchId.slice(0, 8)}...
          </span>
        </div>
      </div>
      <div className="h-[calc(100%-3rem)]">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-600">
            <div className="text-center">
              <p className="font-medium">Collaborative editing unavailable</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        ) : (
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            defaultValue="// Start coding together!\nfunction solution() {\n  // Your code here\n}\n"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "all",
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: "line",
            }}
            onMount={handleEditorDidMount}
          />
        )}
      </div>
    </div>
  )
}

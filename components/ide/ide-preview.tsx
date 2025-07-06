"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Maximize, RefreshCw } from "lucide-react"

export default function IdePreview({
  mainCode,
}: {
  mainCode: string
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update the iframe content when the code changes
  useEffect(() => {
    updateIframeContent()
  }, [mainCode])

  const updateIframeContent = () => {
    const iframe = iframeRef.current
    if (!iframe) return

    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document
    if (iframeDocument) {
      iframeDocument.open()
      iframeDocument.write(mainCode)
      iframeDocument.close()
    }
  }

  const refreshPreview = () => {
    setIsRefreshing(true)
    updateIframeContent()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const openInNewTab = () => {
    const newTab = window.open("", "_blank")
    if (newTab) {
      newTab.document.write(mainCode)
      newTab.document.close()
    }
  }

  return (
    <Card className="h-full flex flex-col border-none rounded-none shadow-none">
      <CardHeader className="p-2 border-b flex-row items-center justify-between space-y-0 bg-muted/30">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm font-medium">Preview</div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshPreview}
            className={`h-8 w-8 ${isRefreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw size={16} />
          </Button>

          <Button variant="ghost" size="icon" onClick={openInNewTab} className="h-8 w-8">
            <Maximize size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none"
          title="Code Preview"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </CardContent>
    </Card>
  )
}

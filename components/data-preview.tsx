"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileQuestion } from "lucide-react"

interface DataPreviewProps {
  dataUrl: string
}

interface ParsedDataUrl {
  mimeType: string
  encoding: string
  data: string
  isValid: boolean
}

export default function DataPreview({ dataUrl }: DataPreviewProps) {
  const [parsedData, setParsedData] = useState<ParsedDataUrl | null>(null)

  useEffect(() => {
    if (!dataUrl) {
      setParsedData(null)
      return
    }

    try {
      const match = dataUrl.match(/^data:([^;]+);([^,]+),(.+)$/)

      if (!match) {
        setParsedData({
          mimeType: "",
          encoding: "",
          data: "",
          isValid: false,
        })
        return
      }

      const [_, mimeType, encoding, data] = match

      setParsedData({
        mimeType,
        encoding,
        data,
        isValid: true,
      })
    } catch (error) {
      setParsedData({
        mimeType: "",
        encoding: "",
        data: "",
        isValid: false,
      })
    }
  }, [dataUrl])

  if (!dataUrl) {
    return <div className="text-center text-muted-foreground">Enter a data URL to see the preview</div>
  }

  if (!parsedData?.isValid) {
    return (
      <div className="text-center text-destructive">
        <FileQuestion className="h-12 w-12 mx-auto mb-2" />
        Invalid data URL format. Please enter a valid data URL.
      </div>
    )
  }

  const { mimeType, encoding, data } = parsedData
  const isBase64 = encoding === "base64"

  if (mimeType.startsWith("image/")) {
    return (
      <img src={dataUrl || "/placeholder.svg"} alt="Data URL Preview" className="max-w-full max-h-[400px] mx-auto" />
    )
  }

  if (mimeType === "application/pdf") {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="bg-muted p-2 text-xs mb-2 rounded flex justify-between items-center">
          <span>PDF Document</span>
          <a href={dataUrl} download="document.pdf">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </a>
        </div>
        <object
          data={dataUrl}
          type="application/pdf"
          className="w-full flex-1 min-h-[400px] border rounded"
          title="PDF Preview"
        >
          <div className="p-4 text-center bg-muted/50 rounded">
            <p className="text-muted-foreground mb-2">PDF cannot be displayed in this browser.</p>
            <p className="text-sm text-muted-foreground mb-4">
              Your browser doesn't support PDF viewing or the data URL was blocked.
            </p>
            <a href={dataUrl} download="document.pdf">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF to view
              </Button>
            </a>
          </div>
        </object>
      </div>
    )
  }

  if (mimeType.startsWith("audio/")) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="text-sm mb-2">Audio Preview</div>
        <audio controls src={dataUrl} className="w-full max-w-md">
          Your browser does not support audio playback.
        </audio>
      </div>
    )
  }

  if (mimeType.startsWith("video/")) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="text-sm mb-2">Video Preview</div>
        <video controls src={dataUrl} className="max-w-full max-h-[300px]">
          Your browser does not support video playback.
        </video>
      </div>
    )
  }

  if (mimeType.startsWith("application/") && !mimeType.includes("json")) {
    const fileExtension = mimeType.split("/")[1] || "bin"

    return (
      <div className="w-full h-full flex flex-col">
        <div className="bg-muted p-2 text-xs mb-2 rounded flex justify-between items-center">
          <span>{mimeType}</span>
          <a href={dataUrl} download={`file.${fileExtension}`}>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </a>
        </div>
        <object
          data={dataUrl}
          type={mimeType}
          className="w-full flex-1 min-h-[300px] border rounded"
          title={`${mimeType} Preview`}
        >
          <div className="p-4 text-center bg-muted/50 rounded">
            <FileQuestion className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">Cannot display {mimeType}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Your browser doesn't support this file type or the content was blocked.
            </p>
            <a href={dataUrl} download={`file.${fileExtension}`}>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </a>
          </div>
        </object>
      </div>
    )
  }

  if (mimeType === "text/plain" || mimeType === "text/html" || mimeType === "application/json") {
    let content = ""
    try {
      if (isBase64) {
        content = atob(data)
      } else {
        content = decodeURIComponent(data)
      }

      if (mimeType === "application/json") {
        try {
          const jsonObj = JSON.parse(content)
          content = JSON.stringify(jsonObj, null, 2)
        } catch (e) {
          // Keep as is if not valid JSON
        }
      }
    } catch (e) {
      content = "Error decoding content"
    }

    return (
      <div className="w-full h-full">
        <div className="bg-muted p-2 text-xs mb-2 rounded">
          {mimeType === "text/html" ? "HTML" : mimeType === "application/json" ? "JSON" : "Text"} Content
        </div>
        <pre className="text-xs overflow-auto p-2 bg-background border rounded max-h-[300px]">{content}</pre>
      </div>
    )
  }

  // For other MIME types, offer download
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <div className="text-center">
        <p className="mb-2">File type: {mimeType}</p>
        <p className="text-sm text-muted-foreground mb-4">Preview not available for this file type</p>
        <a href={dataUrl} download={`file.${mimeType.split("/")[1] || "bin"}`}>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </a>
      </div>
    </div>
  )
}

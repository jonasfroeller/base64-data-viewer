"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DataPreview from "@/components/data-preview"
import BrowserInfo from "@/components/browser-info"
import QuoteStripIndicator from "@/components/quote-strip-indicator"

function stripQuotes(input: string): string {
  const dataUrlMatch = input.match(/data:[^"'\s]+/g)
  if (dataUrlMatch && dataUrlMatch.length > 0) {
    return dataUrlMatch[0]
  }

  const firstQuoteIndex = input.indexOf('"')
  const lastQuoteIndex = input.lastIndexOf('"')

  if (firstQuoteIndex !== -1 && lastQuoteIndex !== -1 && firstQuoteIndex < lastQuoteIndex) {
    const extracted = input.substring(firstQuoteIndex + 1, lastQuoteIndex)

    if (extracted.startsWith("data:")) {
      return extracted
    }
  }

  if (input.trim().startsWith("data:")) {
    return input.trim()
  }

  return input
}

export default function DataUrlViewer() {
  const [dataUrl, setDataUrl] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [originalInput, setOriginalInput] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value
    setOriginalInput(rawInput)
    const processedInput = stripQuotes(rawInput)
    setDataUrl(processedInput)
    setError(null)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setOriginalInput(text)
      const processedText = stripQuotes(text)
      setDataUrl(processedText)
      setError(null)
    } catch (err) {
      setError("Failed to read from clipboard. Please paste manually.")
    }
  }

  const handleClear = () => {
    setDataUrl("")
    setError(null)
  }

  const copyToClipboard = async () => {
    if (!dataUrl) {
      toast({
        title: "Nothing to copy",
        description: "Please enter a base64 data URL first.",
        variant: "destructive",
      })
      return
    }

    try {
      await navigator.clipboard.writeText(dataUrl)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Base64 data URL copied to clipboard successfully.",
      })
      
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-3">
      <h1 className="text-3xl font-bold mb-6">Base64 Data Viewer</h1>
      <BrowserInfo />
      <QuoteStripIndicator original={originalInput} processed={dataUrl} />

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex gap-2">
          <Input
            value={dataUrl}
            onChange={handleInputChange}
            placeholder="Enter or paste a base64 data URL (data:application/pdf;base64,JVBERi0...)"
            className="flex-1"
          />
          <Button variant="outline" onClick={handlePaste}>
            Paste
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-muted/30 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Base64 Data URL</h2>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-background p-3 rounded border max-h-[50vh]">
            <pre className="text-xs break-all whitespace-pre-wrap h-full">{dataUrl || "No base64 data URL provided"}</pre>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="flex-1 flex items-center justify-center bg-background rounded border p-2 max-h-[50vh]">
            <DataPreview dataUrl={dataUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}

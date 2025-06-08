"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface QuoteStripIndicatorProps {
  original: string
  processed: string
}

export default function QuoteStripIndicator({ original, processed }: QuoteStripIndicatorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (original !== processed && original.includes('"')) {
      setVisible(true)

      const timer = setTimeout(() => {
        setVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [original, processed])

  if (!visible) return null

  return (
    <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
      <Info className="h-4 w-4 text-green-600" />
      <AlertDescription>Quotes were automatically stripped from your input.</AlertDescription>
    </Alert>
  )
}

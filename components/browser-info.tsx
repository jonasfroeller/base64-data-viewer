import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function BrowserInfo() {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Browser Compatibility:</strong> Some browsers (especially Chrome) may block certain data URLs for
        security reasons. If you see "Diese Seite wurde von Chrome blockiert" or similar messages, try downloading the
        file instead of previewing it inline.
      </AlertDescription>
    </Alert>
  )
}

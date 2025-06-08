import { Badge } from "@/components/ui/badge"

interface MimeTypeInfoProps {
  mimeType: string
}

export default function MimeTypeInfo({ mimeType }: MimeTypeInfoProps) {
  const getTypeCategory = (mime: string) => {
    if (mime.startsWith("image/")) return "Image"
    if (mime.startsWith("video/")) return "Video"
    if (mime.startsWith("audio/")) return "Audio"
    if (mime.startsWith("text/")) return "Text"
    if (mime === "application/pdf") return "PDF"
    if (mime === "application/json") return "JSON"
    return "Other"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Image":
        return "bg-green-500"
      case "Video":
        return "bg-blue-500"
      case "Audio":
        return "bg-purple-500"
      case "Text":
        return "bg-yellow-500"
      case "PDF":
        return "bg-red-500"
      case "JSON":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const category = getTypeCategory(mimeType)

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">{mimeType}</Badge>
      <Badge className={getCategoryColor(category)}>{category}</Badge>
    </div>
  )
}

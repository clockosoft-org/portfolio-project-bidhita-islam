"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function DownloadCVButton({ hasCv }: { hasCv?: boolean }) {
  const { toast } = useToast()

  const handleDownloadCV = () => {
    if (!hasCv) {
      toast({
        title: "CV not available",
        description: "The CV hasn't been uploaded yet. Add it from the admin profile page.",
      })
      return
    }

    // The CV lives in a PRIVATE Supabase bucket. /api/cv mints a short-lived
    // signed URL server-side and redirects to it.
    window.open("/api/cv", "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      size="lg"
      variant="outline"
      className="border-2 border-primary text-primary hover:bg-primary-light w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base bg-transparent"
      onClick={handleDownloadCV}
    >
      <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
      Download CV
    </Button>
  )
}

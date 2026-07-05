"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Users, ExternalLink, FileText, MapPin, ArrowRight, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ConferencePublicationSummaryProps {
  publication: {
    id: string
    title: string
    authors: string
    conference_title?: string
    conference_organizer?: string
    location?: string
    publication_date?: string
    status?: string
    conference_images?: string[]
    conference_videos?: string[]
    conference_paper_pdf?: string
    doi?: string
  }
}

export function ConferencePublicationSummary({ publication }: ConferencePublicationSummaryProps) {
  const images = publication.conference_images || []
  const videos = publication.conference_videos || []
  const hasImages = images.length > 0
  const hasVideos = videos.length > 0
  const hasMedia = hasImages || hasVideos

  return (
    <Card className="border border-gray-200/80 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group bg-white">
      <CardContent className="p-0">
        {/* Media Grid Section - Images and Videos */}
        {hasMedia ? (
          <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {/* Status Badge */}
            {publication.status && (
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-medium backdrop-blur-md shadow-sm ${
                    publication.status === "Published"
                      ? "bg-primary/95 text-white"
                      : "bg-yellow-500/95 text-white"
                  }`}
                >
                  {publication.status}
                </span>
              </div>
            )}
            
            {/* Grid of Images and Videos */}
            <div className={`grid gap-1 p-1 ${
              (images.length + videos.length) === 1 ? "grid-cols-1" :
              (images.length + videos.length) === 2 ? "grid-cols-2" :
              (images.length + videos.length) === 3 ? "grid-cols-2" :
              (images.length + videos.length) === 4 ? "grid-cols-2" :
              "grid-cols-3"
            }`}>
              {/* Render Images */}
              {images.slice(0, 6).map((image, index) => (
                <div
                  key={`img-${index}`}
                  className={`relative overflow-hidden rounded-sm group/image ${
                    (images.length + videos.length) === 1 ? "h-56" :
                    (images.length + videos.length) === 2 ? "h-40" :
                    (images.length + videos.length) === 3 && index === 0 ? "h-40 row-span-2" : "h-20"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${publication.title} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover/image:scale-110 transition-all duration-500"
                  />
                  {(images.length + videos.length) > 6 && index === 5 && images.length >= 6 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">+{(images.length + videos.length) - 6}</span>
                    </div>
                  )}
                </div>
              ))}
              {/* Render Videos */}
              {videos.slice(0, Math.max(0, 6 - images.length)).map((video, index) => (
                <div
                  key={`vid-${index}`}
                  className={`relative overflow-hidden rounded-sm group/video bg-black ${
                    (images.length + videos.length) === 1 ? "h-56" :
                    (images.length + videos.length) === 2 ? "h-40" :
                    (images.length + videos.length) === 3 && (images.length + index) === 0 ? "h-40 row-span-2" : "h-20"
                  }`}
                >
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-300" />
            {publication.status && (
              <div className="absolute top-4 right-4">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-medium backdrop-blur-md shadow-sm ${
                    publication.status === "Published"
                      ? "bg-primary/95 text-white"
                      : "bg-yellow-500/95 text-white"
                  }`}
                >
                  {publication.status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content Section - Minimalistic */}
        <div className="p-5 space-y-3">
          {/* Title - Most Important */}
          <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {publication.title}
          </h3>

          {/* Conference Name - Secondary Info */}
          {publication.conference_title && (
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
              <p className="text-muted-foreground line-clamp-1 font-medium">{publication.conference_title}</p>
            </div>
          )}

          {/* Authors - Compact */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            <p className="text-muted-foreground line-clamp-1">{publication.authors}</p>
          </div>

          {/* Date - Minimal */}
          {publication.publication_date && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{publication.publication_date}</span>
            </div>
          )}

          {/* Action - Clean CTA */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary-dark hover:bg-primary/5 px-0 font-medium"
            >
              <Link href="/publications" className="flex items-center gap-1.5">
                View Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            {publication.conference_paper_pdf ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-gray-50 ml-auto"
              >
                <a href={publication.conference_paper_pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="text-xs">PDF</span>
                </a>
              </Button>
            ) : publication.doi ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-gray-50 ml-auto"
              >
                <a
                  href={publication.doi.startsWith("http") ? publication.doi : `https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs">DOI</span>
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


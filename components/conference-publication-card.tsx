"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, MapPin, Users, ExternalLink, FileText, Video } from "lucide-react"
import { ImageGallery } from "./image-gallery"
import Image from "next/image"

interface ConferencePublicationCardProps {
  publication: {
    id: string
    title: string
    authors: string
    conference_title?: string
    conference_organizer?: string
    location?: string
    abstract?: string
    keywords?: string[]
    conference_images?: string[]
    conference_videos?: string[]
    conference_paper_pdf?: string
    doi?: string
    publication_date?: string
    status?: string
  }
}

export function ConferencePublicationCard({ publication }: ConferencePublicationCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <Card className="border-l-4 border-primary hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-foreground flex-1 text-balance">{publication.title}</h3>
          {publication.status && (
            <span
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ml-4 ${
                publication.status === "Published"
                  ? "bg-primary-light text-primary"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {publication.status}
            </span>
          )}
        </div>

        <div className="space-y-3 mb-4">
          {publication.conference_title && (
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Conference Title</p>
                <p className="text-sm text-muted-foreground">{publication.conference_title}</p>
              </div>
            </div>
          )}

          {publication.conference_organizer && (
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Organizer</p>
                <p className="text-sm text-muted-foreground">{publication.conference_organizer}</p>
              </div>
            </div>
          )}

          {publication.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">{publication.location}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="text-sm text-muted-foreground">{publication.authors}</span>
          </div>

          {publication.publication_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{publication.publication_date}</span>
            </div>
          )}
        </div>

        {publication.abstract && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Abstract</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{publication.abstract}</p>
          </div>
        )}

        {publication.keywords && publication.keywords.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Keywords</p>
            <p className="text-xs text-muted-foreground">{publication.keywords.join(", ")}</p>
          </div>
        )}

        {publication.conference_images && publication.conference_images.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-3">Conference Photos</p>
            {/* Horizontal Scrollable Image Row */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth transition-all">
                {publication.conference_images.map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden border border-gray-200 hover:border-primary cursor-pointer group transition-all duration-300 hover:shadow-lg"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={image}
                      alt={`${publication.title} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
            {/* Lightbox - Render ImageGallery when open */}
            {lightboxOpen && publication.conference_images && (
              <ImageGallery 
                images={publication.conference_images} 
                title={publication.title}
                initialIndex={lightboxIndex}
              />
            )}
          </div>
        )}

        {publication.conference_videos && publication.conference_videos.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
              <Video className="h-4 w-4" />
              Conference Videos
            </p>
            {/* Horizontal Scrollable Video Row */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth transition-all">
                {publication.conference_videos.map((video, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden border border-gray-200 hover:border-primary group transition-all duration-300 hover:shadow-lg bg-black"
                  >
                    <video
                      src={video}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {publication.conference_paper_pdf ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary text-primary bg-transparent"
          >
            <a href={publication.conference_paper_pdf} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-4 w-4" />
              Read Conference Paper <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : publication.doi ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary text-primary bg-transparent"
          >
            <a
              href={publication.doi.startsWith("http") ? publication.doi : `https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View via DOI <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}


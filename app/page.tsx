// Remove "use client" directive - this is now a Server Component
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactForm } from "@/components/contact-form"
import { ScrollButton } from "@/components/scroll-button"
import { DownloadCVButton } from "@/components/download-cv-button"
import {
  Download,
  Mail,
  School,
  Briefcase,
  Calendar,
  MapPin,
  BookOpen,
  Users,  
  ExternalLink,
  Award,
  Laptop,
  Languages,
  Heart,
  Building2,
  Phone,
  Linkedin,
  Facebook,
  ChevronDown,
  FileText,
  Quote,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConferencePublicationSummary } from "@/components/conference-publication-summary"
import { LinkPreview } from "@/components/link-preview"
import { GoogleScholarIcon, OrcidIcon, XIcon } from "@/components/social-icons"

const categoryIcons = {
  Interpersonal: Users,
  Technical: Laptop,
  Languages: Languages,
}

// Flag images mapping - using flagcdn.com CDN for high-quality flag images
const languageFlags: Record<string, string> = {
  Bengali: "https://flagcdn.com/w320/bd.png",
  Bangla: "https://flagcdn.com/w320/bd.png",
  English: "https://flagcdn.com/w320/gb.png",
  Hindi: "https://flagcdn.com/w320/in.png",
  Urdu: "https://flagcdn.com/w320/pk.png",
  Arabic: "https://flagcdn.com/w320/sa.png",
  Spanish: "https://flagcdn.com/w320/es.png",
  French: "https://flagcdn.com/w320/fr.png",
  German: "https://flagcdn.com/w320/de.png",
  Chinese: "https://flagcdn.com/w320/cn.png",
  Japanese: "https://flagcdn.com/w320/jp.png",
}

// Force dynamic rendering to prevent caching in production
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").single()
  const { data: education } = await supabase.from("education").select("*").order("display_order", { ascending: true })
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("display_order", { ascending: true })
  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("display_order", { ascending: true })
  const { data: awards } = await supabase.from("awards").select("*").order("display_order", { ascending: true })
  const { data: skills } = await supabase.from("skills").select("*").order("display_order", { ascending: true })
  const { data: volunteering } = await supabase
    .from("volunteering")
    .select("*")
    .order("display_order", { ascending: true })
  const { data: scholarlyActivities } = await supabase
    .from("scholarly_activities")
    .select("*")
    .order("display_order", { ascending: true })
  const { data: mediaCoverage } = await supabase
    .from("media_coverage")
    .select("*")
    .order("updated_at", { ascending: false })
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("display_order", { ascending: true })

  const researchExperiences = experiences?.filter((exp: any) => exp.category === "Research") || []
  const industryExperiences = experiences?.filter((exp: any) => exp.category === "Industry") || []

  const academicPublications = publications?.filter((pub: any) => pub.category === "Academic Publication") || []
  const nonAcademicPublications = publications?.filter((pub: any) => pub.category === "Non-Academic Publication") || []
  const conferencePublications = publications?.filter((pub: any) => pub.category === "Conference Publication") || []
  const workInProgress = publications?.filter((pub: any) => pub.category === "Work in Progress") || []

  const groupedSkills = skills?.reduce(
    (acc: any, skill: any) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  const maxItemsToShow = 3

  const hasEducation = (education?.length ?? 0) > 0
  const hasExperiences = (experiences?.length ?? 0) > 0
  const hasScholarlyActivities = (scholarlyActivities?.length ?? 0) > 0
  const hasPublications = (publications?.length ?? 0) > 0
  const hasAwards = (awards?.length ?? 0) > 0
  const hasMediaCoverage = (mediaCoverage?.length ?? 0) > 0
  const hasCertifications = (certifications?.length ?? 0) > 0
  const hasSkills = (skills?.length ?? 0) > 0 || hasCertifications
  const hasVolunteering = (volunteering?.length ?? 0) > 0

  const hiddenSections: string[] = [
    ...(!hasEducation ? ["education"] : []),
    ...(!hasExperiences ? ["experiences"] : []),
    ...(!hasScholarlyActivities ? ["scholarly-activities"] : []),
    ...(!hasPublications ? ["publications"] : []),
    ...(!hasAwards ? ["awards"] : []),
    ...(!hasMediaCoverage ? ["media-coverage"] : []),
    ...(!hasSkills ? ["skills"] : []),
    ...(!hasVolunteering ? ["volunteering"] : []),
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar hiddenSections={hiddenSections} profileName={profile?.full_name} />
      <main className="overflow-x-hidden">
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-br from-primary-light/30 via-white to-primary-light/20 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
        >
          {/* Elegant Bangladesh-inspired pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #006a4e 1px, transparent 1px), radial-gradient(circle at 80% 20%, #006a4e 1px, transparent 1px)", backgroundSize: "60px 60px" }} aria-hidden />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
          
          {/* Subtle decorative elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#f42a41]/5 rounded-full blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center">
              <div className="order-2 lg:order-1 space-y-3 sm:space-y-4 md:space-y-5 text-center lg:text-left animate-slide-from-left">
                {/* Premium Badge: Key Representative */}
                <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-primary/50 bg-white/90 px-5 py-2.5 text-sm font-bold text-primary shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-300">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f42a41] animate-pulse shadow-sm" aria-hidden />
                  <span className="tracking-wide">{profile?.hero_badge_text || "Portfolio"}</span>
                </div>
                
                <div className="space-y-3">
                  {profile?.hero_subtitle && (
                    <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary/80 font-bold">
                      {profile.hero_subtitle}
                    </p>
                  )}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.95] tracking-tight">
                    {profile?.full_name || "Bidhita Islam"}
                  </h1>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary via-[#f42a41] to-primary rounded-full mx-auto lg:mx-0" aria-hidden />
                  {profile?.title && (
                    <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 font-semibold leading-tight pt-2">
                      {profile.title}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start pt-1">
                  {profile?.credential_1_text && (
                    <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="font-semibold text-foreground text-xs sm:text-sm">{profile.credential_1_text}</span>
                    </div>
                  )}
                  {profile?.credential_2_text && (
                    <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                      <School className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="font-semibold text-foreground text-xs sm:text-sm">{profile.credential_2_text}</span>
                    </div>
                  )}
                </div>

                {/* Bio - Concise */}
                {profile?.bio && (
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed pt-1">
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-3">
                  <ScrollButton targetId="contact">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary-dark text-white w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-3.5 text-base font-bold shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5"
                    >
                      <Mail className="h-5 w-5 mr-2.5" />
                      Get in Touch
                    </Button>
                  </ScrollButton>
                  <DownloadCVButton hasCv={!!profile?.cv_path} />
                </div>
              </div>

              <div className="order-1 lg:order-2 flex flex-col items-center gap-4 animate-slide-from-right">
                <div className="relative w-44 h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] group">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/25 via-[#f42a41]/10 to-primary/20 blur-2xl group-hover:from-primary/35 group-hover:via-[#f42a41]/15 group-hover:to-primary/30 transition-all duration-700" aria-hidden />
                  <div className="absolute inset-0 rounded-full border-4 border-white shadow-[0_0_0_4px_rgba(3,100,69,0.15)] ring-8 ring-primary/5" aria-hidden />
                  <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-pulse" aria-hidden />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] border-primary shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-primary/40 hover:border-primary-dark">
                    <Image
                      src={profile?.profile_image || "/placeholder.svg?height=400&width=400"}
                      alt={profile?.full_name || "Profile"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                  </div>
                  {/* Bangladesh flag */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-primary/20">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-[#006a4e] relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#f42a41]" />
                      </div>
                    </div>
                  </div>

                </div>
                {/* Mobile-only inline stats pills */}
                {((publications?.length ?? 0) > 0 || (awards?.length ?? 0) > 0) && (
                  <div className="flex sm:hidden items-center gap-3 mt-4">
                    {(publications?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-2 bg-white rounded-xl shadow-md border border-border/60 px-3 py-2">
                        <div className="p-1.5 rounded-lg bg-primary/10"><FileText className="h-3.5 w-3.5 text-primary" /></div>
                        <div>
                          <p className="text-base font-bold text-primary leading-none">{publications!.length}+</p>
                          <p className="text-[10px] text-muted-foreground font-medium">Publications</p>
                        </div>
                      </div>
                    )}
                    {(awards?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-2 bg-white rounded-xl shadow-md border border-border/60 px-3 py-2">
                        <div className="p-1.5 rounded-lg bg-yellow-50"><Award className="h-3.5 w-3.5 text-yellow-600" /></div>
                        <div>
                          <p className="text-base font-bold text-yellow-600 leading-none">{awards!.length}+</p>
                          <p className="text-[10px] text-muted-foreground font-medium">Awards</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ScrollButton targetId="education">
              <button className="flex flex-col items-center gap-2 text-primary hover:text-primary-dark transition-colors group">
                <span className="text-sm font-semibold tracking-wide">Explore More</span>
                <ChevronDown className="h-6 w-6 group-hover:translate-y-1 transition-transform" />
              </button>
            </ScrollButton>
          </div>
        </section>

        {/* Education Section */}
        {hasEducation && (
        <section id="education" className="py-20 md:py-24 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Education</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Academic journey and qualifications</p>
            </div>

            <div className="space-y-5 max-w-4xl mx-auto">
              {education?.map((edu: any) => (
                <Card
                  key={edu.id}
                  className="border-l-4 border-[#0d9488] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{edu.degree}</h3>
                        {edu.field_of_study && (
                          <p className="text-base text-muted-foreground mt-1">{edu.field_of_study}</p>
                        )}
                      </div>
                      <span className="text-sm font-semibold bg-primary text-white px-4 py-1.5 rounded-full whitespace-nowrap self-start">
                        {edu.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-foreground/80">
                        <School className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-semibold text-lg">
                          {edu.institution}, {edu.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-base text-muted-foreground">
                        <span className="font-medium">
                          {edu.start_date} - {edu.end_date}
                        </span>
                        {edu.cgpa && <span className="font-bold text-primary text-lg">{edu.cgpa}</span>}
                      </div>

                      {/* Highlights — bullet points with **bold** support */}
                      {edu.highlights && (
                        <div className="mt-5 pt-5 border-t border-border">
                          <ul className="space-y-2.5">
                            {edu.highlights.split("\n").filter((line: string) => line.trim()).map((line: string, idx: number) => (
                              <li key={idx} className="flex gap-3 text-base">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0d9488] flex-shrink-0 inline-block" />
                                <span className="text-muted-foreground leading-relaxed">
                                  {line.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                                    i % 2 === 1
                                      ? <strong key={i} className="font-semibold text-foreground">{part}</strong>
                                      : part
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Coursework */}
                      {edu.coursework && (
                        <div className={edu.highlights ? "mt-4" : "mt-5 pt-5 border-t border-border"}>
                          <p className="text-sm font-bold text-foreground mb-2">Completed Coursework in:</p>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {edu.coursework.split(/\*\*(.+?)\*\*/g).map((part: string, i: number) =>
                              i % 2 === 1
                                ? <strong key={i} className="font-semibold text-foreground">{part}</strong>
                                : part
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Experiences Section with Tabs */}
        {hasExperiences && (
        <section id="experiences" className="py-20 md:py-24 bg-[#f8fafc] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Professional Experience</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A focused overview of my work across public health research, mental health systems leadership, and
                community-scale programming€”bridging evidence, ethics, and implementation.
              </p>
            </div>

            <Tabs defaultValue="research" className="w-full">
              <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-10 h-auto p-1 bg-white border border-border rounded-xl shadow-sm">
                <TabsTrigger
                  value="research"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-base font-semibold"
                >
                  Research
                </TabsTrigger>
                <TabsTrigger
                  value="industry"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-base font-semibold"
                >
                  Industry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="research" className="space-y-6">
                {researchExperiences.slice(0, maxItemsToShow).map((exp: any) => (
                  <Card
                    key={exp.id}
                    className="border-l-4 border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-foreground mb-3">{exp.position}</h3>
                          <div className="flex items-center gap-3 text-primary font-semibold text-lg mb-2">
                            <Briefcase className="h-5 w-5" />
                            <span>{exp.organization}</span>
                          </div>
                          {exp.project_name && (
                            <p className="text-base text-muted-foreground">
                              <span className="font-semibold text-foreground">Project:</span> {exp.project_name}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold bg-primary text-white px-4 py-1.5 rounded-full whitespace-nowrap self-start">
                          {exp.employment_type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-6 text-base text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <span className="font-medium">
                            {exp.start_date} - {exp.end_date}
                          </span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="space-y-3">
                          {exp.responsibilities.map((responsibility: string, index: number) => (
                            <li key={index} className="flex gap-3 text-base">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 inline-block" />
                              <span className="text-muted-foreground leading-relaxed">
                                {responsibility.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                                  i % 2 === 1
                                    ? <strong key={i} className="font-semibold text-foreground">{part}</strong>
                                    : part
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {researchExperiences.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-lg">No research experiences available.</p>
                )}
                
                {/* Evidence & Research Link */}
                <div className="flex justify-center pt-6">
                  <ScrollButton targetId="publications">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold"
                    >
                      <Briefcase className="mr-2 h-5 w-5" />
                      View Research & Evidence
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </Button>
                  </ScrollButton>
                </div>

                {researchExperiences.length > maxItemsToShow && (
                  <div className="flex justify-center pt-4">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                      <Link href="/experiences">
                        View All Experiences ({researchExperiences.length}) <ExternalLink className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="industry" className="space-y-6">
                {industryExperiences.slice(0, maxItemsToShow).map((exp: any) => (
                  <Card
                    key={exp.id}
                    className="border-l-4 border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-foreground mb-3">{exp.position}</h3>
                          <div className="flex items-center gap-3 text-primary font-semibold text-lg mb-2">
                            <Briefcase className="h-5 w-5" />
                            <span>{exp.organization}</span>
                          </div>
                          {exp.project_name && (
                            <p className="text-base text-muted-foreground">
                              <span className="font-semibold text-foreground">Project:</span> {exp.project_name}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold bg-primary text-white px-4 py-1.5 rounded-full whitespace-nowrap self-start">
                          {exp.employment_type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-6 text-base text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <span className="font-medium">
                            {exp.start_date} - {exp.end_date}
                          </span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="space-y-3">
                          {exp.responsibilities.map((responsibility: string, index: number) => (
                            <li key={index} className="flex gap-3 text-base">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 inline-block" />
                              <span className="text-muted-foreground leading-relaxed">
                                {responsibility.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                                  i % 2 === 1
                                    ? <strong key={i} className="font-semibold text-foreground">{part}</strong>
                                    : part
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {industryExperiences.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-lg">No industry experiences available.</p>
                )}
                {industryExperiences.length > maxItemsToShow && (
                  <div className="flex justify-center pt-8">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                      <Link href="/experiences">
                        View All Experiences ({industryExperiences.length}) <ExternalLink className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        )}

        {/* Scholarly Activities Section */}
        {hasScholarlyActivities && (
        <section id="scholarly-activities" className="py-20 md:py-24 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Scholarly Activities</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Conference presentations, workshops, and academic engagements showcasing research dissemination and
                professional development.
              </p>
            </div>

            <div className="space-y-5 max-w-4xl mx-auto">
              {scholarlyActivities?.slice(0, maxItemsToShow).map((activity: any) => (
                <Card
                  key={activity.id}
                  className="border-l-4 border-amber-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
                      <h3 className="text-xl font-bold text-foreground flex-1 leading-snug">{activity.title}</h3>
                      <span className="text-xs font-semibold bg-primary text-white px-4 py-1.5 rounded-full whitespace-nowrap self-start">
                        {activity.type}
                      </span>
                    </div>
                    {activity.organization && (
                      <p className="text-base text-muted-foreground mb-3">
                        <span className="font-semibold text-foreground">Organization:</span> {activity.organization}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-base text-muted-foreground mb-4">
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">{activity.date}</span>
                    </div>
                    {activity.description && (
                      <p className="text-base text-muted-foreground leading-relaxed">{activity.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {scholarlyActivities && scholarlyActivities.length > maxItemsToShow && (
                <div className="flex justify-center pt-8">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                    <Link href="/scholarly-activities">
                      View All Activities ({scholarlyActivities.length}) <ExternalLink className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Publications Section with Tabs */}
        {hasPublications && (
        <section id="publications" className="py-20 md:py-24 bg-[#f8fafc] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Publications</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A collection of my academic contributions, including peer-reviewed articles, conference presentations,
                and ongoing research projects.
              </p>
            </div>

            <Tabs defaultValue="academic" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-10 h-auto p-1 bg-white border border-border rounded-xl shadow-sm">
                <TabsTrigger
                  value="academic"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-xs md:text-sm font-semibold"
                >
                  Academic
                </TabsTrigger>
                <TabsTrigger
                  value="conference"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-xs md:text-sm font-semibold"
                >
                  Conference
                </TabsTrigger>
                <TabsTrigger
                  value="non-academic"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-xs md:text-sm font-semibold"
                >
                  Non-Academic
                </TabsTrigger>
                <TabsTrigger
                  value="work-in-progress"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-xs md:text-sm font-semibold"
                >
                  In Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="academic" className="space-y-6">
                <div className="grid gap-6">
                  {academicPublications.slice(0, maxItemsToShow).map((pub: any) => (
                    <Card
                      key={pub.id}
                      className="border-l-4 border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                          <h4 className="text-xl font-bold text-foreground flex-1 leading-snug">{pub.title}</h4>
                          {pub.status && (
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                                pub.status === "Published" ? "bg-primary text-white" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {pub.status}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          {pub.authors && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{pub.authors}</span>
                            </div>
                          )}
                          {pub.journal && (
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 flex-shrink-0 text-primary" />
                              <span className="font-medium">{pub.journal}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            {pub.publication_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                                <span>{pub.publication_date}</span>
                              </div>
                            )}
                            {pub.citation_count !== null && pub.citation_count !== undefined && (
                              <div className="flex items-center gap-2">
                                <Quote className="h-4 w-4 flex-shrink-0 text-primary" />
                                <span className="font-semibold">
                                  <span className="text-primary">{pub.citation_count}</span> citations
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {pub.abstract && (
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{pub.abstract}</p>
                        )}

                        {pub.keywords && pub.keywords.length > 0 && (
                          <div className="mb-4 pt-4 border-t">
                            <div className="flex flex-wrap gap-2">
                              {pub.keywords.map((keyword: any, idx: number) => (
                                <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {(pub.academic_pdf || pub.doi) && (
                          <div className="flex flex-wrap gap-3">
                            {pub.academic_pdf && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-primary text-primary hover:bg-primary hover:text-white"
                              >
                                <a href={pub.academic_pdf} target="_blank" rel="noopener noreferrer">
                                  <FileText className="mr-2 h-4 w-4" />
                                  View PDF
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {!pub.academic_pdf && pub.doi && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-primary text-primary hover:bg-primary hover:text-white"
                              >
                                <a
                                  href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Quote className="mr-2 h-4 w-4" />
                                  View via DOI
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {academicPublications.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-lg">No academic publications available.</p>
                )}
                {academicPublications.length > maxItemsToShow && (
                  <div className="flex justify-center pt-8">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                      <Link href="/publications">
                        View All Publications ({academicPublications.length}) <ExternalLink className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="conference" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conferencePublications.slice(0, maxItemsToShow).map((pub: any) => (
                    <ConferencePublicationSummary key={pub.id} publication={pub} />
                  ))}
                </div>
                {conferencePublications.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-lg">
                    No conference publications available.
                  </p>
                )}
                {conferencePublications.length > maxItemsToShow && (
                  <div className="flex justify-center pt-8">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                      <Link href="/publications">
                        View All Conference Publications ({conferencePublications.length}){" "}
                        <ExternalLink className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="non-academic" className="space-y-6">
                <div className="grid gap-6">
                  {nonAcademicPublications.slice(0, maxItemsToShow).map((pub: any) => (
                    <Card
                      key={pub.id}
                      className="border-l-4 border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold text-foreground mb-4 leading-snug">{pub.title}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          {pub.journal && <span className="font-medium">{pub.journal}</span>}
                          {pub.publication_date && (
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {pub.publication_date}
                            </span>
                          )}
                        </div>
                        {pub.url && (
                          <LinkPreview url={pub.url} title={pub.title} profileImage={profile?.profile_image} />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {nonAcademicPublications.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-lg">
                    No non-academic publications available.
                  </p>
                )}
                {nonAcademicPublications.length > maxItemsToShow && (
                  <div className="flex justify-center pt-8">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                      <Link href="/publications">
                        View All Publications ({nonAcademicPublications.length}){" "}
                        <ExternalLink className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="work-in-progress" className="space-y-6">
                {workInProgress.slice(0, maxItemsToShow).map((pub: any) => (
                  <Card
                    key={pub.id}
                    className="border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                        <h4 className="text-xl font-bold text-foreground flex-1 leading-snug">{pub.title}</h4>
                        {pub.status && (
                          <span
                            className={`text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap self-start ${
                              pub.status === "Under Review"
                                ? "bg-blue-100 text-blue-800"
                                : pub.status === "Revision Phase"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {pub.status}
                          </span>
                        )}
                      </div>

                      {pub.authors && (
                        <div className="flex items-center gap-2 text-base text-muted-foreground mb-4">
                          <Users className="h-5 w-5 flex-shrink-0 text-primary" />
                          <span>{pub.authors}</span>
                        </div>
                      )}

                      {pub.abstract && (
                        <div className="mb-4">
                          <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                            {pub.abstract}
                          </p>
                        </div>
                      )}

                      {pub.keywords && pub.keywords.length > 0 && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-bold text-foreground mb-2">Keywords:</p>
                          <div className="flex flex-wrap gap-2">
                            {pub.keywords.map((keyword: any, idx: number) => (
                              <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {workInProgress.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-lg">
                    No work in progress publications available.
                  </p>
                )}
                {workInProgress.length > maxItemsToShow && (
                  <div className="flex justify-center pt-8">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                      <Link href="/publications">
                        View All Publications ({workInProgress.length}) <ExternalLink className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        )}

        {/* Awards Section */}
        {hasAwards && (
        <section id="awards" className="py-20 md:py-24 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Honors & Awards</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Recognition and achievements demonstrating academic excellence and outstanding contributions.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {awards?.slice(0, 8).map((award: any) => (
                <Card
                  key={award.id}
                  className="border-t-4 border-amber-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white"
                >
                  <CardContent className="p-0">
                    <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {award.image ? (
                        <Image
                          src={award.image}
                          alt={award.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Award className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2 leading-snug">{award.title}</h3>
                      <p className="text-xs font-semibold text-primary mb-1">{award.issuer}</p>
                      {award.date && <p className="text-xs text-muted-foreground">{award.date}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {awards && awards.length > 8 && (
              <div className="flex justify-center pt-10">
                <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                  <Link href="/awards">
                    View All Awards ({awards.length}) <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
        )}

        {/* Media Coverage Section - News-style layout */}
        {hasMediaCoverage && (
        <section id="media-coverage" className="py-20 md:py-24 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Media Coverage</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Featured in national and international media for contributions to public health, mental health advocacy, and youth leadership.
              </p>
            </div>

            {mediaCoverage && mediaCoverage.length > 0 && (
              <div className="grid lg:grid-cols-5 gap-0 lg:gap-10 w-full">

                {/* Featured story — left */}
                <div className="lg:col-span-3 mb-10 lg:mb-0">
                  {mediaCoverage[0].article_url ? (
                    <a href={mediaCoverage[0].article_url} target="_blank" rel="noopener noreferrer" className="group block">
                      <div className="relative w-full h-64 md:h-72 overflow-hidden rounded-lg bg-muted">
                        {mediaCoverage[0].cover_image ? (
                          <Image src={mediaCoverage[0].cover_image} alt={mediaCoverage[0].outlet_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <FileText className="h-16 w-16 text-primary/20" />
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{mediaCoverage[0].outlet_name}</p>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-3">
                          {mediaCoverage[0].article_title || mediaCoverage[0].outlet_name}
                        </h3>
                        {mediaCoverage[0].description && (
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{mediaCoverage[0].description}</p>
                        )}
                      </div>
                    </a>
                  ) : (
                    <div>
                      <div className="relative w-full h-64 md:h-72 overflow-hidden rounded-lg bg-muted">
                        {mediaCoverage[0].cover_image ? (
                          <Image src={mediaCoverage[0].cover_image} alt={mediaCoverage[0].outlet_name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <FileText className="h-16 w-16 text-primary/20" />
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{mediaCoverage[0].outlet_name}</p>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug line-clamp-3">
                          {mediaCoverage[0].article_title || mediaCoverage[0].outlet_name}
                        </h3>
                        {mediaCoverage[0].description && (
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{mediaCoverage[0].description}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Side list — right */}
                <div className="lg:col-span-2 flex flex-col divide-y divide-border">
                  {mediaCoverage.slice(1, 5).map((item: any) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 group">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                        {item.cover_image ? (
                          <Image src={item.cover_image} alt={item.outlet_name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <FileText className="h-6 w-6 text-primary/20" />
                          </div>
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{item.outlet_name}</p>
                        {item.article_url ? (
                          <a href={item.article_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
                            {item.article_title || item.outlet_name}
                          </a>
                        ) : (
                          <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
                            {item.article_title || item.outlet_name}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 text-right">
                    <Link href="/media-coverage" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                      See full coverage <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>
        )}

        {/* Skills Section with Tabs */}
        {hasSkills && (
        <section id="skills" className="py-20 md:py-24 bg-[#f8fafc] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Skills & Expertise</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Technical proficiencies and interpersonal competencies developed through academic training and practical
                experience.
              </p>
            </div>

            <div className="w-full space-y-8">
              <Tabs defaultValue="technical" className="w-full">
                <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-10 h-auto p-1 bg-white border border-border rounded-xl shadow-sm">
                  <TabsTrigger
                    value="technical"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-base font-semibold"
                  >
                    Technical
                  </TabsTrigger>
                  <TabsTrigger
                    value="interpersonal"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-base font-semibold"
                  >
                    Interpersonal
                  </TabsTrigger>
                  <TabsTrigger
                    value="languages"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-base font-semibold"
                  >
                    Languages
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="technical">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groupedSkills?.Technical?.slice(0, 8).map((skill: any) => (
                      <Card
                        key={skill.id}
                        className="border-l-4 border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Laptop className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-bold text-foreground text-base">{skill.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {(!groupedSkills?.Technical || groupedSkills.Technical.length === 0) && (
                    <p className="text-center text-muted-foreground py-12 text-lg">No technical skills available.</p>
                  )}
                </TabsContent>

                <TabsContent value="interpersonal">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groupedSkills?.Interpersonal?.slice(0, 8).map((skill: any) => (
                      <Card
                        key={skill.id}
                        className="border-l-4 border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-bold text-foreground text-base">{skill.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {(!groupedSkills?.Interpersonal || groupedSkills.Interpersonal.length === 0) && (
                    <p className="text-center text-muted-foreground py-12 text-lg">
                      No interpersonal skills available.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="languages">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {groupedSkills?.Languages?.map((skill: any) => {
                      const flagUrl = languageFlags[skill.name] || null
                      const proficiency = skill.proficiency || skill.description || "Basic"
                      const isHighProficiency =
                        proficiency.toLowerCase().includes("high") ||
                        proficiency.toLowerCase().includes("proficient") ||
                        proficiency.toLowerCase().includes("fluent") ||
                        proficiency.toLowerCase().includes("expert")
                      const isNative = proficiency.toLowerCase().includes("native")

                      return (
                        <Card
                          key={skill.id}
                          className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border rounded-xl ${
                            isHighProficiency || isNative ? "bg-[#d4f1e8] border-[#036445]/20" : "bg-white border-gray-200"
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center gap-4">
                              {flagUrl ? (
                                <div className="relative w-32 h-24 flex items-center justify-center">
                                  <Image
                                    src={flagUrl}
                                    alt={`${skill.name} flag`}
                                    width={128}
                                    height={96}
                                    className="object-contain rounded shadow-sm"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-32 h-24 flex items-center justify-center text-6xl">
                                  ðŸŒ
                                </div>
                              )}
                              <div className="space-y-1">
                                <h4 className="font-bold text-primary text-xl tracking-tight">{skill.name}</h4>
                                <p
                                  className={`text-sm ${
                                    isHighProficiency || isNative
                                      ? "text-primary/80 font-medium"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {isNative 
                                    ? "Native" 
                                    : isHighProficiency 
                                      ? `Proficiency Level ${proficiency.charAt(0).toUpperCase() + proficiency.slice(1).toLowerCase()}`
                                      : proficiency.charAt(0).toUpperCase() + proficiency.slice(1).toLowerCase()
                                  }
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  {(!groupedSkills?.Languages || groupedSkills.Languages.length === 0) && (
                    <p className="text-center text-muted-foreground py-12 text-lg">No language skills available.</p>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-center pt-8">
                <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                  <Link href="/skills">
                    View All Skills & Courses <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div className="mt-16 pt-12 border-t border-border">
                  <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">Certifications & Courses</h3>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {certifications.slice(0, 8).map((cert: any) => (
                      <Card
                        key={cert.id}
                        className="border-t-4 border-[#0d9488] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white"
                      >
                        <CardContent className="p-0">
                          <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                            {cert.image ? (
                              <Image
                                src={cert.image}
                                alt={cert.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Award className="h-16 w-16 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h4 className="text-sm font-bold text-foreground mb-1 line-clamp-2 leading-snug">{cert.name}</h4>
                            <p className="text-xs font-semibold text-primary mb-1">{cert.issuer}</p>
                            {cert.issue_date && <p className="text-xs text-muted-foreground">{cert.issue_date}</p>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {certifications.length > 8 && (
                    <div className="flex justify-center pt-8">
                      <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                        <Link href="/skills">
                          View All Certifications ({certifications.length}) <ExternalLink className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Volunteering Section */}
        {hasVolunteering && (
        <section id="volunteering" className="py-20 md:py-24 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Community Service</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Community service and volunteer activities demonstrating commitment to social responsibility and
                community engagement.
              </p>
            </div>

            <div className="space-y-5 max-w-4xl mx-auto">
              {volunteering?.slice(0, maxItemsToShow).map((activity: any) => (
                <Card
                  key={activity.id}
                  className="border-l-4 border-rose-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-rose-50 rounded-xl flex-shrink-0">
                        <Heart className="h-6 w-6 text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{activity.role}</h3>
                        <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                          <Building2 className="h-4 w-4" />
                          <span>{activity.organization}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {activity.start_date} - {activity.end_date}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {volunteering && volunteering.length > maxItemsToShow && (
                <div className="flex justify-center pt-8">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-md hover:shadow-lg transition-all">
                    <Link href="/volunteering">
                      View All Volunteering ({volunteering.length}) <ExternalLink className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-24 bg-[#f8fafc] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif italic tracking-tight">Get in Touch</h2>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60 rounded-full"></div><div className="h-1.5 w-10 bg-primary rounded-full"></div><div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60 rounded-full"></div></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                I welcome opportunities for collaboration, research partnerships, and professional engagement. Feel free
                to reach out for public health and mental health systems work, speaking engagements, or program design
                and evaluation support.
              </p>
            </div>

            <div className="w-full grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-primary mb-8">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Email</p>
                          {profile?.email ? (
                            <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                              {profile.email}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">Not available</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Phone</p>
                          <p className="text-muted-foreground">{profile?.phone || "+880 1234-567890"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Location</p>
                          <p className="text-muted-foreground">{profile?.address || "Dhaka, Bangladesh"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border">
                      <h4 className="font-bold text-foreground mb-4">Connect with me</h4>
                      <div className="flex gap-4">
                        {profile?.linkedin_url && (
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="border-2 border-primary hover:bg-primary hover:text-white bg-transparent"
                          >
                            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                        {profile?.facebook_url && (
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="border-2 border-primary hover:bg-primary hover:text-white bg-transparent"
                          >
                            <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer">
                              <Facebook className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                        {profile?.google_scholar_url && (
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="border-2 border-primary hover:bg-primary hover:text-white bg-transparent"
                          >
                            <a href={profile.google_scholar_url} target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">
                              <GoogleScholarIcon className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                        {profile?.orcid_url && (
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="border-2 border-primary hover:bg-primary hover:text-white bg-transparent"
                          >
                            <a href={profile.orcid_url} target="_blank" rel="noopener noreferrer" aria-label="ORCID">
                              <OrcidIcon className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                        {profile?.x_url && (
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="border-2 border-primary hover:bg-primary hover:text-white bg-transparent"
                          >
                            <a href={profile.x_url} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                              <XIcon className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-primary mb-6">Send a Message</h3>
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

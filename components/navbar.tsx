"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { name: "Home", href: "/", scrollTo: "home" },
  { name: "Experiences", href: "/experiences", scrollTo: "experiences" },
  { name: "Scholarly Activities", href: "/scholarly-activities", scrollTo: "scholarly-activities" },
  { name: "Publications", href: "/publications", scrollTo: "publications" },
  { name: "Honors & Awards", href: "/awards", scrollTo: "awards" },
  { name: "Media Coverage", href: "/#media-coverage", scrollTo: "media-coverage" },
  { name: "Skills & Courses", href: "/skills", scrollTo: "skills" },
  { name: "Volunteering", href: "/volunteering", scrollTo: "volunteering" },
  { name: "Blogs", href: "/blogs", scrollTo: "blogs" },
  { name: "Contact", href: "/contact", scrollTo: "contact" },
]

// Maps each nav item's `scrollTo` id to the Supabase table that backs it.
// Used to hide menu entries whose section has no data.
const sectionTables: Record<string, string> = {
  experiences: "experiences",
  "scholarly-activities": "scholarly_activities",
  publications: "publications",
  awards: "awards",
  "media-coverage": "media_coverage",
  skills: "skills",
  volunteering: "volunteering",
}

export function Navbar({ hiddenSections = [], profileName }: { hiddenSections?: string[]; profileName?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [portfolioName, setPortfolioName] = useState(profileName || "Bidhita Islam")
  // Start from any server-provided hidden sections (home page) so there's no flash,
  // then refine client-side so subpages hide empty sections too.
  const [hidden, setHidden] = useState<string[]>(hiddenSections)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (profileName) return // already provided by server
    let isMounted = true
    const supabase = createClient()

    supabase
      .from("profiles")
      .select("full_name")
      .single()
      .then(({ data }: { data: { full_name: string } | null }) => {
        if (!isMounted) return
        if (data?.full_name) setPortfolioName(data.full_name)
      })
      .catch(() => {
        // Keep fallback name if profile fetch fails
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Determine which sections are empty (no rows) and should be hidden from the menu.
  // Runs on every page so subpages stay consistent with the home page.
  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    Promise.all(
      Object.entries(sectionTables).map(async ([scrollTo, table]) => {
        const { count } = await supabase.from(table).select("id", { count: "exact", head: true })
        return { scrollTo, empty: (count ?? 0) === 0 }
      }),
    )
      .then((results) => {
        if (!isMounted) return
        setHidden(results.filter((r) => r.empty).map((r) => r.scrollTo))
      })
      .catch(() => {
        // Keep server-provided / initial hidden list if the count query fails
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, scrollTo: string, href: string) => {
    console.log("[Navbar] Nav click:", { scrollTo, href, pathname })

    // Close mobile menu immediately
    setIsMobileMenuOpen(false)

    const [hrefPath, hrefHash] = href.split("#")
    const isSamePage = pathname === hrefPath

    // If clicking on current page's link, scroll to top or section
    if (isSamePage) {
      e.preventDefault()
      if (hrefPath === "/" && scrollTo === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else if (scrollTo) {
        const element = document.getElementById(scrollTo)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      } else if (hrefHash) {
        const element = document.getElementById(hrefHash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      return
    }

    // For navigation to different pages, use router.push
    e.preventDefault()
    console.log("[Navbar] Navigating to:", href)
    router.push(href)
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log("[Navbar] Logo click:", { pathname })
    setIsMobileMenuOpen(false)

    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      e.preventDefault()
      console.log("[Navbar] Logo navigating to home")
      router.push("/")
    }
  }

  const toggleMobileMenu = () => {
    console.log("[Navbar] Toggling menu from:", isMobileMenuOpen, "to:", !isMobileMenuOpen)
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled ? "bg-primary border-primary shadow-md" : "bg-white/95 backdrop-blur-sm border-border"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          <Link
            href="/"
            onClick={handleLogoClick}
            className={`text-base sm:text-lg lg:text-xl font-bold transition-colors whitespace-nowrap flex-shrink-0 ${isScrolled ? "text-white" : "text-primary"}`}
          >
            {portfolioName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {navItems.filter(item => !hidden.includes(item.scrollTo)).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.scrollTo, item.href)}
                  className={`px-2.5 py-2 text-xs xl:text-sm font-medium transition-colors rounded whitespace-nowrap ${
                    isScrolled
                      ? isActive
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                      : isActive
                        ? "bg-primary-light text-primary"
                        : "text-foreground hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button - CRITICAL: Must have higher z-index */}
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden relative z-[100] ${isScrolled ? "text-white hover:bg-white/10" : "text-primary hover:bg-primary-light"}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </div>
      </div>

      {/* Overlay - appears when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-14 sm:top-16 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-14 sm:top-16 right-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4 space-y-1 overflow-y-auto h-full">
          {navItems.filter(item => !hidden.includes(item.scrollTo)).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.scrollTo, item.href)}
                className={`px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                  isActive ? "bg-primary text-white" : "text-foreground hover:bg-primary-light hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
import Link from "next/link"
import { Facebook, Linkedin, Mail, MapPin, Phone, Github } from "lucide-react"
import { GoogleScholarIcon, OrcidIcon, XIcon } from "@/components/social-icons"
import { createClient } from "@/lib/supabase/server"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Experiences", href: "/experiences" },
  { name: "Scholarly Activities", href: "/scholarly-activities" },
  { name: "Publications", href: "/publications" },
  { name: "Honors & Awards", href: "/awards" },
  { name: "Skills & Courses", href: "/skills" },
  { name: "Volunteering", href: "/volunteering" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
]

export async function Footer() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("*").single()

  const currentYear = new Date().getFullYear()
  const fullName = profile?.full_name || "Portfolio Owner"
  const address = profile?.address || "Address not available"
  const email = profile?.email || "email@example.com"
  const phone = profile?.phone || "+880 0000 000000"
  const linkedinUrl = profile?.linkedin_url || "https://linkedin.com"
  const facebookUrl = profile?.facebook_url || "https://facebook.com"
  const githubUrl = profile?.github_url
  const googleScholarUrl = profile?.google_scholar_url
  const orcidUrl = profile?.orcid_url
  const xUrl = profile?.x_url

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:underline">
                  {phone}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary-light transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
              )}
              {googleScholarUrl && (
                <a
                  href={googleScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors"
                  aria-label="Google Scholar"
                >
                  <GoogleScholarIcon className="h-6 w-6" />
                </a>
              )}
              {orcidUrl && (
                <a
                  href={orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors"
                  aria-label="ORCID"
                >
                  <OrcidIcon className="h-6 w-6" />
                </a>
              )}
              {xUrl && (
                <a
                  href={xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-dark text-center text-sm">
          <p>© {currentYear} {fullName.toUpperCase()}</p>
        </div>
      </div>
    </footer>
  )
}

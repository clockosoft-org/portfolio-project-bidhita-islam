import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { createClient } from "@/lib/supabase/server"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

// Build the page title/description dynamically from the portfolio owner's profile
// so the browser tab reflects the actual user (name + designation) instead of a
// hardcoded value. Falls back to a neutral title if the profile can't be loaded.
export async function generateMetadata(): Promise<Metadata> {
  let fullName = "Bidhita Islam"
  let title: string | undefined
  let bio: string | undefined

  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, title, bio")
      .single()

    if (profile?.full_name) fullName = profile.full_name
    title = profile?.title || undefined
    bio = profile?.bio || undefined
  } catch {
    // Keep neutral fallbacks if Supabase is unreachable
  }

  const pageTitle = title ? `${fullName} | ${title}` : fullName

  return {
    title: pageTitle,
    description: bio || `Portfolio of ${fullName}.`,
    authors: [{ name: fullName }],
    icons: {
      icon: "/icon",
      apple: "/icon",
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

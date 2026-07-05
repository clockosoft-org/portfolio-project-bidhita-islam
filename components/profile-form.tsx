"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(profile?.profile_image || "")
  const [cvPath, setCvPath] = useState(profile?.cv_path || "")
  const [cvPreviewUrl, setCvPreviewUrl] = useState("")
  const [cvFileName, setCvFileName] = useState("")
  const [uploadingCv, setUploadingCv] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("profile-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath)

      setImagePreview(publicUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCv(true)
    setError(null)

    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `cv-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("cv-files")
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Private bucket: build a temporary signed URL just for the admin preview.
      const { data: signed } = await supabase.storage.from("cv-files").createSignedUrl(filePath, 3600)

      setCvPath(filePath)
      setCvPreviewUrl(signed?.signedUrl || "")
      setCvFileName(file.name)
      toast({
        title: "CV uploaded",
        description: "Remember to click Save Profile to publish the change.",
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingCv(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const form = e.currentTarget

    const supabase = createClient()

    const formData = new FormData(form)
    const data = {
      full_name: formData.get("full_name") as string,
      title: formData.get("title") as string,
      bio: formData.get("bio") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      profile_image: imagePreview,
      cv_path: cvPath,
      linkedin_url: formData.get("linkedin_url") as string,
      facebook_url: formData.get("facebook_url") as string,
      github_url: formData.get("github_url") as string,
      google_scholar_url: formData.get("google_scholar_url") as string,
      orcid_url: formData.get("orcid_url") as string,
      x_url: formData.get("x_url") as string,
      hero_badge_text: formData.get("hero_badge_text") as string,
      hero_subtitle: formData.get("hero_subtitle") as string,
      credential_1_text: formData.get("credential_1_text") as string,
      credential_2_text: formData.get("credential_2_text") as string,
    }

    try {
      if (profile) {
        const { error: updateError } = await supabase.from("profiles").update(data).eq("id", profile.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("profiles").insert(data)
        if (insertError) throw insertError
      }

      setSuccess(true)
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          {/* Profile Image */}
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-6">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="max-w-xs"
                />
                {uploading && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CV / Resume */}
          <div className="space-y-4">
            <Label>CV / Resume (PDF or Word, max 20 MB)</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCvUpload}
                disabled={uploadingCv}
                className="max-w-xs"
              />
              {uploadingCv ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </p>
              ) : cvPreviewUrl || cvPath ? (
                <a
                  href={cvPreviewUrl || "/api/cv"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {cvFileName || "View current CV"}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Uploading a new file replaces the CV served by the “Download CV” button on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={profile?.title}
                required
                placeholder="Your professional title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile?.bio}
              required
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile?.email} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={profile?.phone} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={profile?.address} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" name="linkedin_url" defaultValue={profile?.linkedin_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input id="facebook_url" name="facebook_url" defaultValue={profile?.facebook_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" name="github_url" defaultValue={profile?.github_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_scholar_url">Google Scholar URL</Label>
              <Input
                id="google_scholar_url"
                name="google_scholar_url"
                defaultValue={profile?.google_scholar_url}
                placeholder="https://scholar.google.com/citations?user=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orcid_url">ORCID URL</Label>
              <Input
                id="orcid_url"
                name="orcid_url"
                defaultValue={profile?.orcid_url}
                placeholder="https://orcid.org/0000-0000-0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="x_url">X (Twitter) URL</Label>
              <Input
                id="x_url"
                name="x_url"
                defaultValue={profile?.x_url}
                placeholder="https://x.com/username"
              />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Hero Section Customization</h3>
            
            <div className="space-y-2">
              <Label htmlFor="hero_badge_text">Hero Badge Text</Label>
              <Input
                id="hero_badge_text"
                name="hero_badge_text"
                defaultValue={profile?.hero_badge_text || "Key Representative · Bangladesh"}
                placeholder="Key Representative · Bangladesh"
              />
              <p className="text-sm text-muted-foreground">
                The badge text displayed at the top of the hero section
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                name="hero_subtitle"
                defaultValue={profile?.hero_subtitle || "Representing Bangladesh in Global Mental Health & Public Health"}
                placeholder="Representing Bangladesh in Global Mental Health & Public Health"
              />
              <p className="text-sm text-muted-foreground">
                The subtitle text displayed below the badge
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credential_1_text">Credential 1</Label>
                <Input
                  id="credential_1_text"
                  name="credential_1_text"
                  defaultValue={profile?.credential_1_text || "Global Youth Leadership Award"}
                  placeholder="Global Youth Leadership Award"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_2_text">Credential 2</Label>
                <Input
                  id="credential_2_text"
                  name="credential_2_text"
                  defaultValue={profile?.credential_2_text || "MPH, North South University"}
                  placeholder="MPH, North South University"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Credentials displayed below the CTA buttons in the hero section
            </p>
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

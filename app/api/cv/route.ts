import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Always run fresh so the signed URL is never cached/stale.
export const dynamic = "force-dynamic"

// Public endpoint that streams the current CV from the PRIVATE "cv-files"
// bucket. It looks up the stored object path, mints a short-lived signed URL
// with the service-role key (which bypasses RLS), and redirects to it.
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Server is not configured for CV downloads." }, { status: 500 })
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: profile } = await admin.from("profiles").select("cv_path").single()

  if (!profile?.cv_path) {
    return NextResponse.json({ error: "No CV has been uploaded yet." }, { status: 404 })
  }

  // 60s is plenty for the browser to follow the redirect and start the download.
  const { data, error } = await admin.storage
    .from("cv-files")
    .createSignedUrl(profile.cv_path, 60, { download: true })

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not generate a download link." }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}

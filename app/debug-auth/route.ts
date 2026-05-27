import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ step: 'no session', sessionError: sessionError?.message })

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return NextResponse.json({
    step: 'done',
    userId: session.user.id,
    email: session.user.email,
    profile: profile ?? null,
    profileError: profileError?.message ?? null,
  })
}

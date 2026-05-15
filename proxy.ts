import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = ['/dashboard', '/settings', '/customers', '/analytics'].some(p =>
    request.nextUrl.pathname.startsWith(p)
  )

  const isAuthPage = ['/auth/login', '/auth/signup'].some(p =>
    request.nextUrl.pathname.startsWith(p)
  )

  // Not logged in trying to access protected page → login
  if (isProtected && !user) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    // Clear cache so back button doesn't restore dashboard
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  }

  // Logged in trying to access login/signup → dashboard
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add no-cache headers to all protected pages
  if (isProtected) {
    supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    supabaseResponse.headers.set('Pragma', 'no-cache')
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
import { NextRequest, NextResponse } from 'next/server'
import { getDashboardPathForRole, getRoleRouteSegment, isRouteRoleSegment } from '@/lib/auth/roles'
import { getUserProfileWithIsActiveFallback } from '@/lib/auth/profile-query'
import { getProfileCompletionStatus } from '@/lib/profile-completion'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const requestHeaders = new Headers(request.headers)
  const thirdSegment = pathname.startsWith('/dashboard/') ? pathname.split('/')[2] ?? '' : ''
  const requestedRoleSegment = isRouteRoleSegment(thirdSegment) ? thirdSegment : null

  if (thirdSegment) {
    requestHeaders.set('x-dashboard-page-segment', thirdSegment)
  }

  if (requestedRoleSegment) {
    requestHeaders.set('x-dashboard-role-segment', requestedRoleSegment)
  }

  const { supabase, response } = updateSession(
    new NextRequest(request.url, {
      headers: requestHeaders,
      method: request.method,
      body: request.body,
    }),
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginRoute = pathname === '/login'
  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  if (!user) {
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  const { data: profile } = await getUserProfileWithIsActiveFallback<{
    id: string
    role: string | null
    fname: string | null
    lname: string | null
    profile_image_url: string | null
    birthday: string | null
  }>({
    supabase,
    userId: user.id,
    selectWithIsActive: 'id,role,fname,lname,profile_image_url,birthday,is_active',
    selectWithoutIsActive: 'id,role,fname,lname,profile_image_url,birthday',
  })

  const roleSegment = getRoleRouteSegment(profile?.role)
  const dashboardPath = getDashboardPathForRole(profile?.role)

  if (!profile?.is_active || !roleSegment || !dashboardPath) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: contact } = profile
    ? await supabase
      .from('contact_information')
      .select('primary_mobile')
      .eq('user_profile_id', profile.id)
      .maybeSingle<{ primary_mobile: string | null }>()
    : { data: null }

  const profileCompletion = profile
    ? getProfileCompletionStatus(profile, {
      primary_mobile: contact?.primary_mobile ?? null,
    })
    : { isComplete: false, missingFields: [] }

  const isProfileRoute = pathname === '/dashboard/profile'
  const skipProfileCompletion = request.cookies.get('profile-completion-skip')?.value === '1'

  if (isLoginRoute) {
    if (!profileCompletion.isComplete && !skipProfileCompletion) {
      return NextResponse.redirect(new URL('/dashboard/profile?profileRequired=1', request.url))
    }
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    if (!profileCompletion.isComplete && !skipProfileCompletion) {
      return NextResponse.redirect(new URL('/dashboard/profile?profileRequired=1', request.url))
    }
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  if (isDashboardRoute && requestedRoleSegment && requestedRoleSegment !== roleSegment) {
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  if (isDashboardRoute && !isProfileRoute && !profileCompletion.isComplete && !skipProfileCompletion) {
    return NextResponse.redirect(new URL('/dashboard/profile?profileRequired=1', request.url))
  }

  if (isDashboardRoute && thirdSegment !== 'profile' && request.cookies.get('profile-completion-skip')) {
    response.cookies.delete('profile-completion-skip')
  }

  return response
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}

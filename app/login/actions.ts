'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getDashboardPathForRole } from '@/lib/auth/roles'
import { getUserProfileWithIsActiveFallback } from '@/lib/auth/profile-query'
import type { LoginFormState } from '@/lib/auth/types'

const INVALID_CREDENTIALS = 'Invalid email or password.'
const PROFILE_NOT_FOUND = 'Your account does not have an assigned dashboard role yet.'
const ACCOUNT_INACTIVE = 'Your account is inactive. Please contact an administrator.'
const EMAIL_NOT_CONFIRMED = 'Please verify your email before logging in.'
const TOO_MANY_ATTEMPTS = 'Too many login attempts. Please wait a moment and try again.'
const PROFILE_LOOKUP_FAILED = 'We could not load your dashboard profile. Please try again.'
const SIGN_IN_FAILED = 'Unable to sign in right now. Please try again.'

function getLoginErrorMessage(message: string | undefined) {
  const normalized = message?.toLowerCase() ?? ''

  if (!normalized) return INVALID_CREDENTIALS
  if (normalized.includes('invalid login credentials') || normalized.includes('invalid email or password')) return INVALID_CREDENTIALS
  if (normalized.includes('email not confirmed') || normalized.includes('email address not confirmed')) return EMAIL_NOT_CONFIRMED
  if (normalized.includes('too many requests') || normalized.includes('rate limit')) return TOO_MANY_ATTEMPTS

  return message ?? SIGN_IN_FAILED
}

export async function loginAction(_: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: getLoginErrorMessage(error.message) }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    await supabase.auth.signOut()
    return { error: getLoginErrorMessage(userError?.message) }
  }

  const { data: profile, error: profileError } = await getUserProfileWithIsActiveFallback<{ role: string | null }>({
    supabase,
    userId: user.id,
    selectWithIsActive: 'role,is_active',
    selectWithoutIsActive: 'role',
  })

  if (profileError) {
    await supabase.auth.signOut()
    return { error: PROFILE_LOOKUP_FAILED }
  }

  if (profile && profile.is_active === false) {
    await supabase.auth.signOut()
    return { error: ACCOUNT_INACTIVE }
  }

  const destination = getDashboardPathForRole(profile?.role)

  if (!destination) {
    await supabase.auth.signOut()
    return { error: PROFILE_NOT_FOUND }
  }

  redirect(destination)
}

interface QueryErrorLike {
  code?: string
  message?: string
}

interface SupabaseQueryResult<T> {
  data: T | null
  error: QueryErrorLike | null
}

function isMissingIsActiveColumn(error: QueryErrorLike | null) {
  const message = error?.message?.toLowerCase() ?? ''
  return message.includes('is_active') && (message.includes('column') || message.includes('schema cache'))
}

export async function getUserProfileWithIsActiveFallback<T extends object>({
  supabase,
  userId,
  selectWithIsActive,
  selectWithoutIsActive,
}: {
  supabase: any
  userId: string
  selectWithIsActive: string
  selectWithoutIsActive: string
}) {
  const primary = await supabase
    .from('user_profiles')
    .select(selectWithIsActive)
    .eq('user_id', userId)
    .maybeSingle() as SupabaseQueryResult<T & { is_active: boolean | null }>

  if (!isMissingIsActiveColumn(primary.error)) {
    return primary
  }

  const fallback = await supabase
    .from('user_profiles')
    .select(selectWithoutIsActive)
    .eq('user_id', userId)
    .maybeSingle() as SupabaseQueryResult<T>

  return {
    data: fallback.data ? { ...fallback.data, is_active: true } : null,
    error: fallback.error,
  }
}
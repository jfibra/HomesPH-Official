'use client'

import { format } from 'date-fns'
import { CalendarDays, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type { ManagedUserRecord } from '@/lib/users-types'

function formatDate(value: string | null) {
  if (!value) return 'Not available'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? 'Not available' : format(parsed, 'MMM d, yyyy')
}

function getInitials(user: ManagedUserRecord) {
  const source = user.full_name?.trim() || user.email
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function UserProfileDrawer({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: ManagedUserRecord | null
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="ml-auto h-full w-full max-w-xl border-l border-slate-200 bg-white">
        <DrawerHeader className="border-b border-slate-100 px-6 py-5 text-left">
          <DrawerTitle>User Profile</DrawerTitle>
          <DrawerDescription>View core account details, identity, and access role information.</DrawerDescription>
        </DrawerHeader>

        {user ? (
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <Avatar className="h-20 w-20 rounded-3xl">
                <AvatarImage src={user.profile_image_url ?? undefined} alt={user.full_name ?? user.email} />
                <AvatarFallback className="rounded-xl bg-slate-900 text-lg font-bold text-white">{getInitials(user)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{user.full_name}</h2>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-full border-blue-200 bg-blue-50 text-blue-700">{(user.role ?? 'unknown').replace(/_/g, ' ')}</Badge>
                  <Badge variant="outline" className={user.is_active ? 'rounded-full border-emerald-200 bg-emerald-50 text-emerald-700' : 'rounded-full border-slate-200 bg-slate-100 text-slate-600'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailCard icon={Mail} label="Email" value={user.email} />
              <DetailCard icon={ShieldCheck} label="Role" value={(user.role ?? 'Not assigned').replace(/_/g, ' ')} />
              <DetailCard icon={UserRound} label="Gender" value={user.gender ? user.gender.replace(/_/g, ' ') : 'Not set'} />
              <DetailCard icon={CalendarDays} label="Birthday" value={formatDate(user.birthday)} />
              <DetailCard icon={CalendarDays} label="Account Created" value={formatDate(user.auth_created_at ?? user.created_at)} />
              <DetailCard icon={CalendarDays} label="Last Login" value={formatDate(user.last_sign_in_at)} />
            </div>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search, Bell, Plus, ChevronDown,
  User, Settings, LogOut, FolderOpen, Home, UserPlus, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { canPerformDashboardAction, ROLE_META, type DashboardModuleKey } from '@/lib/dashboard-permissions'
import { useDashboardUser } from './DashboardUserProvider'
import LogoutButton from './LogoutButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
  onMenuToggle: () => void
}

const QUICK_CREATE: Array<{ label: string; icon: typeof FolderOpen; moduleKey: DashboardModuleKey; href: string }> = [
  { label: 'Create Project', icon: FolderOpen, moduleKey: 'projects', href: '/dashboard/projects' },
  { label: 'Add Listing', icon: Home, moduleKey: 'listings', href: '/dashboard/listings' },
  { label: 'Add Lead', icon: UserPlus, moduleKey: 'leads', href: '/dashboard/leads' },
  { label: 'Add Developer', icon: Building2, moduleKey: 'developers', href: '/dashboard/developers' },
]

const NOTIFICATIONS = [
  { id: 1, title: 'New inquiry received',    desc: 'A buyer inquired about Marina Bay Residences', time: '2m ago',  unread: true  },
  { id: 2, title: 'Lead converted',          desc: 'Santos family successfully closed their deal',  time: '1h ago',  unread: true  },
  { id: 3, title: 'Project listing approved', desc: 'Azure Sky Cebu has been approved & published', time: '3h ago',  unread: false },
  { id: 4, title: 'New salesperson joined',  desc: 'Maria Cruz joined your broker team',            time: '1d ago',  unread: false },
]

function Breadcrumb() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  return (
    <nav className="flex items-center gap-1 text-sm min-w-0 overflow-hidden">
      {parts.map((part, i) => {
        const isLast = i === parts.length - 1
        const label  = part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        return (
          <span key={i} className="flex items-center gap-1 shrink-0">
            {i > 0 && <span className="text-slate-300 text-xs">/</span>}
            <span className={cn(
              'text-sm',
              isLast ? 'text-slate-800 font-semibold' : 'text-slate-400',
            )}>
              {label}
            </span>
          </span>
        )
      })}
    </nav>
  )
}

export default function DashboardTopbar({ onMenuToggle }: Props) {
  const [notifOpen,  setNotifOpen]  = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [userOpen,   setUserOpen]   = useState(false)
  const user = useDashboardUser()

  const pathname = usePathname()
  const role     = user.roleSegment
  const meta     = ROLE_META[role]
  const unread   = NOTIFICATIONS.filter(n => n.unread).length
  const availableQuickCreate = QUICK_CREATE.filter((item) => canPerformDashboardAction(role, item.moduleKey, 'create', user.dashboardPermissions))

  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'U'

  function closeAll() { setNotifOpen(false); setCreateOpen(false); setUserOpen(false) }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-3 shrink-0 z-20">

      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Search size={16} />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <Breadcrumb />
      </div>

      {/* Search (desktop) */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-400 w-60 cursor-pointer hover:border-slate-300 transition-colors">
        <Search size={13} className="shrink-0" />
        <span className="text-sm">Search anything…</span>
        <kbd className="ml-auto text-[10px] border border-slate-200 rounded px-1.5 py-0.5 font-mono text-slate-400">⌘K</kbd>
      </div>

      {/* Quick create */}
      {availableQuickCreate.length > 0 && (
        <div className="relative">
          <button
            onClick={() => { closeAll(); setCreateOpen(v => !v) }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1428ae] hover:bg-[#0f1f8a] text-white text-sm font-semibold transition-colors shadow-sm shadow-[#1428ae]/30"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Create</span>
          </button>
          {createOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCreateOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5">
                {availableQuickCreate.map(item => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setCreateOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Icon size={14} className="text-slate-400" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { closeAll(); setNotifOpen(v => !v) }}
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white rounded-xl shadow-xl border border-slate-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">Notifications</p>
                <button className="text-xs text-[#1428ae] font-semibold hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={cn('px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors', n.unread && 'bg-[#1428ae]/5')}>
                    <div className="flex items-start gap-2.5">
                      <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', n.unread ? 'bg-[#1428ae]' : 'bg-transparent')} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <button className="text-xs text-[#1428ae] font-semibold hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => { closeAll(); setUserOpen(v => !v) }}
          className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Avatar className="w-7 h-7 border border-slate-200">
            <AvatarImage src={user.profileImageUrl ?? undefined} alt={user.fullName} />
            <AvatarFallback className="bg-[#1428ae] text-white text-xs font-black">{initials}</AvatarFallback>
          </Avatar>
          <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
        </button>
        {userOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                <p className="text-[11px] text-slate-400 mt-1">{meta?.label ?? 'User'}</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <User size={14} className="text-slate-400" />
                  Profile
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Settings size={14} className="text-slate-400" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Bell size={14} className="text-slate-400" />
                  Notifications
                </button>
                <div className="my-1 mx-2 border-t border-slate-100" />
                <LogoutButton className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                  <LogOut size={14} />
                  Logout
                </LogoutButton>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

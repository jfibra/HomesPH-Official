'use client'

import { useMemo, useState, useTransition } from 'react'
import { format } from 'date-fns'
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UserMinus,
  UserRoundCheck,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { ManagedUserRecord, UserRoleRecord } from '@/lib/users-types'
import UserCreateModal from './user-create-modal'
import UserEditModal from './user-edit-modal'
import UserRoleModal from './user-role-modal'
import UserProfileDrawer from './user-profile-drawer'
import {
  deleteUserAction,
  resetUserPasswordAction,
  setUserStatusAction,
} from '@/app/dashboard/users/actions'

const PAGE_SIZE = 10

function formatDate(value: string | null) {
  if (!value) return 'Never'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? 'Never' : format(parsed, 'MMM d, yyyy')
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

type SortKey = 'name' | 'date'

export default function UsersTable({
  initialUsers,
  roles,
}: {
  initialUsers: ManagedUserRecord[]
  roles: UserRoleRecord[]
}) {
  const { toast } = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortKey>('date')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<ManagedUserRecord | null>(null)
  const [editUser, setEditUser] = useState<ManagedUserRecord | null>(null)
  const [roleUser, setRoleUser] = useState<ManagedUserRecord | null>(null)
  const [statusUser, setStatusUser] = useState<ManagedUserRecord | null>(null)
  const [deleteUser, setDeleteUser] = useState<ManagedUserRecord | null>(null)
  const [passwordUser, setPasswordUser] = useState<ManagedUserRecord | null>(null)
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()

  function patchUser(nextUser: ManagedUserRecord) {
    setUsers(current => current.map((entry) => entry.id === nextUser.id ? nextUser : entry))
  }

  function addUser(nextUser: ManagedUserRecord) {
    setUsers(current => [nextUser, ...current])
  }

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...users]
      .filter((user) => {
        const matchesSearch = !query
          || user.full_name?.toLowerCase().includes(query)
          || user.email.toLowerCase().includes(query)

        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        const matchesStatus = statusFilter === 'all'
          || (statusFilter === 'active' && user.is_active)
          || (statusFilter === 'inactive' && !user.is_active)

        return matchesSearch && matchesRole && matchesStatus
      })
      .sort((left, right) => {
        if (sortBy === 'name') {
          return (left.full_name ?? '').localeCompare(right.full_name ?? '')
        }

        return new Date(right.created_at ?? right.auth_created_at ?? 0).getTime()
          - new Date(left.created_at ?? left.auth_created_at ?? 0).getTime()
      })
  }, [users, search, roleFilter, statusFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  async function handleStatusChange(user: ManagedUserRecord, isActive: boolean) {
    const previous = users
    patchUser({ ...user, is_active: isActive })

    startTransition(async () => {
      const result = await setUserStatusAction(user.id, isActive)

      if (!result.success || !result.data) {
        setUsers(previous)
        toast({ title: 'Status update failed', description: result.message, variant: 'destructive' })
        return
      }

      patchUser(result.data)
      toast({ title: isActive ? 'User activated' : 'User deactivated', description: result.message })
      setStatusUser(null)
    })
  }

  async function handleDelete(user: ManagedUserRecord) {
    const previous = users
    setUsers(current => current.filter((entry) => entry.user_id !== user.user_id))

    startTransition(async () => {
      const result = await deleteUserAction(user.user_id)

      if (!result.success) {
        setUsers(previous)
        toast({ title: 'Delete failed', description: result.message, variant: 'destructive' })
        return
      }

      toast({ title: 'User deleted', description: result.message })
      setDeleteUser(null)
    })
  }

  async function handlePasswordReset() {
    if (!passwordUser) return

    startTransition(async () => {
      const result = await resetUserPasswordAction(passwordUser.user_id, password)

      if (!result.success) {
        toast({ title: 'Reset failed', description: result.message, variant: 'destructive' })
        return
      }

      toast({ title: 'Password reset', description: result.message })
      setPasswordUser(null)
      setPassword('')
    })
  }

  return (
    <>
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-slate-900">Platform Users</CardTitle>
            <div className="ml-auto flex w-full flex-wrap gap-3 xl:w-auto">
              <div className="relative min-w-[260px] flex-1 xl:w-72 xl:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }} className="rounded-xl border-slate-200 pl-9" placeholder="Search users by name or email" />
              </div>

              <Select value={roleFilter} onValueChange={(value) => {
                setRoleFilter(value)
                setPage(1)
              }}>
                <SelectTrigger className="w-[180px] rounded-xl"><SelectValue placeholder="Filter by role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.role_name}>{role.role_name.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value)
                setPage(1)
              }}>
                <SelectTrigger className="w-[170px] rounded-xl"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortKey) => setSortBy(value)}>
                <SelectTrigger className="w-[170px] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="date">Sort by Date</SelectItem>
                </SelectContent>
              </Select>

              <UserCreateModal roles={roles} onCreated={addUser} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto px-0">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/80 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Avatar</th>
                <th className="px-4 py-4">
                  <button className="inline-flex items-center gap-1 text-left" onClick={() => setSortBy('name')}>
                    Name
                    <ArrowDownAZ size={14} />
                  </button>
                </th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">
                  <button className="inline-flex items-center gap-1 text-left" onClick={() => setSortBy('date')}>
                    Created Date
                    <ArrowDownWideNarrow size={14} />
                  </button>
                </th>
                <th className="px-4 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedUsers.length ? paginatedUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Avatar className="h-11 w-11 rounded-xl">
                      <AvatarImage src={user.profile_image_url ?? undefined} alt={user.full_name ?? user.email} />
                      <AvatarFallback className="rounded-xl bg-slate-900 font-semibold text-white">{getInitials(user)}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{user.full_name}</p>
                      <p className="text-xs text-slate-500">{user.gender ? user.gender.replace(/_/g, ' ') : 'Not set'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="rounded-full border-blue-200 bg-blue-50 text-blue-700">{(user.role ?? 'unknown').replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className={cn('rounded-full border px-2.5 py-0.5', user.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-600')}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{formatDate(user.auth_created_at ?? user.created_at)}</td>
                  <td className="px-4 py-4 text-slate-600">{formatDate(user.last_sign_in_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-200">
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye size={15} />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditUser(user)}>
                          <Pencil size={15} />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleUser(user)}>
                          <UserCog size={15} />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusUser(user)}>
                          {user.is_active ? <UserMinus size={15} /> : <UserRoundCheck size={15} />}
                          {user.is_active ? 'Deactivate User' : 'Activate User'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPasswordUser(user)}>
                          <RotateCcw size={15} />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteUser(user)}>
                          <Trash2 size={15} />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-sm text-slate-500">
                    No users match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-500">
            Showing {paginatedUsers.length ? (page - 1) * PAGE_SIZE + 1 : 0} to {Math.min(page * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(event) => {
                  event.preventDefault()
                  goToPage(page - 1)
                }} className={page === 1 ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, index) => {
                const pageNumber = index + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink href="#" isActive={pageNumber === page} onClick={(event) => {
                      event.preventDefault()
                      goToPage(pageNumber)
                    }}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              {totalPages > 5 ? (
                <PaginationItem>
                  <span className="flex h-9 items-center px-2 text-slate-400">
                    <ChevronDown size={14} className="rotate-[-90deg]" />
                  </span>
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationNext href="#" onClick={(event) => {
                  event.preventDefault()
                  goToPage(page + 1)
                }} className={page === totalPages ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      <UserProfileDrawer open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)} user={selectedUser} />
      <UserEditModal open={Boolean(editUser)} onOpenChange={(open) => !open && setEditUser(null)} user={editUser} roles={roles} onSaved={patchUser} />
      <UserRoleModal open={Boolean(roleUser)} onOpenChange={(open) => !open && setRoleUser(null)} user={roleUser} roles={roles} onSaved={patchUser} />

      <AlertDialog open={Boolean(statusUser)} onOpenChange={(open) => !open && setStatusUser(null)}>
        <AlertDialogContent className="rounded-xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>{statusUser?.is_active ? 'Deactivate user?' : 'Activate user?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {statusUser?.is_active
                ? 'Are you sure you want to deactivate this user? They will no longer be able to log in.'
                : 'This will restore the account and allow the user to log in again.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" onClick={(event) => {
              event.preventDefault()
              if (statusUser) {
                handleStatusChange(statusUser, !statusUser.is_active)
              }
            }}>
              {isPending ? 'Working...' : statusUser?.is_active ? 'Deactivate User' : 'Activate User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deleteUser)} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent className="rounded-xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the account from authentication and deletes the linked profile record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-red-600 text-white hover:bg-red-700" onClick={(event) => {
              event.preventDefault()
              if (deleteUser) {
                handleDelete(deleteUser)
              }
            }}>
              {isPending ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={Boolean(passwordUser)} onOpenChange={(open) => {
        if (!open) {
          setPasswordUser(null)
          setPassword('')
        }
      }}>
        <DialogContent className="max-w-md rounded-xl border-slate-200">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for this user. They can change it again after signing in.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" />
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => {
              setPasswordUser(null)
              setPassword('')
            }}>Cancel</Button>
            <Button className="rounded-xl bg-[#1428ae] hover:bg-[#0f1f8a]" disabled={isPending || password.length < 8} onClick={handlePasswordReset}>
              {isPending ? 'Saving...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
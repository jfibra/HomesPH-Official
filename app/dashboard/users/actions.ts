'use server'

import { revalidatePath } from 'next/cache'
import {
  createManagedUser,
  deleteManagedUser,
  resetManagedUserPassword,
  setManagedUserActive,
  updateManagedUser,
  updateManagedUserRole,
} from '@/lib/users-admin'
import type { CreateManagedUserInput, ManagedUserProfileInput, ManagedUserRecord } from '@/lib/users-types'

interface ActionResult<T = undefined> {
  success: boolean
  message: string
  data?: T
}

function revalidateUsersSurface() {
  revalidatePath('/dashboard/users')
}

export async function createUserAction(input: CreateManagedUserInput): Promise<ActionResult<ManagedUserRecord>> {
  try {
    const data = await createManagedUser(input)
    revalidateUsersSurface()
    return { success: true, message: 'User created successfully.', data }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unable to create user.' }
  }
}

export async function updateUserAction(profileId: string, input: ManagedUserProfileInput): Promise<ActionResult<ManagedUserRecord>> {
  try {
    const data = await updateManagedUser(profileId, input)
    revalidateUsersSurface()
    return { success: true, message: 'User updated.', data }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unable to update user.' }
  }
}

export async function changeUserRoleAction(profileId: string, role: string): Promise<ActionResult<ManagedUserRecord>> {
  try {
    const data = await updateManagedUserRole(profileId, role)
    revalidateUsersSurface()
    return { success: true, message: 'Role updated.', data }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unable to update role.' }
  }
}

export async function setUserStatusAction(profileId: string, isActive: boolean): Promise<ActionResult<ManagedUserRecord>> {
  try {
    const data = await setManagedUserActive(profileId, isActive)
    revalidateUsersSurface()
    return { success: true, message: isActive ? 'User activated.' : 'User deactivated.', data }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unable to update user status.' }
  }
}

export async function resetUserPasswordAction(userId: string, password: string): Promise<ActionResult> {
  try {
    await resetManagedUserPassword(userId, password)
    return { success: true, message: 'Password reset successfully.' }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unable to reset password.' }
  }
}

export async function deleteUserAction(userId: string): Promise<ActionResult<{ userId: string }>> {
  try {
    await deleteManagedUser(userId)
    revalidateUsersSurface()
    return { success: true, message: 'User deleted successfully.', data: { userId } }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unable to delete user.' }
  }
}
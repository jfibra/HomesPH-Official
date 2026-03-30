# Registration Approval Guide

## Purpose

This document explains, in simple terms, how HomesPH registration should work once approval is required before a user can access the dashboard.

It is meant to help product, admin, and engineering review the change quickly.

---

## Current Problem

Today, broker and developer users can register, verify their email, and become active right away.

That creates a mismatch in the system:

- The registration pages already say that the account will be reviewed.
- The backend still creates the account as active immediately.
- The login page only knows one blocked state: inactive.
- There is no clear difference between:
  - waiting for approval
  - rejected account
  - manually disabled account

Because of that, the current flow is confusing for users and hard to manage for admins.

---

## Goal

Make all self-registered accounts go through approval before dashboard access is allowed.

### Expected user flow

1. User registers.
2. User verifies their email with OTP.
3. Account stays blocked while waiting for admin approval.
4. Admin reviews the account in the Users Management dashboard.
5. Admin either approves or rejects the registration.
6. User receives an email about the decision.
7. Only approved users can log in to the dashboard.

---

## Simple Rule

Use `is_active` as the main gate for dashboard access.

Also add a lightweight account-state reason so the system can explain *why* the account is inactive.

### Why this matters

`is_active = false` by itself is not enough.

Without a second field, the app cannot tell whether the user is:

- pending approval
- rejected
- manually disabled by admin

If we want clear login messages and correct approval/rejection emails, we need that extra status information.

---

## Recommended Account States

Keep the access gate simple:

- `is_active = true` means the user can access the dashboard.
- `is_active = false` means the user is blocked.

Add a lightweight reason/status field for blocked users:

- `pending_approval`
- `rejected`
- `manually_disabled`

Recommended supporting metadata:

- `approved_at`
- `approved_by`
- `rejection_reason`

This gives the app enough detail without making the approval system too complex.

---

## What Needs To Change

## 1. Database

Update `user_profiles` to store approval-related state.

### Needed changes

- Keep `is_active` as the access gate.
- Add a field that explains why the account is inactive.
- Add approval metadata.
- Backfill existing users carefully.

### Important note

This repo does **not** have migration tooling checked in.

That means the schema change must be applied manually in the database and then documented in the schema guide.

---

## 2. Registration Flow

Public self-registration should no longer create active users.

### New behavior

- Registration creates the user account.
- OTP email verification still happens.
- After verification, the account stays inactive.
- The account is marked as `pending_approval`.

### Applies to current public routes

- Broker registration
- Developer registration

### Special case: developers

Developer registration currently writes to both:

- `user_profiles`
- `developers_profiles`

Both need to stay in sync so a pending developer is not accidentally treated as active in one table and inactive in another.

---

## 3. OTP Verification UX

Right now, OTP verification can leave the user in a signed-in state even though the account should still be blocked.

### Better behavior

After successful OTP verification:

- confirm the email is verified
- tell the user the account is waiting for approval
- avoid leaving them silently signed in with no dashboard access

Recommended approach:

- sign the user out after OTP verification
- send them to login with a clear pending-approval message

---

## 4. Login Behavior

The login page should show the correct message depending on the blocked reason.

### Expected messages

- `pending_approval` -> "Your account is waiting for admin approval."
- `rejected` -> "Your registration was not approved."
- `manually_disabled` -> "Your account is inactive. Please contact an administrator."

This avoids showing the same generic inactive message for every case.

---

## 5. Admin Approval Workflow

Do **not** build a brand-new approval page unless there is a product reason.

Reuse the existing Users Management dashboard.

### Admin actions needed

- view pending users
- filter by status
- approve account
- reject account
- deactivate approved account
- reactivate disabled account

### Why reuse the current page

- it already exists
- admins already manage users there
- it reduces duplicated UI and logic

---

## 6. Email Notifications

Approval and rejection emails should be sent after admin action.

### Required notifications

- approval email
- rejection email

### Delivery choice

Use the existing Supabase/SMTP setup outside the repo.

### Important note

There is no mailer abstraction currently checked into the codebase.

That means implementation still needs to confirm the exact SMTP/Supabase mail path in the runtime environment.

---

## What Should Stay The Same

These parts should remain unchanged unless requirements expand:

- Admin-created users can stay active immediately.
- `is_active` remains the hard dashboard gate.
- Dashboard protection should continue to run through the shared auth/user path.
- OTP signup confirmation email can continue to come from Supabase Auth.

---

## Key Files Involved

### Registration

- `app/registration/actions.ts`
- `components/auth/BrokerRegisterForm.tsx`
- `components/auth/DeveloperRegisterForm.tsx`
- `components/auth/OtpVerifyStep.tsx`

### Login and access control

- `app/login/actions.ts`
- `app/login/page.tsx`
- `components/auth/LoginForm.tsx`
- `lib/auth/user.ts`
- `lib/auth/profile-query.ts`
- `app/dashboard/layout.tsx`

### Admin approval UI

- `app/dashboard/users/page.tsx`
- `app/dashboard/users/actions.ts`
- `components/users/users-table.tsx`
- `components/users/user-profile-drawer.tsx`
- `lib/users-admin.ts`
- `lib/users-types.ts`

### Developer sync

- `lib/developers-admin.ts`

### Schema documentation

- `guidelines/database_structure/db_creation.md`

---

## Recommended Implementation Order

1. Add the new account-state fields in the database.
2. Update the schema documentation.
3. Change self-registration to create pending users.
4. Fix OTP success flow so users understand they are waiting for approval.
5. Update login messages for pending, rejected, and disabled states.
6. Extend Users Management with approve/reject actions.
7. Sync developer status updates across both profile tables.
8. Add approval and rejection emails.
9. Test the full flow end to end.

---

## Testing Checklist

### Broker registration

- user registers
- user verifies OTP
- account remains blocked
- login shows pending approval message
- admin approves
- user receives approval email
- user can log in

### Developer registration

- user registers
- user verifies OTP
- both `user_profiles` and `developers_profiles` remain blocked
- admin approves or rejects
- related profile status stays in sync

### Admin actions

- approve pending account
- reject pending account
- deactivate approved account
- reactivate disabled account

### Existing users

- existing active users remain active
- existing inactive users are not mistaken for pending registrations
- admin-created users still work as expected

---

## Out Of Scope For This Phase

These can be added later if needed, but they are not required for the first version:

- PRC validation integration
- company verification workflow
- full audit-history system
- separate approval dashboard page
- permission-system redesign
- deep email template system

---

## Final Recommendation

The cleanest version of this feature is:

- self-registered users start inactive
- the system stores *why* they are inactive
- admins approve from the existing users dashboard
- approved users are activated
- rejected or disabled users stay blocked with clear messaging

This keeps the flow easy for users, understandable for admins, and simple enough to maintain in the current codebase.
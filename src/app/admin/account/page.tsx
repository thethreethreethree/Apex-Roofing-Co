import Link from 'next/link'
import { requireUser } from '@/server/auth/session'
import ChangePasswordForm from './ChangePasswordForm'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await requireUser()

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-brand">Account</h1>
          <p className="text-sm text-muted">Signed in as {user.username}</p>
        </div>
        <Link
          href="/admin"
          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent"
        >
          ← Back
        </Link>
      </div>

      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Change password</h2>
      <ChangePasswordForm />
    </main>
  )
}

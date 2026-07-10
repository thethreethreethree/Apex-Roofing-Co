import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/server/auth/session'
import { logout } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export default async function ManageDashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/manage/login')

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between border-b border-line pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-brand">Manage</h1>
          <p className="text-sm text-muted">Signed in as {user.username}</p>
        </div>
        <form action={logout}>
          <button className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent">
            Log out
          </button>
        </form>
      </div>
      <p className="mt-8 text-sm text-muted">
        Custom admin dashboard — content management (Phase 3) will live here. Auth is live: this
        page is protected and only reachable with a valid session.
      </p>
    </main>
  )
}

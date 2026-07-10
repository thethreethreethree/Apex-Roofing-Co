import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/server/auth/session'
import { logout } from '@/app/actions/auth'
import { collectionList } from '@/server/admin/config'

export const dynamic = 'force-dynamic'

export default async function ManageDashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/manage/login')

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
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

      <h2 className="mt-8 mb-3 text-xs font-bold uppercase tracking-wide text-muted">Content</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collectionList.map((c) => (
          <Link
            key={c.slug}
            href={`/manage/${c.slug}`}
            className="rounded-xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-sm"
          >
            <div className="font-bold text-ink">{c.label}</div>
            <div className="mt-1 text-xs text-muted">
              {c.createDisabled ? 'Inbox — view & update' : 'Create, edit, delete'}
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted">
        Site settings, branding, home page & packages intro (globals) editors — coming in the next
        increment.
      </p>
    </main>
  )
}

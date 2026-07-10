'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'

const inputCls =
  'w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent'

export default function ManageLogin() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const res = await login({
      username: String(fd.get('username') || ''),
      password: String(fd.get('password') || ''),
    })
    setBusy(false)
    if (res.ok) router.replace('/admin')
    else setError(res.error)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-extrabold text-brand">Shaggy Doggy Spa</h1>
        <p className="mb-6 text-sm text-muted">Sign in to manage your site.</p>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input required name="username" aria-label="Username" placeholder="Username" className={inputCls} autoComplete="username" />
          <input required name="password" type="password" aria-label="Password" placeholder="Password" className={inputCls} autoComplete="current-password" />
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { changePassword } from '@/app/actions/auth'

const inputCls =
  'w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent'
const labelCls = 'mb-1 block text-sm font-semibold text-ink'

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Capture the form element before awaiting — React nulls `currentTarget`
    // once the event handler yields, so we can't read it after `await`.
    const formEl = e.currentTarget
    const fd = new FormData(formEl)
    setBusy(true)
    setError(null)
    setDone(false)
    const res = await changePassword({
      currentPassword: String(fd.get('currentPassword') || ''),
      newPassword: String(fd.get('newPassword') || ''),
      confirmPassword: String(fd.get('confirmPassword') || ''),
    })
    setBusy(false)
    if (res.ok) {
      setDone(true)
      formEl.reset()
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label className={labelCls} htmlFor="currentPassword">
            Current password
          </label>
          <input
            required
            id="currentPassword"
            name="currentPassword"
            type="password"
            className={inputCls}
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="newPassword">
            New password
          </label>
          <input
            required
            id="newPassword"
            name="newPassword"
            type="password"
            minLength={10}
            className={inputCls}
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-muted">At least 10 characters.</p>
        </div>
        <div>
          <label className={labelCls} htmlFor="confirmPassword">
            Confirm new password
          </label>
          <input
            required
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={10}
            className={inputCls}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        {done && (
          <p className="text-sm font-medium text-green-700">
            Password changed. Other devices have been signed out.
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Change password'}
        </button>
      </form>
    </div>
  )
}

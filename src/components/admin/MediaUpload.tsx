'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadMedia } from '@/server/admin/media'

const inputCls =
  'w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent'

export function MediaUpload() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    setBusy(true)
    setError(null)
    const res = await uploadMedia(new FormData(formEl))
    setBusy(false)
    if (res.ok) {
      formEl.reset()
      router.refresh()
    } else {
      setError(res.error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-3 text-sm font-bold text-ink">Upload a photo</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">File</label>
          <input required type="file" name="file" accept="image/*" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">Alt text</label>
          <input required name="alt" placeholder="e.g. Freshly groomed poodle" className={inputCls} />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </form>
  )
}

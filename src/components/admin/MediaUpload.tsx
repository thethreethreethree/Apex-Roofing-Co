'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadMedia } from '@/server/admin/media'
import { Dropzone } from './Dropzone'

const inputCls =
  'w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent'

export function MediaUpload() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [alt, setAlt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onFile = (f: File) => {
    setFile(f)
    setError(null)
    // data: URL (not blob:) so the preview is allowed by our CSP img-src.
    const reader = new FileReader()
    reader.onload = () => setPreview(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(f)
  }

  const submit = async () => {
    if (!file) {
      setError('Choose a file to upload.')
      return
    }
    setBusy(true)
    setError(null)
    const fd = new FormData()
    fd.set('file', file)
    fd.set('alt', alt)
    const res = await uploadMedia(fd)
    setBusy(false)
    if (res.ok) {
      setFile(null)
      setPreview(null)
      setAlt('')
      router.refresh()
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-3 text-sm font-bold text-ink">Upload a photo</h2>
      <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-end">
        <Dropzone
          name="file"
          onFile={onFile}
          busy={busy}
          className="grid h-24 w-24 place-items-center overflow-hidden rounded-lg border-2 border-dashed border-line text-center"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-xs text-muted">Drag or click</span>
          )}
        </Dropzone>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">Alt text</label>
          <input
            required
            name="alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="e.g. Freshly groomed poodle"
            className={inputCls}
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={busy || !file}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}

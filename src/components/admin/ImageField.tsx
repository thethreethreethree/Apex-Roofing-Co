'use client'

import { useState } from 'react'
import { Dropzone } from './Dropzone'
import { uploadMedia, updateMediaAlt } from '@/server/admin/media'

export type MediaOption = { id: number; label: string; url?: string; alt?: string }

/**
 * Visual "Replace Image" control for a single media field. Shows the current
 * photo as it appears on the site; drop a new file on it (or click) to upload +
 * assign in one step. The upload creates a NEW media row and points only this
 * field at it ("just this spot"), so other places using the old image are
 * untouched. A hidden input carries the selected media id into the form save.
 *
 * Two contracts held at once (A17): easy replace AND alt-text accessibility —
 * the drop uploads with an auto-suggested alt, then exposes an editable alt field
 * that persists, so the fast flow never silently ships an image with no alt.
 */
export function ImageField({
  name,
  currentId,
  options,
  required,
  suggestedAlt,
}: {
  name: string
  currentId: string
  options: MediaOption[]
  required?: boolean
  suggestedAlt: string
}) {
  const initial = options.find((o) => String(o.id) === currentId)
  const [id, setId] = useState(currentId)
  const [url, setUrl] = useState<string | undefined>(initial?.url)
  const [alt, setAlt] = useState(initial?.alt ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [picking, setPicking] = useState(false)

  const onFile = async (file: File) => {
    setBusy(true)
    setError(null)
    const fd = new FormData()
    fd.set('file', file)
    fd.set('alt', (alt || suggestedAlt || 'Image').trim())
    const res = await uploadMedia(fd)
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setId(String(res.id))
    setUrl(res.url)
    setAlt(res.alt)
  }

  const saveAlt = async () => {
    if (!id) return
    const res = await updateMediaAlt(Number(id), alt)
    if (!res.ok) setError(res.error)
  }

  const chooseExisting = (o: MediaOption) => {
    setId(String(o.id))
    setUrl(o.url)
    setAlt(o.alt ?? '')
    setPicking(false)
  }

  const clear = () => {
    setId('')
    setUrl(undefined)
    setAlt('')
  }

  return (
    <div>
      {/* The value the form actually submits. */}
      <input type="hidden" name={name} value={id} readOnly />

      <div className="flex items-start gap-4">
        <Dropzone
          name={`${name}__file`}
          onFile={onFile}
          busy={busy}
          className="relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border-2 border-dashed border-line text-center"
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={alt || 'Current image'} className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-xs text-muted">Drag &amp; drop or click</span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-white/70 text-xs font-semibold text-ink">
              Uploading…
            </span>
          )}
        </Dropzone>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">
            {url
              ? 'Drop a new photo on the image (or click it) to replace it.'
              : 'Drop a photo here, or click to choose a file.'}
          </p>

          {url && (
            <div className="mt-2">
              <label className="mb-1 block text-xs font-semibold text-muted">
                Alt text (accessibility &amp; SEO)
              </label>
              <input
                aria-label="Alt text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                onBlur={saveAlt}
                placeholder={suggestedAlt}
                className="w-full rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold">
            <button type="button" onClick={() => setPicking((v) => !v)} className="text-accent hover:underline">
              {picking ? 'Close library' : 'Choose existing'}
            </button>
            {url && !required && (
              <button type="button" onClick={clear} className="text-red-600 hover:underline">
                Remove
              </button>
            )}
          </div>

          {picking && (
            <div
              data-testid="media-picker"
              className="mt-2 grid max-h-44 grid-cols-4 gap-2 overflow-y-auto rounded-lg border border-line p-2"
            >
              {options.filter((o) => o.url).length === 0 && (
                <p className="col-span-4 p-2 text-xs text-muted">No photos in the library yet.</p>
              )}
              {options
                .filter((o) => o.url)
                .map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => chooseExisting(o)}
                    title={o.label}
                    className={`overflow-hidden rounded border ${
                      String(o.id) === id ? 'border-accent ring-1 ring-accent' : 'border-line'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.url} alt={o.alt || o.label} className="h-14 w-full object-cover" />
                  </button>
                ))}
            </div>
          )}

          {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}

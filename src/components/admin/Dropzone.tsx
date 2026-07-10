'use client'

import { useRef, useState } from 'react'

/**
 * Shared drag-and-drop file primitive. One implementation used by every media
 * surface (the per-field "Replace Image" control and the Media library uploader)
 * so the drop behaviour is identical everywhere (A16/A21 — same logic, one place).
 *
 * It calls `onFile` with the first dropped/selected file; the caller decides what
 * to do with it. A hidden `<input type=file>` (optionally named, so forms and
 * tests can target it) backs both click-to-pick and drop.
 */
export function Dropzone({
  onFile,
  name,
  busy,
  disabled,
  className,
  children,
}: {
  onFile: (file: File) => void
  name?: string
  busy?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const blocked = Boolean(disabled || busy)

  const pick = (files: FileList | null) => {
    const f = files?.[0]
    if (f) onFile(f)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-busy={busy}
      onClick={() => !blocked && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !blocked) {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!blocked) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!blocked) pick(e.dataTransfer.files)
      }}
      className={`${className ?? ''} ${dragging ? 'border-accent bg-accent/10' : ''} ${
        blocked ? 'cursor-wait opacity-70' : 'cursor-pointer'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />
      {children}
    </div>
  )
}

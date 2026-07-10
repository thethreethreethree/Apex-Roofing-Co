import React from 'react'
import '../(frontend)/styles.css'

export const metadata = {
  title: 'Manage — Shaggy Doggy Spa',
}

// Brand CSS variables so the shared utility classes (bg-brand, text-ink, …) work
// in the custom admin without pulling in the public site's header/footer layout.
const cssVars =
  ':root{--brand:#1c5f6b;--brand-dark:#14464f;--accent:#f2994a;--accent-hover:#e0863a;}'

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className="min-h-screen bg-surface-2 text-ink antialiased">{children}</body>
    </html>
  )
}

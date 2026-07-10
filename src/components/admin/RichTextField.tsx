'use client'

import { useState } from 'react'

/**
 * Friendly editor for a `richText` field. The underlying storage is Lexical
 * editor-state JSON (what RichText.tsx renders and seed.ts's lexical() produces),
 * which is unreadable to a non-programmer. This shows a plain-paragraph textarea
 * and converts to/from that JSON — blank line = new paragraph.
 *
 * Trade-off (surfaced, per A17): plain text only, no bold/links. All current
 * richText content is simple paragraphs, so nothing is lost; if rich formatting
 * is ever needed, this would be replaced by a full WYSIWYG editor.
 */

type LexNode = { type?: string; text?: string; children?: LexNode[] }

/** Lexical editor-state JSON → plain text (paragraphs joined by blank lines). */
function lexicalToText(value: unknown): string {
  const root = (value as { root?: LexNode } | null | undefined)?.root
  if (!root?.children) return ''
  return root.children
    .map((para) => (para.children ?? []).map((c) => c.text ?? '').join(''))
    .join('\n\n')
    .trim()
}

/** Plain text → minimal Lexical editor-state JSON (matches seed.ts's shape). */
function textToLexical(text: string) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+$/g, '').trim())
    .filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((t) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [
          { type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
        ],
      })),
    },
  }
}

export function RichTextField({ name, initial }: { name: string; initial: unknown }) {
  const [text, setText] = useState(() => lexicalToText(initial))
  // Serialise to the Lexical JSON the save layer + renderer expect.
  const value = JSON.stringify(textToLexical(text))

  return (
    <div>
      <input type="hidden" name={name} value={value} readOnly />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Write here in plain paragraphs…"
        className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <p className="mt-1 text-xs text-muted">Plain text — leave a blank line between paragraphs.</p>
    </div>
  )
}

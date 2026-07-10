import React from 'react'

/**
 * Minimal Lexical-JSON renderer for the custom backend (replaces Payload's
 * @payloadcms/richtext-lexical renderer). Walks the editor state and renders the
 * common node types: paragraphs, headings, lists, quotes, links, line breaks,
 * and text with bold/italic/underline/code formatting.
 */
type LexNode = {
  type?: string
  tag?: string
  format?: number | string
  text?: string
  url?: string
  fields?: { url?: string; newTab?: boolean }
  listType?: string
  children?: LexNode[]
}

const F = { bold: 1, italic: 2, strikethrough: 4, underline: 8, code: 16 }

function renderText(node: LexNode, key: React.Key): React.ReactNode {
  let el: React.ReactNode = node.text ?? ''
  const f = typeof node.format === 'number' ? node.format : 0
  if (f & F.code) el = <code>{el}</code>
  if (f & F.strikethrough) el = <s>{el}</s>
  if (f & F.underline) el = <u>{el}</u>
  if (f & F.italic) el = <em>{el}</em>
  if (f & F.bold) el = <strong>{el}</strong>
  return <React.Fragment key={key}>{el}</React.Fragment>
}

function renderNodes(nodes: LexNode[] | undefined): React.ReactNode {
  return nodes?.map((n, i) => renderNode(n, i)) ?? null
}

function renderNode(node: LexNode, key: React.Key): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'linebreak':
      return <br key={key} />
    case 'paragraph':
      return <p key={key}>{renderNodes(node.children)}</p>
    case 'heading': {
      const Tag = (node.tag && /^h[1-6]$/.test(node.tag) ? node.tag : 'h3') as React.ElementType
      return <Tag key={key}>{renderNodes(node.children)}</Tag>
    }
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return <Tag key={key}>{renderNodes(node.children)}</Tag>
    }
    case 'listitem':
      return <li key={key}>{renderNodes(node.children)}</li>
    case 'quote':
      return <blockquote key={key}>{renderNodes(node.children)}</blockquote>
    case 'link': {
      const raw = node.fields?.url || node.url || '#'
      // Allow only safe protocols / relative links (audit F3) — block javascript:, data:, etc.
      const url = /^(https?:|mailto:|tel:|\/|#)/i.test(raw) ? raw : '#'
      const newTab = node.fields?.newTab
      return (
        <a key={key} href={url} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {renderNodes(node.children)}
        </a>
      )
    }
    default:
      return node.children ? <React.Fragment key={key}>{renderNodes(node.children)}</React.Fragment> : null
  }
}

export const RichText = ({ data, className = '' }: { data?: unknown; className?: string }) => {
  const root = (data as { root?: LexNode } | null | undefined)?.root
  if (!root?.children || root.children.length === 0) return null
  return <div className={`richtext ${className}`}>{renderNodes(root.children)}</div>
}

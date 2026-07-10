import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RichText } from '@/components/ui/RichText'

// Build minimal Lexical states without JSX so this stays a .ts int test.
const doc = (children: unknown[]) => ({ root: { type: 'root', children } })
const para = (children: unknown[]) => ({ type: 'paragraph', children })
const text = (t: string, format = 0) => ({ type: 'text', text: t, format })
const link = (url: string, t: string) => ({ type: 'link', fields: { url }, children: [text(t)] })

const render = (data: unknown) => renderToStaticMarkup(React.createElement(RichText, { data }))

describe('RichText renderer (custom, replaces Payload lexical)', () => {
  it('blocks javascript: link hrefs (audit F3)', () => {
    const html = render(doc([para([link('javascript:alert(1)', 'bad')])]))
    expect(html).not.toContain('javascript:')
    expect(html).toContain('href="#"')
  })

  it('blocks data: link hrefs (audit F3)', () => {
    const html = render(doc([para([link('data:text/html,<script>1</script>', 'bad')])]))
    expect(html).not.toContain('data:')
    expect(html).toContain('href="#"')
  })

  it('allows https, mailto, and relative hrefs', () => {
    expect(render(doc([para([link('https://example.com', 'a')])]))).toContain('href="https://example.com"')
    expect(render(doc([para([link('mailto:hi@x.com', 'b')])]))).toContain('href="mailto:hi@x.com"')
    expect(render(doc([para([link('/services', 'c')])]))).toContain('href="/services"')
  })

  it('renders bold text as <strong> and paragraphs as <p>', () => {
    const html = render(doc([para([text('Hi', 1)])]))
    expect(html).toContain('<p>')
    expect(html).toContain('<strong>Hi</strong>')
  })

  it('renders nothing for empty/missing content', () => {
    expect(render(null)).toBe('')
    expect(render({ root: { type: 'root', children: [] } })).toBe('')
  })
})

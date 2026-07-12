import type { ReactNode } from 'react'
import { Container } from './Container'

export const Section = ({
  eyebrow,
  title,
  subtitle,
  children,
  alt = false,
  className = '',
  id,
}: {
  eyebrow?: string
  title?: string
  subtitle?: string
  children: ReactNode
  alt?: boolean
  className?: string
  id?: string
}) => (
  <section id={id} className={`${alt ? 'bg-surface-2' : 'bg-surface'} py-16 sm:py-20 ${className}`}>
    <Container>
      {(eyebrow || title || subtitle) && (
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
          {eyebrow && (
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-accent">
              <span aria-hidden>🐾</span> {eyebrow}
            </p>
          )}
          {title && <h2 className="text-3xl text-ink sm:text-4xl">{title}</h2>}
          {title && <span className="squiggle mx-auto" aria-hidden />}
          {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </Container>
  </section>
)

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
        <div className="mx-auto mb-12 max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">{eyebrow}</p>
          )}
          {title && <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>}
          {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </Container>
  </section>
)

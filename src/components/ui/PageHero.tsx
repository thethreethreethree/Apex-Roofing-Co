import type { ReactNode } from 'react'
import { Container } from './Container'

export const PageHero = ({
  title,
  subtitle,
  eyebrow,
  children,
}: {
  title: string
  subtitle?: string
  eyebrow?: string
  children?: ReactNode
}) => (
  <section className="bg-brand text-white">
    <Container className="py-14 sm:py-16">
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-lg text-white/85">{subtitle}</p>}
      {children}
    </Container>
  </section>
)

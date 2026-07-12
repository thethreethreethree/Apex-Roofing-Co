import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'accent' | 'dark' | 'outline' | 'outlineLight'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0'

const variants: Record<Variant, string> = {
  accent: 'bg-accent text-white hover:bg-accent-hover shadow-soft hover:shadow-lg',
  dark: 'bg-brand text-white hover:bg-brand-dark shadow-soft',
  outline: 'border-2 border-brand bg-white text-brand hover:bg-brand hover:text-white',
  outlineLight: 'border-2 border-white/70 text-white hover:bg-white hover:text-brand',
}

const sizes: Record<Size, string> = {
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

type Props = {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  type?: 'button' | 'submit'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export const Button = ({
  children,
  variant = 'accent',
  size = 'md',
  href,
  type = 'button',
  className = '',
  onClick,
  disabled,
}: Props) => {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) {
    const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')
    if (external) {
      return (
        <a href={href} className={cls}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'accent' | 'dark' | 'outline' | 'outlineLight'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  accent: 'bg-accent text-white hover:bg-accent-hover shadow-sm',
  dark: 'bg-brand text-white hover:bg-brand-dark',
  outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white',
  outlineLight: 'border-2 border-white/70 text-white hover:bg-white hover:text-brand',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
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

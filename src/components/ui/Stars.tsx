export const Stars = ({ rating = 5, className = '' }: { rating?: number; className?: string }) => {
  const full = Math.round(rating)
  return (
    <span
      className={`inline-flex ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-[1.05em] w-[1.05em] ${i < full ? 'text-amber-400' : 'text-slate-300'}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
        </svg>
      ))}
    </span>
  )
}

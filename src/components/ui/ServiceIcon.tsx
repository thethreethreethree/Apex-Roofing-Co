// Map a service's icon name to the real brand icon art (in /public/brand).
const iconArt: Record<string, string> = {
  groom: 'icon-scissors-comb',
  bath: 'icon-bath',
  deshed: 'icon-brush',
  nails: 'icon-nail-clipper',
  flea: 'icon-shield-paw',
  cat: 'icon-cat',
}

const paths: Record<string, string> = {
  groom: 'M6 5a2 2 0 1 0 0 4 2 2 0 1 0 0-4ZM6 15a2 2 0 1 0 0 4 2 2 0 1 0 0-4ZM7.7 7.7 20 20M7.7 16.3 20 4',
  bath: 'M12 3s6 6.4 6 10a6 6 0 0 1-12 0c0-3.6 6-10 6-10Z',
  deshed: 'M4 13h10a2 2 0 0 0 2-2 3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2ZM6 13v4M9 13v5M12 13v4',
  nails: 'M12 13.5c-2 0-3.6 1.5-3.6 3.2 0 1.3 1.1 2.3 2.4 2.3.5 0 .9-.2 1.2-.4.3.2.7.4 1.2.4 1.3 0 2.4-1 2.4-2.3 0-1.7-1.6-3.2-3.6-3.2ZM7 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM9.8 8.3a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8ZM14.2 8.3a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z',
  flea: 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3ZM9 11.5l2 2 4-4',
  cat: 'M5 5l2.5 3.5M19 5l-2.5 3.5M6.2 8.5C5.5 9.7 5 11.2 5 12.7 5 16.2 8.1 19 12 19s7-2.8 7-6.3c0-1.5-.5-3-1.2-4.2M9.5 12h.01M14.5 12h.01M12 14.2l-1 .8h2l-1-.8Z',
}

export const ServiceIcon = ({
  name,
  className = 'h-7 w-7',
}: {
  name?: string | null
  className?: string
}) => {
  const art = iconArt[name ?? '']
  if (art) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/brand/${art}.webp`} alt="" aria-hidden="true" className={`${className} object-contain`} />
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name ?? 'groom'] ?? paths.groom} />
    </svg>
  )
}

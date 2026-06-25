const paths: Record<string, string> = {
  roof: 'M3 11.5 12 4l9 7.5M5 10v9h14v-9M9.5 19v-5h5v5',
  repair: 'M14.7 6.3a4 4 0 0 0-5.4 5.4l-5 5a1.5 1.5 0 0 0 2.1 2.1l5-5a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.1-.5-.5-2.1 2.3-2.3Z',
  inspection: 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-1 8 4-4M9.5 11.5l1.5 1.5',
  gutters: 'M4 7h16M4 7v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7M8 16v3M12 16v4M16 16v3',
  storm: 'M7 13h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 5.5 7 3.5 3.5 0 0 0 6 13M13 13l-3 5h4l-3 5',
  commercial: 'M4 21V5l8-2 8 2v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6',
}

export const ServiceIcon = ({
  name,
  className = 'h-7 w-7',
}: {
  name?: string | null
  className?: string
}) => (
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
    <path d={paths[name ?? 'roof'] ?? paths.roof} />
  </svg>
)

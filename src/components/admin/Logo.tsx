/**
 * Admin login logo (paw + wordmark) — matches the site's brand.
 * Registered via admin.components.graphics.Logo in payload.config.
 */
export const Logo = () => (
  <svg
    width="260"
    height="60"
    viewBox="0 0 520 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Shaggy Dog Spa Mobile Grooming"
  >
    <g fill="#f2994a">
      <ellipse cx="52" cy="70" rx="17" ry="15" />
      <circle cx="33" cy="52" r="7" />
      <circle cx="45" cy="42" r="7" />
      <circle cx="59" cy="42" r="7" />
      <circle cx="71" cy="52" r="7" />
    </g>
    <text x="98" y="58" fontFamily="system-ui, Arial, sans-serif" fontSize="36" fontWeight="800" fill="#1c5f6b">
      SHAGGY DOG SPA
    </text>
    <text x="100" y="90" fontFamily="system-ui, Arial, sans-serif" fontSize="19" letterSpacing="6" fill="#1c5f6b" opacity="0.8">
      MOBILE GROOMING
    </text>
  </svg>
)

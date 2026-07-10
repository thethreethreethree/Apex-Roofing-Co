import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  experimental: {
    // Media uploads go through the `uploadMedia` Server Action. The default
    // Server Action body limit is 1 MB, which is smaller than a typical phone
    // photo — raise it so the owner can upload real grooming photos.
    serverActions: { bodySizeLimit: '10mb' },
  },
  async headers() {
    // Content-Security-Policy: the whole app is self-contained (media, styles,
    // fonts, and scripts all come from this origin — no CDNs, no third-party CMS),
    // so we can lock every fetch to 'self'. 'unsafe-inline' is required because
    // Next's hydration uses inline scripts/styles and we don't run a nonce; even
    // so this blocks external script/style/img/frame/connect sources and clamps
    // object-src, base-uri, frame-ancestors, and form-action.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
    ].join('; ')

    // Safe baseline security headers for every route (the custom admin uses no
    // third-party inline scripts, so these don't break it).
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
  images: {
    // Media is served from the custom backend's own /media-file/* route (local disk).
    localPatterns: [{ pathname: '/media-file/**' }],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default nextConfig

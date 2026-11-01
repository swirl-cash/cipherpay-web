import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080'}`,
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const walletCspHeader = cspHeader
  .replace("frame-ancestors 'none'", "frame-ancestors 'self'")
  .replace("script-src 'self' 'unsafe-inline'", "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'")
  .replace(/connect-src[^;]+/, "connect-src 'self' https: http://127.0.0.1:* http://localhost:*")
  + "; worker-src 'self' blob:";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    // Serve the default (English) locale at clean, unprefixed URLs.
    // These run after the filesystem check, so /_next/..., /api/...,
    // public files and the real /pt /es /ar routes are untouched.
    return [
      { source: '/', destination: '/en' },
      // api/ excluded explicitly: afterFiles rewrites do not resolve dynamic
      // API routes ([code], [jobId]) — without this they get rewritten to
      // /en/api/... and prerender-404.
      { source: '/:path((?!en$|en/|pt$|pt/|es$|es/|ar$|ar/|zh$|zh/|api$|api/).+)', destination: '/en/:path' },
    ];
  },
  async redirects() {
    // Legacy prefixed English URLs land on the clean equivalent.
    return [
      { source: '/en', destination: '/', permanent: false },
      { source: '/en/:path+', destination: '/:path+', permanent: false },
      // Roadmap page retired — send any old links home.
      { source: '/campaigns', destination: '/', permanent: false },
      { source: '/campaigns/:path+', destination: '/', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
        ],
      },
      {
        // Standalone applications may only be framed by this same origin.
        // Keep every other route protected by frame-ancestors 'none' / DENY.
        source: '/evm/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader.replace("frame-ancestors 'none'", "frame-ancestors 'self'") },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/dapp/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: walletCspHeader },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/:locale(en|pt|es|ar)/dapp/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: walletCspHeader },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/wallet/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: walletCspHeader },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        // Dedicated Web Workers also enforce the CSP on their script response.
        // Permit WebAssembly compilation there without weakening other routes.
        source: '/_next/static/chunks/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: walletCspHeader },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

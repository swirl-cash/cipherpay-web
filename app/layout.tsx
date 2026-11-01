import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://swirl.cash'),
  title: 'SWIRL — Privacy for Bitcoin & EVM',
  description:
    'Non-custodial privacy infrastructure for Bitcoin and EVM. One wallet experience, user-held keys, and privacy built into the way you transact.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'SWIRL — Privacy for Bitcoin & EVM',
    description: 'Non-custodial privacy infrastructure for Bitcoin and EVM.',
    siteName: 'SWIRL',
    type: 'website',
    images: [{ url: '/logo-dark-bg.png', width: 694, height: 694 }],
  },
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme');
      if (t !== 'light' && t !== 'dark') t = 'dark';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(t);
    } catch (e) {}
  })();
`;

const dirScript = `
  (function() {
    try {
      var m = window.location.pathname.match(/^\\/([a-z]{2})(?:\\/|$)/);
      if (m) {
        document.documentElement.lang = m[1];
        document.documentElement.dir = m[1] === 'ar' ? 'rtl' : 'ltr';
      }
    } catch (e) {}
  })();
`;

// Browser auto-translation (Google/Edge translate) rewrites text nodes
// after React has rendered. When React later updates those nodes it calls
// removeChild/insertBefore on parents that no longer own them and the whole
// app white-screens ("client-side exception"). Guard those two primitives
// so a translation-mutated DOM degrades gracefully instead of crashing.
const translatePatchScript = `
  (function() {
    try {
      if (typeof Node !== 'function' || !Node.prototype) return;
      var origRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function(child) {
        if (child && child.parentNode !== this) return child;
        return origRemoveChild.call(this, child);
      };
      var origInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function(newNode, refNode) {
        if (refNode && refNode.parentNode !== this) return newNode;
        return origInsertBefore.call(this, newNode, refNode);
      };
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: translatePatchScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: dirScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

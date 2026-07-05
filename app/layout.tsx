// Cache-bust comment: 2026-07-05-01
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/shared/QueryProvider';
import { Toaster } from 'react-hot-toast';
import { getSeoSettings, getHero } from '@/lib/supabase/queries';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoSettings();
    const hero = await getHero();
    if (!seo) throw new Error();

    return {
      title: seo.portfolio_title,
      description: seo.meta_description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.og_title ?? seo.portfolio_title,
        description: seo.og_description ?? seo.meta_description,
        images: seo.og_image_url ? [{ url: seo.og_image_url }] : [],
      },
      twitter: {
        images: seo.twitter_image_url ? [seo.twitter_image_url] : [],
      },
      icons: {
        icon: seo.favicon_url ?? hero?.photo_url ?? '/favicon.ico',
      },
    };
  } catch {
    return {
      title: 'Developer Portfolio',
      description: 'Welcome to my professional portfolio built with Next.js & Supabase.',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  if (registrations.length > 0) {
                    Promise.all(registrations.map(function(r) { return r.unregister(); })).then(function() {
                      window.location.reload();
                    });
                  }
                });
              }
            `
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <QueryProvider>
          {children}
          {/* Custom style Toast notification portal */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}

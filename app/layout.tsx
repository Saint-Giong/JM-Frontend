import { ThemeProvider } from '@saint-giong/bamboo-ui/client';
import { AuthProvider, QueryProvider } from '@/providers';
import '@saint-giong/bamboo-ui/globals.css';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Familjen_Grotesk } from 'next/font/google';
import './globals.css';

const familjenGrotesk = Familjen_Grotesk({
  subsets: ['latin'],
  variable: '--font-familjen',
});

export const metadata: Metadata = {
  title: {
    default: 'DEVision Job Manager',
    template: '%s | DEVision',
  },
  description:
    'Streamline your recruitment process with DEVision Job Manager - post jobs, track applicants, and hire the best talent.',
  keywords: [
    'job manager',
    'recruitment',
    'hiring',
    'applicant tracking',
    'DEVision',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${familjenGrotesk.variable} h-screen overflow-y-auto overflow-x-hidden font-sans antialiased`}
        style={{ fontFamily: 'var(--font-familjen)' }}
      >
        <Analytics />
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

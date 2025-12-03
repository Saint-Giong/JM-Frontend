import { ThemeProvider } from '@/components/providers/theme-provider';
import '@saint-giong/bamboo-ui/globals.css';
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
        className={`${familjenGrotesk.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-familjen)' }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

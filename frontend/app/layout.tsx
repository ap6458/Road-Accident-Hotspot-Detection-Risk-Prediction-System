import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NHAI Road Intelligence | AI Hotspot Dashboard',
  description: 'AI-powered road accident hotspot detection and risk prediction system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}

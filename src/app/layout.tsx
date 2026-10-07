import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'DesignFlow AI — AI-Assisted Product-Design Toolkit',
  description:
    'Turn product requirements into structured UX artifacts: user flows, heuristic audits, user stories, research questions, and usability testing plans.',
  keywords: [
    'DesignFlow AI',
    'Product Design',
    'UX Design',
    'User Flows',
    'UX Audit',
    'User Stories',
    'Gherkin',
    'Nielsen Norman Heuristics',
    'WCAG 2.2',
    'FinTech UX',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-teal-500/30 selection:text-teal-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

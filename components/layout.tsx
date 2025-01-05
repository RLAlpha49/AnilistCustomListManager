import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="py-6 px-4 bg-gray-800" role="banner">
        <h1 className="text-2xl font-bold">Anilist Custom List Manager</h1>
      </header>
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8" role="main">
        {children}
      </main>
      <footer className="py-4 px-4 bg-gray-800 text-center" role="contentinfo">
        <p>&copy; {new Date().getFullYear()} Anilist Custom List Manager</p>
      </footer>
    </div>
  );
}
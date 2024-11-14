"use client"; // Mark this file as a client component

import './styles/globals.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import NetworkStatus from './components/NetworkStatus';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head />
      <body className="min-h-screen flex flex-col">
        {/* Add padding-top to prevent the content from being hidden under the fixed navbar */}
        <NetworkStatus />
        <Navbar />
        <main className="flex-grow pt-20"> {/* Adjust padding-top to fit fixed navbar */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

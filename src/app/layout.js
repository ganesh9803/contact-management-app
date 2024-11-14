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
      <body className="min-h-screen flex flex-col pt-20"> {/* Add padding-top to move content below the fixed navbar */}
        <NetworkStatus />
        {pathname !== '/' && <Navbar />}
        <main className="flex-grow">{children}</main> {/* Ensures main content area grows and pushes footer down */}
        <Footer />
      </body>
    </html>
  );
}

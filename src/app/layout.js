// /src/app/layout.js
"use client"; // Mark this file as a client component

import './styles/globals.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head />
      <body>
        {/* Conditionally render Navbar based on pathname */}
        {pathname !== '/' && <Navbar />}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

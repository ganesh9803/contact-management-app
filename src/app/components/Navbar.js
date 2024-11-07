"use client"; // Add this line to mark the component as a client compone

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Use usePathname from next/navigation

export default function Navbar() {
  const pathname = usePathname(); // Get the current pathname
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to handle mobile menu toggle

  // Effect to handle the visibility of the hamburger menu based on the active route
  useEffect(() => {
    // Hide the hamburger menu if the route is either /dashboard, /profile, or /contactList
    if (pathname === '/dashboard' || pathname === '/profile' || pathname === '/contactList') {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to login page after logout
  };

  return (
    <nav className="bg-gray-800 p-4 mb-2">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link href="/dashboard" className="text-white text-xl font-bold hover:text-gray-300">
          Contact Management System
        </Link>

        {/* Hamburger Menu Icon for Mobile */}
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Links (Hidden on Mobile by default, shown in a menu) */}
        <div className={`md:flex md:items-center md:space-x-4 ${isMenuOpen ? "block" : "hidden"}`}>
          <Link
            href="/dashboard"
            className={`block mt-4 md:mt-0 text-white hover:text-gray-300 ${pathname === '/dashboard' ? 'text-gray-300' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className={`block mt-4 md:mt-0 text-white hover:text-gray-300 ${pathname === '/profile' ? 'text-gray-300' : ''}`}
          >
            Profile
          </Link>
          <Link
            href="/contactList"
            className={`block mt-4 md:mt-0 text-white hover:text-gray-300 ${pathname === '/contactList' ? 'text-gray-300' : ''}`}
          >
            Contact List
          </Link>
          <button
            onClick={handleLogout}
            className="block mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

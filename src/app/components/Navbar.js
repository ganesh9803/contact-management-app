"use client"; // Mark this file as a client component

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HiMenu, HiArrowLeft, HiHome, HiUser, HiTrash, HiViewList, HiLogout } from 'react-icons/hi'; // Importing React Icons

export default function Navbar() {
  const [visible, setVisible] = useState(false); // State to manage mobile menu visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To check if user is logged in
  const pathname = usePathname();
  const router = useRouter(); // To handle programmatic navigation

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/'); // Redirect to login page after logout
  };

  // Check if the user has a valid token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // If token exists, the user is logged in
    } else {
      // If no token, redirect to login page (or homepage)
      if (pathname !== '/') {
        router.push('/');
      }
    }
  }, [pathname, router]); // This will run when the pathname changes

  return (
    <div className="bg-gray-800 flex items-center justify-between py-5 font-medium fixed top-0 left-0 w-full z-50" style={{ height: '80px' }}>
      {/* Logo */}
      <Link href='/dashboard'>
        <h1 className='p-2 w-35 text-2xl text-white'>Contact Management</h1>
      </Link>

      {/* Desktop Menu */}
      {isLoggedIn && (
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
          <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-white' : ''}`}>
            <HiHome className="w-5 h-5" />
            <p>Dashboard</p>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname === '/profile' ? 'text-white' : ''}`}>
            <HiUser className="w-5 h-5" />
            <p>Profile</p>
          </Link>
          <Link href="/contact-list" className={`flex flex-col items-center gap-1 ${pathname === '/contact-list' ? 'text-white' : ''}`}>
            <HiViewList className="w-5 h-5" />
            <p>Contact List</p>
          </Link>

          <Link href="/trash" className={`flex flex-col items-center gap-1 ${pathname === '/trash' ? 'text-white' : ''}`}>
            <HiTrash className="w-5 h-5" />
            <p>Trash</p>
          </Link>
          {/* Logout Button */}
          <div onClick={handleLogout} className={`flex flex-col items-center gap-1 cursor-pointer hover:text-red-600 ${pathname === '/' ? 'text-white' : ''}`}>
            <HiLogout className="w-5 h-5" />
            <p>Logout</p>
          </div>
        </ul>
      )}

      {/* Profile Icon & Hamburger Menu for Mobile */}
      <div className='flex items-center gap-6'>
        {/* Hamburger Menu Icon */}
        <HiMenu onClick={() => setVisible(true)} className='w-6 h-6 text-white cursor-pointer sm:hidden' />
      </div>

      {/* Sidebar for Mobile */}
      <div className={`fixed top-0 right-0 bottom-0 bg-gray-800 text-white transition-all duration-300 ${visible ? 'w-64' : 'w-0'} sm:hidden overflow-hidden`}>
        <div className="flex flex-col">
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <HiArrowLeft className='h-5 w-5' />
            <p>Back</p>
          </div>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/dashboard'>
            <HiHome className="w-5 h-5" />
            Dashboard
          </Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/profile'>
            <HiUser className="w-5 h-5" />
            Profile
          </Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/contact-list'>
            <HiViewList className="w-5 h-5" />
            Contact List
          </Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/trash'>
            <HiTrash className="w-5 h-5" />
            Trash
          </Link>
          {/* Logout Link for Mobile */}
          <div onClick={() => { handleLogout(); setVisible(false); }} className='py-2 pl-6 border-t border-gray-600 cursor-pointer'>
            <HiLogout className="w-5 h-5" />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

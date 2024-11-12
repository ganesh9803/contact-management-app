"use client"; // Mark this component as a client component

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HiMenu, HiArrowLeft } from 'react-icons/hi';

export default function Navbar() {
  const [visible, setVisible] = useState(false); // State to manage mobile menu visibility
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to login page after logout
  };

  return (
    <div className="bg-gray-800 flex items-center justify-between py-5 font-medium">
      {/* Logo */}
      <Link href='/'>
        <h1 className='p-2 w-35 text-2xl text-white'>Contact Management</h1>
      </Link>

      {/* Desktop Menu */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-white' : ''}`}>
          <p>Dashboard</p>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname === '/profile' ? 'text-white' : ''}`}>
          <p>Profile</p>
        </Link>
        <Link href="/contact-list" className={`flex flex-col items-center gap-1 ${pathname === '/contact-list' ? 'text-white' : ''}`}>
          <p>Contact List</p>
        </Link>
        <p onClick={handleLogout} className={`flex flex-col items-center gap-1 cursor-pointer hover:text-red-600 ${pathname === '/' ? 'text-white' : ''}`} >Logout</p>
      </ul>

      {/* Profile Icon & Hamburger Menu for Mobile */}
      <div className='flex items-center gap-6'>
        {/* Hamburger Menu Icon */}
        <HiMenu onClick={() => setVisible(true)} className='w-6 h-6 text-white cursor-pointer sm:hidden' />
      </div>

      {/* Sidebar for Mobile */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ${visible ? 'w-full' : 'w-0'} sm:hidden`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <HiArrowLeft className='h-5 w-5' />
            <p>Back</p>
          </div>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border' href='/dashboard'>Dashboard</Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border' href='/profile'>Profile</Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border' href='/contact-list'>Contact List</Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border' href='/'>Logout</Link>
        </div>
      </div>
    </div>
  );
}

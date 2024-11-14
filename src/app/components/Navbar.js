"use client"; // Mark this component as a client component

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HiMenu, HiArrowLeft } from 'react-icons/hi';
import { AiOutlineDownload, AiOutlineUpload } from 'react-icons/ai'; // Add icons for upload and download

export default function Navbar() {
  const [visible, setVisible] = useState(false); // State to manage mobile menu visibility
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to login page after logout
  };

  return (
    <div className="bg-gray-800 flex items-center justify-between py-5 font-medium fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <Link href='/dashboard'>
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

        <Link href="/trash" className={`flex flex-col items-center gap-1 ${pathname === '/trash' ? 'text-white' : ''}`}>
          <p>Trash</p>
        </Link>
        {/* Logout Button */}
        <p onClick={handleLogout} className={`flex flex-col items-center gap-1 cursor-pointer hover:text-red-600 ${pathname === '/' ? 'text-white' : ''}`} >Logout</p>
      </ul>

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
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/dashboard'>Dashboard</Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/profile'>Profile</Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/contact-list'>Contact List</Link>
          <Link onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-gray-600' href='/trash'>Trash</Link>
          {/* Logout Link for Mobile */}
          <p onClick={() => { handleLogout(); setVisible(false); }} className='py-2 pl-6 border-t border-gray-600 cursor-pointer'>Logout</p>
        </div>
      </div>
    </div>
  );
}

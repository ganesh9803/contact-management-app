'use client'; // Mark the file as a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard'); // Redirect to dashboard if token exists
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      if (err.response?.data?.message === 'Invalid username') {
        setErrorMessage('Invalid username');
      } else if (err.response?.data?.message === 'Invalid password') {
        setErrorMessage('Invalid password');
      } else {
        setErrorMessage('Login failed');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage('Please enter a strong password with at least 6 characters');
      return;
    }
    setErrorMessage('');
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setIsLogin(true);
      router.push('/dashboard');
    } catch (err) {
      setErrorMessage('Registration failed');
      console.error(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4 md:px-0">
      <div className="w-full max-w-sm sm:max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Contacts Management System
        </h1>
        <p className="text-lg text-center mb-8">
          {isLogin ? 'Login to manage your contacts' : 'Create a new account to get started'}
        </p>
        
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-gray-800"
          onSubmit={isLogin ? handleLogin : handleRegister}
        >
          {!isLogin && (
            <input
              className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          )}
          <input
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {errorMessage && (
            <p className="text-red-600 text-sm md:text-base mb-4">{errorMessage}</p>
          )}
          <button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            type="submit"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="text-center">
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

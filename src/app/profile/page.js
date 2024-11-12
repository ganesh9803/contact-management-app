// src/pages/profile.js
"use client"; // Mark this as a client-side component

import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl sm:text-2xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-xl sm:text-2xl">
        No user data available.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Profile</h1>
        <div className="bg-gray-50 p-4 rounded-md shadow space-y-3 text-center sm:text-left">
          <p className="text-lg sm:text-xl">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-lg sm:text-xl">
            <strong>Email:</strong> {user.email}
          </p>
          {/* Additional user details can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Profile;

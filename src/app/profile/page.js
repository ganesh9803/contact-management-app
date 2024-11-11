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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">No user data available.</div>;
  }

  return (
    <div>
      <div className="max-w-3xl lg:max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mt-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center lg:text-left">Profile</h1>
        <div className="bg-gray-50 p-4 rounded shadow-md space-y-3 text-center lg:text-left">
          <p className="text-lg sm:text-xl"><strong>Name:</strong> {user.name}</p>
          <p className="text-lg sm:text-xl"><strong>Email:</strong> {user.email}</p>
          {/* Add more user details as necessary */}
        </div>
      </div>
    </div>
  );
};

export default Profile;

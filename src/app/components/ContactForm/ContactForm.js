"use client";

import { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    timezone: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add contacts.');
      return;
    }

    try {
      await axios.post(
        '/api/contact-list',
        [contact], // Send the contact as an array
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContact({ name: '', email: '', phone: '', address: '', timezone: '' });
      setSuccessMessage('Contact added successfully!');
    } catch (error) {
      console.error('Failed to add contact:', error.response?.data || error.message);

      if (error.response) {
        if (error.response.data?.error === 'Email already exists. Please use a different email.') {
          setError('Email already exists. Please use a different email.');
        } else {
          setError(error.response.data?.error || 'Failed to add contact');
        }
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-black">Add New Contact</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone:</label>
          <input
            type="text"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700">Address:</label>
          <input
            type="text"
            name="address"
            value={contact.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700">Timezone:</label>
          <input
            type="text"
            name="timezone"
            value={contact.timezone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Contact
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineLoading } from 'react-icons/ai'; // Import the loading icon from react-icons

const Trash = () => {
  const [trashContacts, setTrashContacts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Number of items per page
  const [actionMessage, setActionMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    fetchTrashContacts();
  }, []);

  const fetchTrashContacts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    setLoading(true); // Set loading to true before fetching data

    try {
      const response = await axios.get('/api/trash-bin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrashContacts(response.data);
    } catch (error) {
      setError('Failed to fetch trashed contacts');
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    try {
      const response = await axios.put(
        '/api/trash-bin',
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setActionMessage('Contact restored');
        fetchTrashContacts();
      }
    } catch (error) {
      setError('Failed to restore contact');
    }
  };

  const handlePermanentDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    try {
      const response = await axios.delete('/api/trash-bin', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      if (response.status === 200) {
        setActionMessage('Deleted contact');
        fetchTrashContacts();
      }
    } catch (error) {
      setError('Failed to permanently delete contact');
    }
  };

  const totalPages = Math.ceil(trashContacts.length / pageSize);
  const currentContacts = trashContacts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Clear action message after 3 seconds
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-8 bg-white shadow-md rounded-lg">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-800">Trash Bin</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {actionMessage && <p className="text-green-500 mb-4 text-center">{actionMessage}</p>}

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center space-x-2 py-4">
          <AiOutlineLoading className="animate-spin text-blue-500 w-8 h-8" />
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {currentContacts.map((contact) => (
            <li
              key={contact.id}
              className="p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow"
            >
              <div className="mb-2 sm:mb-0">
                <p className="text-lg font-medium text-gray-700">{contact.name}</p>
                <p className="text-gray-500">{contact.email}</p>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleRestore(contact.id)}
                  className="px-3 py-2 text-sm sm:text-base bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(contact.id)}
                  className="px-3 py-2 text-sm sm:text-base bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {trashContacts.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-6">No contacts in the Trash Bin</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Trash;

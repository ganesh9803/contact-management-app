"use client"; // Mark this as a client-side component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineLoading } from 'react-icons/ai'; // Import the spinner icon

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true); // Set loading to true when starting to fetch data
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            setLoading(false); // Stop loading if no token
            return;
        }

        try {
            const response = await axios.get('/api/contact-list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setContacts(response.data);
        } catch (error) {
            setError(error.message || 'Failed to fetch contacts');
        } finally {
            setLoading(false); // Stop loading after fetch completes
        }
    };

    const handleEdit = (contact) => {
        setSelectedContact(contact);
        setEditMode(true);
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        try {
            const response = await axios.put(`/api/contact-list`, [selectedContact], {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                await fetchContacts();
                setEditMode(false);
                setSelectedContact(null);
            }
        } catch (error) {
            setError(error.message || 'Failed to update contact');
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }
      
        try {
            const response = await axios.delete('/api/contact-list', {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                data: { id },
            });
            if (response.status === 200) fetchContacts();
        } catch (error) {
            setError('Failed to move contact to trash');
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastContact = currentPage * itemsPerPage;
    const indexOfFirstContact = indexOfLastContact - itemsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const closeEditMode = () => {
        setEditMode(false);
        setSelectedContact(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
                <h1 className="text-2xl font-bold my-4 text-center sm:text-left">Contact List</h1>
                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 my-2 w-full rounded"
                />
                
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <AiOutlineLoading className="animate-spin text-blue-500" size={24} />
                            <p className="ml-2 text-gray-500">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {filteredContacts.length === 0 ? (
                                <p className="text-center text-gray-500 mt-6">No contacts available</p>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-300 mt-4">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-2 text-center text-sm md:text-base">Name</th>
                                            <th className="border-b p-2 text-center text-sm md:text-base">Email</th>
                                            <th className="border-b p-2 text-center text-sm md:text-base">Phone</th>
                                            <th className="border-b p-2 text-center text-sm md:text-base">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentContacts.map(contact => (
                                            <tr key={contact.id}>
                                                <td className="border-b p-2 text-center text-sm">{contact.name}</td>
                                                <td className="border-b p-2 text-center text-sm">{contact.email}</td>
                                                <td className="border-b p-2 text-center text-sm">{contact.phone}</td>
                                                <td className="border-b p-2 text-center">
                                                    <button
                                                        onClick={() => handleEdit(contact)}
                                                        className="text-blue-500 hover:underline text-sm md:text-base"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(contact.id)}
                                                        className="text-red-500 hover:underline ml-4 text-sm md:text-base"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>

                {editMode && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-center sm:text-left">Edit Contact</h2>
                        <input
                            type="text"
                            value={selectedContact.name}
                            onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                            placeholder="Name"
                            className="border p-2 my-2 w-full rounded"
                        />
                        <input
                            type="email"
                            value={selectedContact.email}
                            onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
                            placeholder="Email"
                            className="border p-2 my-2 w-full rounded"
                        />
                        <input
                            type="text"
                            value={selectedContact.phone}
                            onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                            placeholder="Phone"
                            className="border p-2 my-2 w-full rounded"
                        />
                        <div className="flex space-x-4 mt-4">
                            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Update
                            </button>
                            <button onClick={closeEditMode} className="bg-gray-500 text-white px-4 py-2 rounded">
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactList;

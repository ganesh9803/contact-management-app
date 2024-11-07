"use client"; // Mark this as a client-side component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 5; // Number of items to display per page

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        try {
            const response = await axios.get('/api/contacts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setContacts(response.data);
        } catch (error) {
            setError(error.message || 'Failed to fetch contacts');
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
            const response = await axios.put(`/api/contacts`, [selectedContact], {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            const response = await axios.delete(`/api/contacts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { id },
            });

            if (response.status === 200) {
                await fetchContacts();
            }
        } catch (error) {
            setError(error.message || 'Failed to delete contact');
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
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
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
                <h1 className="text-2xl font-bold my-4">Contact List</h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 my-2 w-full rounded"
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
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
                                        <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:underline text-sm md:text-base">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:underline ml-4 text-sm md:text-base">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {editMode && (
                    <div>
                        <h2 className="text-xl font-semibold mt-4">Edit Contact</h2>
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
                        <div className="flex space-x-4 mt-2">
                            <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 my-2 rounded">
                                Update
                            </button>
                            <button onClick={closeEditMode} className="bg-gray-500 text-white p-2 my-2 rounded">
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`mx-1 px-2 py-1 md:px-4 md:py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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

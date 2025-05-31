import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Anavbar from './Anavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDetails = () => setShowDetails(!showDetails);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((response) => setUsers(response.data))
      .catch(() => toast.error('Failed to fetch users.'));
  }, []);

  const deleteData = (userId) => {
    axios.delete(`http://localhost:5000/userdelete/${userId}`)
      .then(() => {
        toast.success('User deleted successfully.');
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(() => toast.error('Failed to delete user.'));
  };

  const fetchUserSurveyForms = (userId) => {
    axios.get(`http://localhost:5000/mysurveyforms/${userId}`)
      .then((response) => {
        setItems(response.data);
        toggleDetails();
      })
      .catch(() => toast.error('Error fetching survey forms.'));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Anavbar />
      <div className="container mx-auto p-6 mt-20 max-w-6xl bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">User Management</h1>

        {/* Search Box */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full md:w-1/2 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left">Sl/No</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left">User ID</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left">Name</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left">Email</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{user._id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Link to={`/useredit/${user._id}`} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </Link>
                    <button onClick={() => deleteData(user._id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => fetchUserSurveyForms(user._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center px-4 py-4 text-gray-500">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Survey Forms Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60" onClick={toggleDetails}></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg z-10 max-h-[80vh] w-[90%] md:w-[60%] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-4 text-blue-600 dark:text-blue-300">
              User Survey Forms
            </h2>
            {items.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">No forms available.</p>
            ) : (
              items.map((item, index) => (
                <div key={item._id} className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow">
                  <p>
                    {index + 1}) <span className="font-bold">Title:</span> {item.title}
                  </p>
                  <p>
                    <span className="font-bold">Responses:</span> {item.responses.length}
                  </p>
                </div>
              ))
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={toggleDetails}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Users;

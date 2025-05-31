import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Anavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/ahome" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition">
          SurveyMaster Admin
        </Link>

        <div className="flex items-center gap-6 text-sm sm:text-base">
          <Link
            to="/ahome"
            className="hover:text-gray-300 transition duration-150 ease-in-out"
          >
            Dashboard
          </Link>
          <Link
            to="/users"
            className="hover:text-gray-300 transition duration-150 ease-in-out"
          >
            Users
          </Link>
          <Link
            to="/surveyforms"
            className="hover:text-gray-300 transition duration-150 ease-in-out"
          >
            Survey Forms
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Anavbar;

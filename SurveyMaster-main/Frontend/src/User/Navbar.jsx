import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const name = user?.name || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-indigo-200 transition">
          SurveyMaster
        </Link>

        <div className="flex items-center gap-6 text-sm sm:text-base">
          <Link
            to="/createsurvey"
            className="hover:text-indigo-200 transition duration-150 ease-in-out"
          >
            Create Survey
          </Link>
          <Link
            to="/mysurveyforms"
            className="hover:text-indigo-200 transition duration-150 ease-in-out"
          >
            My Surveys
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white font-medium transition"
          >
            Logout
          </button>
          <span className="hidden sm:inline-block bg-white text-indigo-700 font-semibold px-3 py-1 rounded shadow-sm">
            {name}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

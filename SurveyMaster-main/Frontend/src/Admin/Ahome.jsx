import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import Anavbar from './Anavbar';

function Ahome() {
  const [users, setUsers] = useState([]);
  const [surveyForms, setSurveyForms] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [formCount, setFormCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));

    axios.get('http://localhost:5000/surveyforms')
      .then((response) => setSurveyForms(response.data))
      .catch((error) => console.error('Error fetching surveys:', error));
  }, []);

  const totalUsers = users.length;
  const totalSurveyForms = surveyForms.length;

  useEffect(() => {
    animateCount(totalUsers, setUserCount);
    animateCount(totalSurveyForms, setFormCount);
  }, [totalUsers, totalSurveyForms]);

  const animateCount = (end, setter) => {
    let start = 0;
    const duration = 1000;
    const increment = end / (duration / 20);
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        setter(end);
        clearInterval(interval);
      } else {
        setter(Math.floor(start));
      }
    }, 20);
  };

  const data = [
    { name: 'Users', value: totalUsers, fill: '#7e22ce' },
    { name: 'Survey Forms', value: totalSurveyForms, fill: '#0e7490' },
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">
        <Anavbar />

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <Link to="/users" className="bg-purple-600 dark:bg-purple-800 text-white p-6 rounded-xl shadow-md text-center hover:bg-purple-700 transition">
              <p className="text-2xl mb-2 font-medium">Total Users</p>
              <p className="text-5xl font-bold">{userCount}</p>
            </Link>

            <Link to="/surveyforms" className="bg-cyan-700 dark:bg-cyan-900 text-white p-6 rounded-xl shadow-md text-center hover:bg-cyan-800 transition">
              <p className="text-2xl mb-2 font-medium">Survey Forms</p>
              <p className="text-5xl font-bold">{formCount}</p>
            </Link>
          </div>

          {/* Chart */}
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl font-semibold text-center mb-6">Survey Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" tick={{ fill: darkMode ? '#e5e7eb' : '#374151' }} />
                <YAxis tick={{ fill: darkMode ? '#e5e7eb' : '#374151' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: darkMode ? '#374151' : '#ffffff', borderRadius: '6px' }}
                  labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                />
                <Legend wrapperStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }} />
                <Bar dataKey="value" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Surveys */}
          <div className={`mt-10 rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl font-semibold mb-4">Recent Survey Forms</h2>
            {surveyForms.length === 0 ? (
              <p>No surveys found.</p>
            ) : (
              <ul className="divide-y divide-gray-300 dark:divide-gray-600">
                {surveyForms.slice(-3).reverse().map((form) => (
                  <li key={form._id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{form.title}</p>
                      <p className="text-sm text-gray-500">By {form.userName}</p>
                    </div>
                    <Link to={`/adminresponses/${form._id}`} className="text-indigo-500 hover:underline">
                      View Responses
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ahome;

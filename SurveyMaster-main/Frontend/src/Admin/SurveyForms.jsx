import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import Anavbar from './Anavbar';
import { FaExternalLinkAlt, FaLink, FaClipboard } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const colors = [
  'from-pink-500 to-purple-500',
  'from-green-400 to-blue-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-500 to-blue-600',
  'from-teal-400 to-cyan-500',
  'from-red-500 to-rose-500'
];

const SurveyForms = () => {
  const [surveyForms, setSurveyForms] = useState([]);

  useEffect(() => {
    const fetchSurveyForms = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/surveyforms`);
        setSurveyForms(response.data);
      } catch (error) {
        console.error('Error fetching survey forms:', error);
        toast.error('Failed to fetch survey forms.');
      }
    };

    fetchSurveyForms();
  }, []);

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition duration-300">
      <Anavbar />
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <h2 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-500">
          🌟 All Survey Forms 🌟
        </h2>

        {surveyForms.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300 text-lg">No survey forms found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {surveyForms.map((surveyForm, index) => (
              <div
                key={surveyForm._id}
                className={`p-6 rounded-xl shadow-2xl text-white transition transform hover:scale-105 bg-gradient-to-br ${colors[index % colors.length]}`}
              >
                <h3 className="text-xl font-bold mb-2">
                  👤 Owner: <span className="font-medium">{surveyForm.userName}</span>
                </h3>
                <h4 className="text-lg font-semibold mb-4">
                  📝 Survey Title: <span className="italic">{surveyForm.title}</span>
                </h4>

                <div className="mb-4 bg-white bg-opacity-20 p-3 rounded-md">
                  <p className="font-semibold text-sm mb-2">📋 Questions:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    {surveyForm.questions.map((q, idx) => (
                      <li key={idx}>{q.question}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Link
                    to={`/adminresponses/${surveyForm._id}`}
                    className="hover:underline flex items-center gap-1 text-white font-semibold"
                  >
                    <FaExternalLinkAlt />
                    View Responses
                  </Link>

                  <div className="flex items-center gap-3">
                    <a
                      href={`http://localhost:5173/respond/${surveyForm._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-white font-semibold"
                    >
                      <FaLink />
                      Respond
                    </a>
                    <button
                      onClick={() =>
                        copyToClipboard(`http://localhost:5173/respond/${surveyForm._id}`)
                      }
                      title="Copy Link"
                      className="hover:text-yellow-300 transition"
                    >
                      <FaClipboard />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
    </div>
  );
};

export default SurveyForms;

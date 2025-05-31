import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt, FaExternalLinkAlt, FaLink } from 'react-icons/fa';

const MyForms = () => {
  const [surveyForms, setSurveyForms] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      const fetchSurveyForms = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/mysurveyforms/${user.id}`);
          setSurveyForms(response.data);
        } catch (error) {
          console.error('Error fetching survey forms:', error);
        }
      };

      fetchSurveyForms();
    }
  }, []);

  const deleteForm = (id) => {
    axios.delete(`http://localhost:5000/deletesurveyform/${id}`)
      .then(() => {
        toast.success('Survey form deleted successfully');
        setSurveyForms(prev => prev.filter(form => form._id !== id));
      })
      .catch(() => {
        toast.error('Failed to delete survey form');
      });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
          📋 My Survey Forms
        </h2>

        {surveyForms.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No survey forms found.</div>
        ) : (
          <div className="space-y-6">
            {surveyForms.map((surveyForm) => (
              <div key={surveyForm._id} className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    📝 {surveyForm.title}
                  </h3>
                  <button
                    onClick={() => deleteForm(surveyForm._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete Survey"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-600 mb-2">Questions:</h4>
                  <ul className="list-decimal list-inside text-gray-700 space-y-1">
                    {surveyForm.questions.map((question, index) => (
                      <li key={index}>{question.question}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-between items-center flex-wrap gap-2">
                  <Link
                    to={`/responses/${surveyForm._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    title="View Responses"
                  >
                    <FaExternalLinkAlt />
                    View Responses
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-blue-700 mt-2">
                    <FaLink />
                    <a
                      href={`http://localhost:5173/respond/${surveyForm._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline break-all"
                    >
                      http://localhost:5173/respond/{surveyForm._id}
                    </a>
                    <button
                      onClick={() => copyToClipboard(`http://localhost:5173/respond/${surveyForm._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </div>
  );
};

export default MyForms;

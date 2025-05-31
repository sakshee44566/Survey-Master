import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Anavbar from './Anavbar';
import { FaTrash, FaUserCircle, FaPoll, FaChartBar } from 'react-icons/fa';

const AdminResponses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const surveyResponse = await axios.get(`http://localhost:5000/api/surveys/${id}`);
        setSurvey(surveyResponse.data);
      } catch (error) {
        console.error('Error fetching survey:', error);
        toast.error('Failed to load survey');
      }
    };

    const fetchResponses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/surveys/results/${id}`);
        setResponses(response.data);
      } catch (error) {
        console.error('Error fetching responses:', error);
        toast.error('Failed to load responses');
      }
    };

    fetchSurvey();
    fetchResponses();
  }, [id]);

  const deleteResponse = (responseId) => {
    axios
      .delete(`http://localhost:5000/responses/${responseId}`)
      .then(() => {
        setResponses((prev) => prev.filter((res) => res._id !== responseId));
        toast.success('Response deleted successfully');
      })
      .catch(() => {
        toast.error('Failed to delete response');
      });
  };

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Anavbar />
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <h2 className="text-4xl font-bold text-center mb-4 text-blue-700 dark:text-blue-300">
          <FaPoll className="inline mr-2 text-indigo-500" />
          {survey.title}
        </h2>

        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Total Responses: 
            <span className="ml-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full">
              {responses.length}
            </span>
          </p>
        </div>

        {responses.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No responses yet.</p>
        ) : (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                    <FaUserCircle />
                    Response #{index + 1}
                  </h3>
                  <button
                    onClick={() => deleteResponse(response._id)}
                    className="bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-600 dark:text-red-200 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium"
                    title="Delete Response"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>

                <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 italic">
                  Respondent: <strong>{response.respondent}</strong>
                </p>

                <div className="space-y-3">
                  {response.answers.map((answer, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-md shadow-sm"
                    >
                      <p className="font-semibold text-sm text-indigo-700 dark:text-indigo-300 mb-1">
                        Q{idx + 1}: {answer.question}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        <span className="font-medium text-green-600 dark:text-green-300">Answer:</span>{' '}
                        {answer.answer}
                      </p>
                    </div>
                  ))}
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

export default AdminResponses;

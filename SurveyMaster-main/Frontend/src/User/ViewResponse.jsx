import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt, FaUserCircle } from 'react-icons/fa';

const ViewResponse = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/surveys/${id}`);
        setSurvey(res.data);
      } catch (error) {
        toast.error('Failed to fetch survey');
      }
    };

    const fetchResponses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/surveys/results/${id}`);
        setResponses(res.data);
      } catch (error) {
        toast.error('Failed to fetch responses');
      }
    };

    fetchSurvey();
    fetchResponses();
  }, [id]);

  const deleteResponse = (responseId) => {
    axios
      .delete(`http://localhost:5000/responses/${responseId}`)
      .then(() => {
        setResponses((prev) => prev.filter((r) => r._id !== responseId));
        toast.success('Response deleted');
      })
      .catch(() => toast.error('Failed to delete'));
  };

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-lg text-gray-600">
        Loading survey details...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen pb-12">
      <Navbar />
      <div className="flex justify-center pt-16 px-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white shadow-xl rounded-2xl p-8 border-t-8 border-green-500 animate-fade-in">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-500 text-transparent bg-clip-text mb-10">
              Survey Responses: {survey.title}
            </h2>

            {responses.length > 0 ? (
              <div className="space-y-8">
                {responses.map((response, index) => (
                  <div
                    key={response._id}
                    className="bg-gray-50 border border-gray-300 rounded-xl shadow-sm p-6 hover:shadow-md transition duration-200"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xl font-semibold text-gray-800">
                        📝 Response {index + 1}
                      </h3>
                      <button
                        onClick={() => deleteResponse(response._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                      >
                        <FaTrashAlt />
                        Delete
                      </button>
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                      <FaUserCircle size={24} className="text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Respondent:</p>
                        <p className="text-lg font-medium text-gray-800">{response.respondent}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {response.answers.map((ans, i) => (
                        <div
                          key={i}
                          className="bg-white border-l-4 border-green-500 p-4 rounded-lg shadow-sm"
                        >
                          <p className="font-semibold text-gray-700">
                            Q{i + 1}: {ans.question}
                          </p>
                          <p className="text-gray-600 mt-1">
                            Answer: <span className="text-gray-800 font-medium">{ans.answer}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">
                No responses submitted yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
    </div>
  );
};

export default ViewResponse;

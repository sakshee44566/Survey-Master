import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const CreateSurvey = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
    const [surveyId, setSurveyId] = useState('');

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].question = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = event.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: [''] }]);
    };

    const removeQuestion = (qIndex) => {
        const updatedQuestions = questions.filter((_, i) => i !== qIndex);
        setQuestions(updatedQuestions);
    };

    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const { id: userId, name: userName } = user || {};

        try {
            const res = await axios.post('http://localhost:5000/api/surveys/create', {
                title,
                questions,
                userId,
                userName,
            });
            setTitle('');
            setQuestions([{ question: '', options: [''] }]);
            setSurveyId(res.data.surveyId);
            toast.success("Survey created successfully!");
        } catch (err) {
            toast.error("Failed to create the survey.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <Navbar />
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
                    <h2 className="text-4xl font-bold text-center text-purple-600 mb-8">📝 Create a New Survey</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Survey Title */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Survey Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Customer Satisfaction Survey"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                                required
                            />
                        </div>

                        {/* Questions */}
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-5 bg-gray-50 border rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-md font-semibold text-purple-700">Question {qIndex + 1}</h3>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            title="Remove this question"
                                            className="text-red-500 hover:text-red-700 transition text-sm"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                    placeholder="Enter your question..."
                                    className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 transition"
                                    required
                                />

                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center mb-2 gap-3">
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className="w-full p-2 border rounded-md border-gray-300 focus:ring-1 focus:ring-blue-300 transition"
                                            required
                                        />
                                        {q.options.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(qIndex, oIndex)}
                                                title="Remove this option"
                                                className="text-sm text-red-500 hover:text-red-700 transition"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addOption(qIndex)}
                                    className="mt-2 px-3 py-1 text-sm flex items-center gap-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    <FiPlus /> Add Option
                                </button>
                            </div>
                        ))}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center justify-center gap-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                <FiPlus /> Add Question
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                            >
                                Create Survey
                            </button>
                        </div>
                    </form>

                    {/* Success message */}
                    {surveyId && (
                        <div className="mt-8 bg-green-100 p-4 rounded-lg border border-green-300">
                            <p className="text-green-700 font-medium mb-1">✅ Survey Created!</p>
                            <p className="text-sm text-gray-700 mb-1">Share this link to collect responses:</p>
                            <a
                                href={`http://localhost:5173/respond/${surveyId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline break-all"
                            >
                                http://localhost:5173/respond/{surveyId}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
            />
        </div>
    );
};

export default CreateSurvey;

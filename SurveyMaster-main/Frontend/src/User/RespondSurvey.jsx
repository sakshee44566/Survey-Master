import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';

const RespondSurvey = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [respondent, setRespondent] = useState('');
    const [responses, setResponses] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/surveys/${id}`);
                setSurvey(response.data);
            } catch (error) {
                console.error('Error fetching survey:', error); 
            }
        };
    
        fetchSurvey();
    }, [id]);

    const handleChange = (index, event) => {
        const newResponses = [...responses];
        newResponses[index] = event.target.value;
        setResponses(newResponses);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post(`http://localhost:5000/api/surveys/respond/${id}`, {
            respondent,
            answers: responses
        })
        .then(()=>{
            toast.success("Survey responded successfully");
            setRespondent('');
            setResponses([]);
            setSubmitted(true);
        })
        .catch(()=>{
            toast.error("Failed to respond to survey");
        });
    };

    const resetForm = () => {
        setSubmitted(false);
    };

    if (!survey) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Loading...</div>;

    return (
        <div className='flex justify-center mt-12'> 
            <div className="min-h-screen  w-[500px] ">
                {submitted ? (

                    <div className="container mx-auto p-10 mt-40 bg-blue-200 shadow-md rounded-lg text-center">
                        <h2 className="text-3xl font-bold mb-6">Thank you for your response!</h2>
                        <button 
                            onClick={resetForm}
                            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                        >
                            Submit Another Response
                        </button>
                    </div>
                
                ) : (
                    <div className="container mx-auto p-4 bg-blue-200 shadow-md rounded-lg">
                        <h2 className="text-3xl font-bold mb-6 text-center">{survey.title}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col mb-4">
                                <label className="mb-2 text-lg font-medium text-gray-700">Respondent Name</label>
                                <input
                                    type="text"
                                    value={respondent}
                                    onChange={(e) => setRespondent(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            {survey.questions.map((q, index) => (
                                <div key={index} className="flex flex-col mb-4">
                                <label className="mb-2 text-lg font-medium text-gray-700">{q.question}</label>
                                {q.options.map((option, optIdx) => (
                                  <label key={optIdx} className="inline-flex items-center mt-2">
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      value={option}
                                      checked={responses[index] === option}
                                      onChange={(e) => handleChange(index, e)}
                                      className="form-radio h-4 w-4 text-blue-600"
                                      required
                                    />
                                    <span className="ml-2 text-gray-700">{option}</span>
                                  </label>
                                ))}
                              </div>
                              
                            ))}
                            <button 
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                            >
                                Submit Response
                            </button>
                        </form>
                    </div>
                )}
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
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


export default RespondSurvey
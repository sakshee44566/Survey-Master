import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Ulogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let payload = { email: loginEmail, password: loginPassword };
    axios.post("http://localhost:5000/ulogin", payload)
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          toast.success("Login successful");
          setTimeout(() => navigate('/createsurvey'), 2000);
        } else {
          toast.error(res.data.message || "Login failed");
        }
      })
      .catch(() => toast.error("Server error during login"));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    let payload = { name: signupName, email: signupEmail, password: signupPassword };
    axios.post("http://localhost:5000/usignup", payload)
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Account created");
          setIsLogin(true); // Switch to login form
        } else {
          toast.error(res.data.message || "Signup failed");
        }
      })
      .catch(() => toast.error("Server error during signup"));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white px-4 py-10">
      <Link to='/alogin' className="text-blue-300 underline mb-6 text-lg">Login as Admin</Link>

      <div className="bg-white text-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between mb-6">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`w-1/2 py-2 rounded-l-lg font-semibold ${isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`w-1/2 py-2 rounded-r-lg font-semibold ${!isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center text-indigo-700">User Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center text-indigo-700">Create Account</h2>
            <input
              type="text"
              placeholder="Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Ulogin;

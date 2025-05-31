import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Alogin = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e, isLogin) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/alogin", loginData);
      if (res.data.Status === "Success") {
        toast.success("Login successful");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setTimeout(() => navigate("/ahome"), 1500);
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/asignup", signupData);
      if (res.data.Status === "Success") {
        toast.success("Account created");
        setIsSignup(false); // switch to login
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-800">
          {isSignup ? "Admin Signup" : "Admin Login"}
        </h2>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupData.name}
              onChange={(e) => handleChange(e, false)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={isSignup ? signupData.email : loginData.email}
            onChange={(e) => handleChange(e, !isSignup)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={isSignup ? signupData.password : loginData.password}
            onChange={(e) => handleChange(e, !isSignup)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          {isSignup ? "Already an admin?" : "New admin?"}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-indigo-600 font-semibold hover:underline ml-1"
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </p>

        <div className="text-center">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700 text-sm font-medium underline"
          >
            Login as User
          </Link>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default Alogin;

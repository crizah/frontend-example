import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./index.css"

export function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setIsSuccess(false);
      setMessage("All fields are required.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    let config = {
      headers: {
        "Content-Type": "application/json"
        
      }
    }

    try {
      const res = await axios.post("http://localhost:8081/signup", {
        "username": formData.username,
        "email": formData.email,
        "password": formData.password
      }, {withCredentials:true}, config);

      setIsSuccess(true);
      setMessage("Account created successfully!");
      setFormData({ username: "", email: "", password: "" }); // clear
      
      setTimeout(() => navigate("/"), 1000);

    } catch (error) {
      setIsSuccess(false);
      if (error.response) setMessage(error.response.data || "Signup failed");
      else setMessage("Cannot connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-teal-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {message && (
            <p className={isSuccess ? "text-green-600 text-center" : "text-red-500 text-center"}>
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-green-500 font-semibold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

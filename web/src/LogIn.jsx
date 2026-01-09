import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./index.css";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const isEmail = formData.identifier.includes("@");

    try {
      await axios.post(
        "http://localhost:8081/login",
        isEmail
          ? { email: formData.identifier, password: formData.password }
          : { username: formData.identifier, password: formData.password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data || "Login failed");
      } else {
        setMessage("Cannot connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            value={formData.identifier}
            onChange={(e) =>
              setFormData({ ...formData, identifier: e.target.value })
            }
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="text-red-500 text-center">{message}</p>
          )}
        </form>

        <p className="mt-4 text-center text-gray-600">
          New user?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

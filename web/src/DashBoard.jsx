import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./index.css"


export function DashBoard() {
  const navigate = useNavigate();

  const logout = async () => {
    let config = {
      headers: {
        "Content-Type": "application/json"
        
      }
    }
    await axios.get("http://localhost:8081/logout", {
      withCredentials: true
    }, config);
    navigate("/");
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}


import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }) => {
  const [ok, setOk] = useState(null);
  const x = window.RUNTIME_CONFIG.BACKEND_URL;


  useEffect(() => {
    axios
      .get(`${x}/profile`, { withCredentials: true })
      .then(() => setOk(true))
      .catch(() => setOk(false));
  }, []);

  if (ok === null) return null;
  if (!ok) return <Navigate to="/" />;

  return children;
};

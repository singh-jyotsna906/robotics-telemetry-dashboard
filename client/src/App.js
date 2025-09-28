import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import api from "./utils/api";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Optionally, verify token with backend or decode user info
      setUser({}); // Placeholder for user info
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem("jwt", jwt);
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("jwt");
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard token={token} onLogout={handleLogout} />
  );
}

export default App;

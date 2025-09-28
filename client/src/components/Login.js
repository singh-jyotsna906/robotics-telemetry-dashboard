import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [registerMsg, setRegisterMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      onLogin(res.data.token);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMsg("");
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });
      setRegisterMsg("Registration successful! You can now log in.");
      setRegisterMode(false);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Username already exists");
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Robotics Telemetry Dashboard {registerMode ? "Register" : "Login"}</h2>
      <form onSubmit={registerMode ? handleRegister : handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{registerMode ? "Register" : "Login"}</button>
        <button
          type="button"
          style={{ marginLeft: 10 }}
          onClick={() => {
            setRegisterMode((m) => !m);
            setError("");
            setRegisterMsg("");
          }}
        >
          {registerMode ? "Back to Login" : "Register"}
        </button>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        {registerMsg && <div style={{ color: "green", marginTop: 10 }}>{registerMsg}</div>}
      </form>
    </div>
  );
}

export default Login;

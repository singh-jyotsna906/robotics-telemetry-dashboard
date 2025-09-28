import React, { useState } from "react";
import api from "../utils/api";

function RobotConfigForm({ robot, token, onClose }) {
  const [maxSpeed, setMaxSpeed] = useState(robot.config?.maxSpeed || 1.0);
  const [sensors, setSensors] = useState(robot.config?.sensors?.join(",") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const config = {
        maxSpeed: parseFloat(maxSpeed),
        sensors: sensors.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await api.put(`/robots/${robot._id}/config`, { config }, token);
      setMessage("Configuration updated!");
      setTimeout(onClose, 1000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized. Please log in again.");
        setTimeout(onClose, 1000);
      } else {
        setError("Failed to update configuration.");
      }
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 30, borderRadius: 8, minWidth: 300 }}>
        <h3>Edit Config for {robot.name}</h3>
        <div>
          <label>Max Speed:</label>
          <input
            type="number"
            step="0.1"
            value={maxSpeed}
            onChange={(e) => setMaxSpeed(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Sensors (comma separated):</label>
          <input
            type="text"
            value={sensors}
            onChange={(e) => setSensors(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
        {message && <div style={{ color: "green", marginTop: 10 }}>{message}</div>}
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}

export default RobotConfigForm;

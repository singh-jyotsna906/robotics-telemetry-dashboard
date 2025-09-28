import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import api from "../utils/api";
import RobotConfigForm from "./RobotConfigForm";

const WS_URL = "http://localhost:5000";

function Dashboard({ token, onLogout }) {
  const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    // Fetch initial robot list
    const fetchRobots = async () => {
      try {
        const res = await api.get("/robots", token);
        setRobots(res.robots);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          onLogout();
        }
      }
    };
    fetchRobots();
  }, [token, showConfig, onLogout]);

  useEffect(() => {
    // Connect to WebSocket with JWT
    const socket = socketIOClient(WS_URL, {
      auth: { token }
    });

    socket.on("telemetry", (data) => {
      setRobots((prev) => {
        const idx = prev.findIndex((r) => r._id === data.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...data };
          return updated;
        }
        return prev;
      });
    });

    socket.on("connect_error", (err) => {
      if (err.message === "Invalid token" || err.message === "Missing token") {
        onLogout();
      }
    });

    return () => socket.disconnect();
  }, [token, onLogout]);

  const handleConfig = (robot) => {
    setSelectedRobot(robot);
    setShowConfig(true);
  };

  const handleConfigClose = () => {
    setShowConfig(false);
    setSelectedRobot(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Robot Fleet Dashboard</h2>
      <button onClick={onLogout} style={{ float: "right" }}>Logout</button>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Battery</th>
            <th>Location</th>
            <th>Last Telemetry</th>
            <th>Config</th>
          </tr>
        </thead>
        <tbody>
          {robots.map((robot) => (
            <tr key={robot._id}>
              <td>{robot.name}</td>
              <td>{robot.status}</td>
              <td>{robot.battery}%</td>
              <td>
                ({robot.location?.x?.toFixed(1)}, {robot.location?.y?.toFixed(1)})<br />
                θ: {robot.location?.orientation?.toFixed(1)}°
              </td>
              <td>{robot.lastTelemetry ? new Date(robot.lastTelemetry).toLocaleTimeString() : ""}</td>
              <td>
                <button onClick={() => handleConfig(robot)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfig && (
        <RobotConfigForm
          robot={selectedRobot}
          token={token}
          onClose={handleConfigClose}
        />
      )}
    </div>
  );
}

export default Dashboard;

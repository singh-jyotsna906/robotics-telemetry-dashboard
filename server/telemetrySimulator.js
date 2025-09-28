const Robot = require('./models/Robot');

// Simulate telemetry for 3-5 robots
const NUM_ROBOTS = 5;
const UPDATE_INTERVAL_MS = 500;

let robotIds = [];

function randomStatus() {
  const statuses = ['idle', 'active', 'charging', 'error'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function randomLocation() {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    orientation: Math.random() * 360
  };
}

function randomBattery() {
  return Math.max(0, Math.min(100, Math.round(100 - Math.random() * 10)));
}

async function createSimulatedRobots() {
  const robots = [];
  for (let i = 0; i < NUM_ROBOTS; i++) {
    const name = `Robot-${i + 1}`;
    let robot = await Robot.findOne({ name });
    if (!robot) {
      robot = new Robot({
        name,
        status: randomStatus(),
        location: randomLocation(),
        battery: randomBattery(),
        config: { maxSpeed: 1.0, sensors: ['imu', 'camera'] }
      });
      await robot.save();
    }
    robots.push(robot);
  }
  robotIds = robots.map(r => r._id);
}

async function updateAndBroadcast(io) {
  for (const id of robotIds) {
    const status = randomStatus();
    const location = randomLocation();
    const battery = randomBattery();
    const robot = await Robot.findByIdAndUpdate(
      id,
      { status, location, battery, lastTelemetry: new Date() },
      { new: true }
    );
    if (robot) {
      io.emit('telemetry', {
        id: robot._id,
        name: robot.name,
        status: robot.status,
        location: robot.location,
        battery: robot.battery,
        lastTelemetry: robot.lastTelemetry
      });
    }
  }
}

function startTelemetrySimulation(io) {
  createSimulatedRobots().then(() => {
    setInterval(() => {
      updateAndBroadcast(io);
    }, UPDATE_INTERVAL_MS);
  });
}

module.exports = { startTelemetrySimulation };

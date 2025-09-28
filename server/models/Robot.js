const mongoose = require('mongoose');

const RobotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['idle', 'active', 'charging', 'error'], default: 'idle' },
  config: {
    maxSpeed: { type: Number, default: 1.0 },
    sensors: [{ type: String }],
    // Add more config fields as needed
  },
  location: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    orientation: { type: Number, default: 0 }
  },
  battery: { type: Number, default: 100 },
  lastTelemetry: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Robot', RobotSchema);

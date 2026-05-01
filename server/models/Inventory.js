/**
 * models/Inventory.js
 * Medicine stock managed by the admin.
 */

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      default: 'tablets', // tablets, ml, capsules, etc.
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);

/**
 * models/Request.js
 * Pharmacist sends inventory requests to admin when stock is low.
 * Admin can Approve or Reject them.
 */

const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    pharmacistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: 'tablets',
    },
    reason: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);

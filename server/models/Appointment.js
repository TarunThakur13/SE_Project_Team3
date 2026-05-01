/**
 * models/Appointment.js
 * Represents a single appointment slot booked by a patient with a doctor.
 * status: Pending → Accepted | Rejected
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ISO date string: "2024-05-20"
    date: {
      type: String,
      required: true,
    },
    // Slot label e.g. "09:00 - 09:15"
    slotTime: {
      type: String,
      required: true,
    },
    // Index 0–8 to prevent double-booking
    slotIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 8,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    // Optional reason for rejection
    rejectionReason: {
      type: String,
      default: '',
    },
    // Reason/Issue provided by patient
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index to prevent double-booking same doctor+date+slot
appointmentSchema.index(
  { doctorId: 1, date: 1, slotIndex: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'Rejected' } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);

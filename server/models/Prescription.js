/**
 * models/Prescription.js
 * Created by a doctor after accepting and consulting a patient.
 * Visible to both patient and pharmacist.
 */

const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  dosage:   { type: String, required: true },  // e.g. "1 tablet twice daily"
  duration: { type: String, required: true },  // e.g. "5 days"
});

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true, // one prescription per appointment
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicines: {
      type: [medicineSchema],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
    // Track if pharmacist has processed it
    pharmacyStatus: {
      type: String,
      enum: ['Pending', 'Processed'],
      default: 'Pending',
    },
    // PDF uploaded by pharmacist upon processing
    billPDF: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);

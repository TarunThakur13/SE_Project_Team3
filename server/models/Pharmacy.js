/**
 * models/Pharmacy.js
 * Pharmacist adds comments and a bill PDF after dispensing medicines.
 * Linked 1-to-1 with a Prescription.
 */

const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      required: true,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pharmacistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: {
      type: String,
      default: '',
    },
    // Relative path to uploaded PDF under /uploads/
    billPDF: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pharmacy', pharmacySchema);

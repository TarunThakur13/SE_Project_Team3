/**
 * controllers/pharmacyController.js
 * Pharmacist adds comments, uploads bill PDF, marks prescription processed.
 */

const Pharmacy     = require('../models/Pharmacy');
const Prescription = require('../models/Prescription');
const path         = require('path');

/**
 * POST /api/pharmacy
 * Body: { prescriptionId, comments }
 * Creates or updates pharmacy record (without file).
 * Pharmacist only.
 */
exports.createRecord = async (req, res) => {
  try {
    const { prescriptionId, comments } = req.body;
    const pharmacistId = req.user._id;

    const prescription = await Prescription.findById(prescriptionId)
      .populate('patientId', 'name email');
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Upsert pharmacy record
    let record = await Pharmacy.findOne({ prescriptionId });
    if (record) {
      record.comments    = comments;
      record.pharmacistId = pharmacistId;
      await record.save();
    } else {
      record = await Pharmacy.create({
        prescriptionId,
        patientId:    prescription.patientId._id,
        pharmacistId,
        comments,
      });
    }

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/pharmacy/upload-bill/:prescriptionId
 * Multipart form – file field name: "bill"
 * Uploads PDF and marks both pharmacy & prescription as Processed.
 */
exports.uploadBill = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { comments } = req.body;
    const pharmacistId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Relative URL for client access
    const billPDF = `/uploads/${req.file.filename}`;

    let record = await Pharmacy.findOne({ prescriptionId });
    if (record) {
      record.billPDF      = billPDF;
      record.comments     = comments || record.comments;
      record.status       = 'Processed';
      record.pharmacistId = pharmacistId;
      await record.save();
    } else {
      record = await Pharmacy.create({
        prescriptionId,
        patientId:    prescription.patientId,
        pharmacistId,
        comments:     comments || '',
        billPDF,
        status:       'Processed',
      });
    }

    // Mark prescription as processed
    prescription.pharmacyStatus = 'Processed';
    prescription.billPDF = billPDF;
    await prescription.save();

    await record.populate('prescriptionId');
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/pharmacy
 * Returns all pharmacy records (pharmacist view – all processed items).
 */
exports.getAllRecords = async (req, res) => {
  try {
    const records = await Pharmacy.find()
      .populate({
        path: 'prescriptionId',
        populate: [
          { path: 'patientId', select: 'name email' },
          { path: 'doctorId',  select: 'name' },
          { path: 'appointmentId', select: 'date slotTime' },
        ],
      })
      .populate('pharmacistId', 'name')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/pharmacy/patient
 * Returns pharmacy records for the logged-in patient.
 */
exports.getPatientRecords = async (req, res) => {
  try {
    const records = await Pharmacy.find({ patientId: req.user._id })
      .populate({
        path: 'prescriptionId',
        populate: [
          { path: 'doctorId',      select: 'name specialization' },
          { path: 'appointmentId', select: 'date slotTime' },
        ],
      })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/pharmacy/:id
 * Allows Pharmacist to delete a pharmacy log.
 */
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Pharmacy.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Pharmacy record not found' });
    
    // We explicitly do NOT reset the prescription's pharmacyStatus 
    // so it doesn't reappear in the pending order queue.
    
    await record.deleteOne();
    res.json({ message: 'Pharmacy log deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

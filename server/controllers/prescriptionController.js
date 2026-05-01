/**
 * controllers/prescriptionController.js
 * Doctor creates prescriptions; patient & pharmacist can view them.
 */

const Prescription = require('../models/Prescription');
const Appointment  = require('../models/Appointment');

/**
 * POST /api/prescriptions
 * Body: { appointmentId, medicines: [{name, dosage, duration}], notes }
 * Doctor only.
 */
exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;
    const doctorId = req.user._id;

    // Validate appointment exists and belongs to this doctor
    const appt = await Appointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (appt.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (appt.status !== 'Accepted') {
      return res.status(400).json({ message: 'Appointment must be Accepted first' });
    }

    // Prevent duplicate prescription for same appointment
    const existing = await Prescription.findOne({ appointmentId });
    if (existing) {
      return res.status(409).json({ message: 'Prescription already exists for this appointment' });
    }

    const prescription = await Prescription.create({
      appointmentId,
      doctorId,
      patientId: appt.patientId,
      medicines,
      notes,
    });

    await prescription.populate('patientId', 'name email');
    await prescription.populate('doctorId',  'name specialization');

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/prescriptions/patient
 * Returns all prescriptions for the logged-in patient.
 */
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user._id })
      .populate('doctorId',      'name specialization')
      .populate('appointmentId', 'date slotTime')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/prescriptions/pharmacist
 * Returns all prescriptions with pharmacyStatus=Pending (for pharmacist queue).
 */
exports.getPharmacistQueue = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patientId',     'name email')
      .populate('doctorId',      'name specialization')
      .populate('appointmentId', 'date slotTime')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/prescriptions/:id
 * Returns a single prescription by ID.
 */
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId',     'name email')
      .populate('doctorId',      'name specialization')
      .populate('appointmentId', 'date slotTime');
    if (!prescription) return res.status(404).json({ message: 'Not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/prescriptions/doctor
 * Returns prescriptions written by the logged-in doctor.
 */
exports.getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user._id })
      .populate('patientId',     'name email')
      .populate('appointmentId', 'date slotTime')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/prescriptions/:id
 * Allows a patient to delete a specific prescription.
 */
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    // Only the patient who owns the prescription can delete it
    if (prescription.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }
    
    await prescription.deleteOne();
    res.json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

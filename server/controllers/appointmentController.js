/**
 * controllers/appointmentController.js
 * Manages slot generation, booking, and status updates.
 */

const Appointment  = require('../models/Appointment');
const User         = require('../models/User');
const generateSlots = require('../utils/generateSlots');

/**
 * GET /api/appointments/doctors
 * Returns all active doctors (for patient dropdown).
 */
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true })
      .select('name email specialization');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/appointments/slots?doctorId=&date=
 * Returns 9 slot labels with availability for a given doctor+date.
 */
exports.getSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date are required' });
    }

    // Get all non-rejected appointments for this doctor+date
    const booked = await Appointment.find({
      doctorId,
      date,
      status: { $ne: 'Rejected' },
    }).select('slotIndex');

    const bookedIndexes = new Set(booked.map((a) => a.slotIndex));
    const allSlots = generateSlots();

    const slots = allSlots.map((label, idx) => ({
      index:     idx,
      label,
      available: !bookedIndexes.has(idx),
    }));

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/appointments/book
 * Body: { doctorId, date, slotIndex }
 * Creates a Pending appointment for the logged-in patient.
 */
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, slotIndex, reason } = req.body;
    const patientId = req.user._id;

    // Validate slot index
    if (slotIndex < 0 || slotIndex > 8) {
      return res.status(400).json({ message: 'Invalid slot index' });
    }

    // Check if slot already taken (non-rejected)
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      slotIndex,
      status: { $ne: 'Rejected' },
    });
    if (conflict) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }

    const slots  = generateSlots();
    const slotTime = slots[slotIndex];

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      slotIndex,
      slotTime,
      reason: reason || '',
      status: 'Pending',
    });

    // Populate for response
    await appointment.populate('doctorId', 'name specialization');
    await appointment.populate('patientId', 'name email');

    res.status(201).json(appointment);
  } catch (err) {
    // Duplicate key from unique index
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/appointments/my
 * Returns appointments for the logged-in patient.
 */
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1, slotIndex: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/appointments/doctor
 * Returns all appointments assigned to the logged-in doctor.
 * Query: ?date=YYYY-MM-DD  (optional – filter to today)
 */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const filter = { doctorId: req.user._id };
    if (req.query.date) filter.date = req.query.date;

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email')
      .sort({ date: 1, slotIndex: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PATCH /api/appointments/:id/status
 * Body: { status: 'Accepted' | 'Rejected', rejectionReason? }
 * Doctor only.
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Ensure this doctor owns the appointment
    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    if (status === 'Rejected' && rejectionReason) {
      appointment.rejectionReason = rejectionReason;
    }
    await appointment.save();

    await appointment.populate('patientId', 'name email');
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/appointments/all  (Admin)
 * Returns every appointment with full population.
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId',  'name specialization')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PATCH /api/appointments/:id/cancel
 * Patient cancels their own appointment
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check if appointment is in future/pending/accepted.
    if (appointment.status === 'Completed' || appointment.status === 'Rejected') {
      return res.status(400).json({ message: 'Cannot cancel an already finalised appointment' });
    }
    
    appointment.status = 'Cancelled';
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/appointments/:id
 * Patient deletes their appointment from history
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * controllers/adminController.js
 * Admin: manage doctors, generate reports.
 */

const User        = require('../models/User');
const Appointment = require('../models/Appointment');
const Inventory   = require('../models/Inventory');
const Request     = require('../models/Request');
const bcrypt      = require('bcryptjs');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const doctor = await User.create({ name, email, password, role: 'doctor', specialization: specialization || '' });
    res.status(201).json({ id: doctor._id, name: doctor.name, email: doctor.email, specialization: doctor.specialization });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.removeDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Doctor not found' });
    doctor.isActive = false;
    await doctor.save();
    res.json({ message: 'Doctor deactivated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getReports = async (req, res) => {
  try {
    const [totalAppointments, pendingAppointments, acceptedAppointments,
           rejectedAppointments, inventory, pendingRequests] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Accepted' }),
      Appointment.countDocuments({ status: 'Rejected' }),
      Inventory.find().sort({ medicineName: 1 }),
      Request.countDocuments({ status: 'Pending' }),
    ]);

    res.json({
      appointments: { total: totalAppointments, pending: pendingAppointments, accepted: acceptedAppointments, rejected: rejectedAppointments },
      inventory,
      pendingRequests,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

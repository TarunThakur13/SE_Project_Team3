const router = require('express').Router();
const ctrl   = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

// Public (protected) routes
router.get('/doctors',          protect, ctrl.getDoctors);
router.get('/slots',            protect, ctrl.getSlots);
router.post('/book',            protect, authorize('patient'), ctrl.bookAppointment);
router.get('/my',               protect, authorize('patient'), ctrl.getMyAppointments);
router.get('/doctor',           protect, authorize('doctor'),  ctrl.getDoctorAppointments);
router.patch('/:id/status',     protect, authorize('doctor'),  ctrl.updateStatus);
router.patch('/:id/cancel',     protect, authorize('patient'), ctrl.cancelAppointment);
router.delete('/:id',           protect, authorize('patient'), ctrl.deleteAppointment);
router.get('/all',              protect, authorize('admin'),   ctrl.getAllAppointments);

module.exports = router;

const router = require('express').Router();
const ctrl   = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/',           protect, authorize('doctor'),      ctrl.createPrescription);
router.get('/patient',     protect, authorize('patient'),     ctrl.getPatientPrescriptions);
router.get('/pharmacist',  protect, authorize('pharmacist'),  ctrl.getPharmacistQueue);
router.get('/doctor',      protect, authorize('doctor'),      ctrl.getDoctorPrescriptions);
router.get('/:id',         protect, ctrl.getPrescriptionById);
router.delete('/:id',      protect, authorize('patient'), ctrl.deletePrescription);

module.exports = router;

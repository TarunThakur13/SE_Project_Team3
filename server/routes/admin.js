const router = require('express').Router();
const ctrl   = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/doctors',     protect, authorize('admin'), ctrl.getDoctors);
router.post('/doctors',    protect, authorize('admin'), ctrl.addDoctor);
router.delete('/doctors/:id', protect, authorize('admin'), ctrl.removeDoctor);
router.get('/reports',     protect, authorize('admin'), ctrl.getReports);

module.exports = router;

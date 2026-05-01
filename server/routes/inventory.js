const router = require('express').Router();
const ctrl   = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/',                protect, ctrl.getInventory);
router.post('/',               protect, authorize('admin'),       ctrl.addMedicine);
router.patch('/:id',           protect, authorize('admin'),       ctrl.updateStock);
router.delete('/:id',          protect, authorize('admin'),       ctrl.deleteMedicine);

// Requests sub-resource
router.post('/requests',       protect, authorize('pharmacist'),  ctrl.createRequest);
router.get('/requests',        protect, authorize('admin', 'pharmacist'), ctrl.getRequests);
router.patch('/requests/:id',  protect, authorize('admin'),       ctrl.handleRequest);

module.exports = router;

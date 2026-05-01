const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const ctrl   = require('../controllers/pharmacyController');
const { protect, authorize } = require('../middleware/auth');

// Multer config: store PDFs in /uploads with unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `bill-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

router.post('/',                                     protect, authorize('pharmacist'), ctrl.createRecord);
router.post('/upload-bill/:prescriptionId',          protect, authorize('pharmacist'), upload.single('bill'), ctrl.uploadBill);
router.get('/',                                      protect, authorize('pharmacist', 'admin'), ctrl.getAllRecords);
router.get('/patient',                               protect, authorize('patient'),    ctrl.getPatientRecords);
router.delete('/:id',                                protect, authorize('pharmacist', 'admin'), ctrl.deleteRecord);

module.exports = router;

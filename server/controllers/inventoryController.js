/**
 * controllers/inventoryController.js
 * Admin manages medicine stock; pharmacist submits requests.
 */

const Inventory = require('../models/Inventory');
const Request   = require('../models/Request');

exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ medicineName: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addMedicine = async (req, res) => {
  try {
    const { medicineName, quantity, unit } = req.body;
    const existing = await Inventory.findOne({ medicineName: { $regex: new RegExp(`^${medicineName}$`, 'i') } });
    if (existing) return res.status(409).json({ message: 'Medicine already exists. Update stock instead.' });
    const item = await Inventory.create({ medicineName, quantity, unit });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateStock = async (req, res) => {
  try {
    const { quantity, unit } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Medicine not found' });
    if (quantity !== undefined) { item.quantity = quantity; item.lastUpdated = new Date(); }
    if (unit) item.unit = unit;
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createRequest = async (req, res) => {
  try {
    const { medicineName, quantity, unit, reason } = req.body;
    const request = await Request.create({
      pharmacistId: req.user._id,
      medicineName, quantity,
      unit: unit || 'tablets',
      reason: reason || '',
    });
    res.status(201).json(request);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getRequests = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { pharmacistId: req.user._id };
    const requests = await Request.find(filter).populate('pharmacistId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.handleRequest = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = status;
    request.adminNote = adminNote || '';
    await request.save();
    if (status === 'Approved') {
      const item = await Inventory.findOne({ medicineName: { $regex: new RegExp(`^${request.medicineName}$`, 'i') } });
      if (item) { item.quantity += request.quantity; item.lastUpdated = new Date(); await item.save(); }
      else await Inventory.create({ medicineName: request.medicineName, quantity: request.quantity, unit: request.unit });
    }
    res.json(request);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

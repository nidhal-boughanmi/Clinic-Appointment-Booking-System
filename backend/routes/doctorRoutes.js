const express = require('express');
const router = express.Router();
const {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorAvailability,
} = require('../controllers/doctorController');
const { protect, admin, doctor } = require('../middleware/auth');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);

// Protected routes
router.post('/', protect, admin, createDoctor);
router.put('/:id', protect, doctor, updateDoctor);
router.delete('/:id', protect, admin, deleteDoctor);

module.exports = router;

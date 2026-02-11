const express = require('express');
const router = express.Router();
const {
    getAllClinics,
    getClinicById,
    createClinic,
    updateClinic,
    assignDoctorToClinic,
    removeDoctorFromClinic,
    deleteClinic,
} = require('../controllers/clinicController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllClinics);
router.get('/:id', getClinicById);

// Protected routes (Admin only)
router.post('/', protect, admin, createClinic);
router.put('/:id', protect, admin, updateClinic);
router.put('/:id/doctors', protect, admin, assignDoctorToClinic);
router.delete('/:id/doctors/:doctorId', protect, admin, removeDoctorFromClinic);
router.delete('/:id', protect, admin, deleteClinic);

module.exports = router;

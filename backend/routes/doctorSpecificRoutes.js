const express = require('express');
const router = express.Router();
const {
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorAppointments,
    updateDoctorAvailability,
    getDoctorStats,
} = require('../controllers/doctorSpecificController');
const { protect, doctor } = require('../middleware/auth');

// All routes require doctor authentication
router.use(protect);
router.use(doctor);

router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.get('/appointments', getDoctorAppointments);
router.put('/availability', updateDoctorAvailability);
router.get('/stats', getDoctorStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.route('/')
    .post(protect, createAppointment)
    .get(protect, getAppointments);

router.route('/:id')
    .get(protect, getAppointmentById)
    .put(protect, updateAppointment)
    .delete(protect, cancelAppointment);

module.exports = router;

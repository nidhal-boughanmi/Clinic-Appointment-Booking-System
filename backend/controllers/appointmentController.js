const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            appointmentDate,
            timeSlot,
            reasonForVisit,
            symptoms,
        } = req.body;

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if time slot is available
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            appointmentDate,
            'timeSlot.startTime': timeSlot.startTime,
            status: { $ne: 'cancelled' },
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'Time slot already booked' });
        }

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            appointmentDate,
            timeSlot,
            reasonForVisit,
            symptoms,
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patient', 'name email phone')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' },
            });

        res.status(201).json(populatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all appointments (filtered by user role)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        let query = {};

        // Patient sees only their appointments
        if (req.user.role === 'patient') {
            query.patient = req.user._id;
        }
        // Doctor sees only their appointments
        else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: req.user._id });
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }
            query.doctor = doctor._id;
        }
        // Admin sees all appointments

        const { status, date } = req.query;
        if (status) query.status = status;
        if (date) {
            const searchDate = new Date(date);
            query.appointmentDate = {
                $gte: searchDate,
                $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000),
            };
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' },
            })
            .sort('-appointmentDate');

        res.json({
            count: appointments.length,
            appointments,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email phone dateOfBirth gender address')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone' },
            });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check authorization
        const isPatient = appointment.patient._id.toString() === req.user._id.toString();
        const doctor = await Doctor.findById(appointment.doctor._id);
        const isDoctor = doctor && doctor.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update fields based on role
        const { status, notes, prescription } = req.body;

        if (status) {
            appointment.status = status;
        }

        // Only doctors can add notes and prescriptions
        if (req.user.role === 'doctor' || req.user.role === 'admin') {
            if (notes) appointment.notes = notes;
            if (prescription) appointment.prescription = prescription;
        }

        const updatedAppointment = await appointment.save();
        const populatedAppointment = await Appointment.findById(updatedAppointment._id)
            .populate('patient', 'name email phone')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' },
            });

        res.json(populatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user is authorized to cancel
        const isPatient = appointment.patient.toString() === req.user._id.toString();
        const doctor = await Doctor.findById(appointment.doctor);
        const isDoctor = doctor && doctor.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        appointment.status = 'cancelled';
        appointment.cancelledBy = req.user.role;
        appointment.cancellationReason = req.body.reason || 'Not specified';

        const cancelledAppointment = await appointment.save();

        res.json({
            message: 'Appointment cancelled successfully',
            appointment: cancelledAppointment,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

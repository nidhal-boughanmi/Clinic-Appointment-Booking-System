const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get doctor's own profile
// @route   GET /api/doctors/profile
// @access  Private/Doctor
exports.getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id })
            .populate('user', 'name email phone profileImage');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        res.json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update doctor's own profile
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
exports.updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const {
            specialization,
            qualification,
            experience,
            consultationFee,
            bio,
            availability,
            isAvailable,
        } = req.body;

        if (specialization) doctor.specialization = specialization;
        if (qualification) doctor.qualification = qualification;
        if (experience) doctor.experience = experience;
        if (consultationFee) doctor.consultationFee = consultationFee;
        if (bio) doctor.bio = bio;
        if (availability) doctor.availability = availability;
        if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

        const updatedDoctor = await doctor.save();
        const populatedDoctor = await Doctor.findById(updatedDoctor._id)
            .populate('user', 'name email phone profileImage');

        res.json(populatedDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get doctor's appointments
// @route   GET /api/doctors/appointments
// @access  Private/Doctor
exports.getDoctorAppointments = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        let query = { doctor: doctor._id };

        if (status) {
            query.status = status;
        }

        if (startDate && endDate) {
            query.appointmentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone')
            .sort({ appointmentDate: 1, timeSlot: 1 });

        res.json({
            count: appointments.length,
            appointments,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/availability
// @access  Private/Doctor
exports.updateDoctorAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const { availability, isAvailable } = req.body;

        if (availability) {
            doctor.availability = availability;
        }

        if (isAvailable !== undefined) {
            doctor.isAvailable = isAvailable;
        }

        const updatedDoctor = await doctor.save();
        const populatedDoctor = await Doctor.findById(updatedDoctor._id)
            .populate('user', 'name email phone profileImage');

        res.json(populatedDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get doctor statistics
// @route   GET /api/doctors/stats
// @access  Private/Doctor
exports.getDoctorStats = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        // Get appointment counts by status
        const totalAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
        });

        const pendingAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            status: 'pending',
        });

        const confirmedAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            status: 'confirmed',
        });

        const completedAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            status: 'completed',
        });

        const cancelledAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            status: 'cancelled',
        });

        // Get upcoming appointments (next 7 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            appointmentDate: { $gte: today, $lte: nextWeek },
            status: { $in: ['pending', 'confirmed'] },
        });

        // Get today's appointments
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            appointmentDate: { $gte: today, $lt: tomorrow },
            status: { $in: ['pending', 'confirmed'] },
        });

        res.json({
            totalAppointments,
            appointmentsByStatus: {
                pending: pendingAppointments,
                confirmed: confirmedAppointments,
                completed: completedAppointments,
                cancelled: cancelledAppointments,
            },
            upcomingAppointments,
            todayAppointments,
            rating: doctor.rating,
            totalPatients: doctor.totalPatients,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
    try {
        const { specialization, minFee, maxFee, search } = req.query;

        let query = { isAvailable: true };

        // Filter by specialization
        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }

        // Filter by fee range
        if (minFee || maxFee) {
            query.consultationFee = {};
            if (minFee) query.consultationFee.$gte = Number(minFee);
            if (maxFee) query.consultationFee.$lte = Number(maxFee);
        }

        const doctors = await Doctor.find(query)
            .populate('user', 'name email phone profileImage')
            .sort('-rating');

        // Search by doctor name if provided
        let filteredDoctors = doctors;
        if (search) {
            filteredDoctors = doctors.filter(doc =>
                doc.user.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        res.json({
            count: filteredDoctors.length,
            doctors: filteredDoctors,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('user', 'name email phone profileImage');

        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private/Admin
exports.createDoctor = async (req, res) => {
    try {
        const {
            userId,
            specialization,
            qualification,
            experience,
            consultationFee,
            bio,
            availability,
        } = req.body;

        // Check if user exists and is a doctor
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'doctor') {
            return res.status(400).json({ message: 'User is not a doctor' });
        }

        // Check if doctor profile already exists
        const doctorExists = await Doctor.findOne({ user: userId });
        if (doctorExists) {
            return res.status(400).json({ message: 'Doctor profile already exists' });
        }

        const doctor = await Doctor.create({
            user: userId,
            specialization,
            qualification,
            experience,
            consultationFee,
            bio,
            availability,
        });

        const populatedDoctor = await Doctor.findById(doctor._id)
            .populate('user', 'name email phone profileImage');

        res.status(201).json(populatedDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor/Admin
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if user is the doctor or admin
        if (
            req.user.role !== 'admin' &&
            doctor.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
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

        doctor.specialization = specialization || doctor.specialization;
        doctor.qualification = qualification || doctor.qualification;
        doctor.experience = experience || doctor.experience;
        doctor.consultationFee = consultationFee || doctor.consultationFee;
        doctor.bio = bio || doctor.bio;
        doctor.availability = availability || doctor.availability;
        if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

        const updatedDoctor = await doctor.save();
        const populatedDoctor = await Doctor.findById(updatedDoctor._id)
            .populate('user', 'name email phone profileImage');

        res.json(populatedDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (doctor) {
            await doctor.deleteOne();
            res.json({ message: 'Doctor removed' });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Public
exports.getDoctorAvailability = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Please provide a date' });
        }

        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (!doctor.isAvailable) {
            return res.status(400).json({
                message: 'Doctor is currently not available for appointments'
            });
        }

        // Get the day of week from the provided date
        const appointmentDate = new Date(date);
        const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Find the doctor's availability for that day
        const dayAvailability = doctor.availability.find(
            (avail) => avail.day === dayOfWeek && !avail.isClosed
        );

        if (!dayAvailability) {
            return res.json({
                date,
                day: dayOfWeek,
                available: false,
                message: 'Doctor is not available on this day',
                slots: [],
            });
        }

        // Get all booked appointments for this doctor on this date
        const Appointment = require('../models/Appointment');
        const bookedAppointments = await Appointment.find({
            doctor: req.params.id,
            appointmentDate: {
                $gte: new Date(date).setHours(0, 0, 0, 0),
                $lt: new Date(date).setHours(23, 59, 59, 999),
            },
            status: { $in: ['pending', 'confirmed'] }, // Only count active appointments
        }).select('timeSlot');

        // Extract booked time slots
        const bookedSlots = bookedAppointments.map((apt) => apt.timeSlot);

        // Generate all possible time slots based on doctor's availability
        const allSlots = generateTimeSlots(
            dayAvailability.startTime,
            dayAvailability.endTime,
            30 // 30-minute slots
        );

        // Filter out booked slots
        const availableSlots = allSlots.filter(
            (slot) => !bookedSlots.includes(slot)
        );

        res.json({
            date,
            day: dayOfWeek,
            available: true,
            workingHours: {
                start: dayAvailability.startTime,
                end: dayAvailability.endTime,
            },
            totalSlots: allSlots.length,
            bookedSlots: bookedSlots.length,
            availableSlots: availableSlots.length,
            slots: availableSlots,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, intervalMinutes = 30) {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
    ) {
        const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(
            currentMin
        ).padStart(2, '0')}`;
        slots.push(timeSlot);

        currentMin += intervalMinutes;
        if (currentMin >= 60) {
            currentHour += Math.floor(currentMin / 60);
            currentMin = currentMin % 60;
        }
    }

    return slots;
}

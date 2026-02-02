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

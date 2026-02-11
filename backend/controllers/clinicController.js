const Clinic = require('../models/Clinic');

// @desc    Get all clinics
// @route   GET /api/clinics
// @access  Public
exports.getAllClinics = async (req, res) => {
    try {
        const { city, state, search } = req.query;

        let query = { isActive: true };

        // Filter by location
        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }
        if (state) {
            query['address.state'] = { $regex: state, $options: 'i' };
        }

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const clinics = await Clinic.find(query)
            .populate({
                path: 'doctors',
                populate: { path: 'user', select: 'name email' },
            })
            .sort('-rating');

        res.json({
            count: clinics.length,
            clinics,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single clinic
// @route   GET /api/clinics/:id
// @access  Public
exports.getClinicById = async (req, res) => {
    try {
        const clinic = await Clinic.findById(req.params.id)
            .populate({
                path: 'doctors',
                populate: { path: 'user', select: 'name email phone' },
            });

        if (clinic) {
            res.json(clinic);
        } else {
            res.status(404).json({ message: 'Clinic not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create clinic
// @route   POST /api/clinics
// @access  Private/Admin
exports.createClinic = async (req, res) => {
    try {
        const {
            name,
            description,
            address,
            contact,
            workingHours,
            facilities,
            services,
        } = req.body;

        // Check if clinic name already exists
        const clinicExists = await Clinic.findOne({ name });
        if (clinicExists) {
            return res.status(400).json({ message: 'Clinic with this name already exists' });
        }

        const clinic = await Clinic.create({
            name,
            description,
            address,
            contact,
            workingHours,
            facilities,
            services,
        });

        res.status(201).json(clinic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update clinic
// @route   PUT /api/clinics/:id
// @access  Private/Admin
exports.updateClinic = async (req, res) => {
    try {
        const clinic = await Clinic.findById(req.params.id);

        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        const {
            name,
            description,
            address,
            contact,
            workingHours,
            facilities,
            services,
            isActive,
        } = req.body;

        if (name) clinic.name = name;
        if (description !== undefined) clinic.description = description;
        if (address) clinic.address = { ...clinic.address, ...address };
        if (contact) clinic.contact = { ...clinic.contact, ...contact };
        if (workingHours) clinic.workingHours = workingHours;
        if (facilities) clinic.facilities = facilities;
        if (services) clinic.services = services;
        if (isActive !== undefined) clinic.isActive = isActive;

        const updatedClinic = await clinic.save();
        const populatedClinic = await Clinic.findById(updatedClinic._id)
            .populate({
                path: 'doctors',
                populate: { path: 'user', select: 'name email' },
            });

        res.json(populatedClinic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Assign doctor to clinic
// @route   PUT /api/clinics/:id/doctors
// @access  Private/Admin
exports.assignDoctorToClinic = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const clinic = await Clinic.findById(req.params.id);

        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        // Check if doctor is already assigned
        if (clinic.doctors.includes(doctorId)) {
            return res.status(400).json({ message: 'Doctor already assigned to this clinic' });
        }

        clinic.doctors.push(doctorId);
        const updatedClinic = await clinic.save();

        const populatedClinic = await Clinic.findById(updatedClinic._id)
            .populate({
                path: 'doctors',
                populate: { path: 'user', select: 'name email' },
            });

        res.json(populatedClinic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove doctor from clinic
// @route   DELETE /api/clinics/:id/doctors/:doctorId
// @access  Private/Admin
exports.removeDoctorFromClinic = async (req, res) => {
    try {
        const clinic = await Clinic.findById(req.params.id);

        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        clinic.doctors = clinic.doctors.filter(
            (doc) => doc.toString() !== req.params.doctorId
        );

        await clinic.save();
        res.json({ message: 'Doctor removed from clinic' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete clinic
// @route   DELETE /api/clinics/:id
// @access  Private/Admin
exports.deleteClinic = async (req, res) => {
    try {
        const clinic = await Clinic.findById(req.params.id);

        if (clinic) {
            await clinic.deleteOne();
            res.json({ message: 'Clinic removed' });
        } else {
            res.status(404).json({ message: 'Clinic not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

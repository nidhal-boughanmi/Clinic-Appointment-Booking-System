const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add clinic name'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        maxlength: 1000,
    },
    address: {
        street: {
            type: String,
            required: [true, 'Please add street address'],
        },
        city: {
            type: String,
            required: [true, 'Please add city'],
        },
        state: {
            type: String,
            required: [true, 'Please add state'],
        },
        zipCode: {
            type: String,
            required: [true, 'Please add zip code'],
        },
        country: {
            type: String,
            default: 'USA',
        },
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Please add phone number'],
        },
        email: {
            type: String,
            required: [true, 'Please add email'],
            lowercase: true,
        },
        fax: String,
        website: String,
    },
    workingHours: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true,
        },
        openTime: {
            type: String,
            required: true,
        },
        closeTime: {
            type: String,
            required: true,
        },
        isClosed: {
            type: Boolean,
            default: false,
        },
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    }],
    facilities: [{
        type: String,
        trim: true,
    }],
    services: [{
        name: String,
        description: String,
    }],
    images: [{
        type: String,
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for location-based queries
clinicSchema.index({ 'address.city': 1, 'address.state': 1 });

module.exports = mongoose.model('Clinic', clinicSchema);

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    specialization: {
        type: String,
        required: [true, 'Please add a specialization'],
        trim: true,
    },
    qualification: {
        type: String,
        required: [true, 'Please add qualification'],
        trim: true,
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience'],
        min: 0,
    },
    consultationFee: {
        type: Number,
        required: [true, 'Please add consultation fee'],
        min: 0,
    },
    bio: {
        type: String,
        maxlength: 1000,
    },
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        slots: [{
            startTime: String,
            endTime: String,
            isBooked: {
                type: Boolean,
                default: false,
            },
        }],
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalPatients: {
        type: Number,
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);

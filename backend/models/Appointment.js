const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Please select an appointment date'],
    },
    timeSlot: {
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    reasonForVisit: {
        type: String,
        required: [true, 'Please provide reason for visit'],
        trim: true,
    },
    symptoms: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    prescription: {
        type: String,
        trim: true,
    },
    cancelledBy: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
    },
    cancellationReason: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

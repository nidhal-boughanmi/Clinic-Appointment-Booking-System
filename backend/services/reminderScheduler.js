const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { sendAppointmentReminder } = require('./emailService');
const { sendSMSReminder } = require('./smsService');

// Run every hour to check for upcoming appointments
const scheduleReminders = () => {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running appointment reminder check...');

        try {
            await sendRemindersFor24Hours();
        } catch (error) {
            console.error('Error in reminder scheduler:', error);
        }
    });

    console.log('Appointment reminder scheduler started');
};

// Send reminders for appointments 24 hours away
const sendRemindersFor24Hours = async () => {
    try {
        // Calculate 24 hours from now (with 1-hour window)
        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const in23Hours = new Date(now.getTime() + 23 * 60 * 60 * 1000);

        // Find appointments happening in ~24 hours that haven't been reminded
        const upcomingAppointments = await Appointment.find({
            appointmentDate: {
                $gte: in23Hours,
                $lte: in24Hours,
            },
            status: { $in: ['pending', 'confirmed'] },
        })
            .populate('patient', 'name email phone')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' },
            });

        console.log(`Found ${upcomingAppointments.length} appointments needing reminders`);

        for (const appointment of upcomingAppointments) {
            // Check if reminder already sent
            const existingNotification = await Notification.findOne({
                appointment: appointment._id,
                reminderType: '24hours',
                status: 'sent',
            });

            if (existingNotification) {
                continue; // Skip if already sent
            }

            const appointmentDetails = {
                doctorName: appointment.doctor.user.name,
                specialization: appointment.doctor.specialization,
                date: appointment.appointmentDate.toLocaleDateString(),
                time: appointment.timeSlot,
            };

            // Send email reminder
            if (appointment.patient.email) {
                const emailResult = await sendAppointmentReminder(
                    appointment.patient.email,
                    appointment.patient.name,
                    appointmentDetails
                );

                await Notification.create({
                    type: 'email',
                    recipient: appointment.patient._id,
                    appointment: appointment._id,
                    subject: 'Appointment Reminder - Tomorrow',
                    message: `Your appointment with Dr. ${appointmentDetails.doctorName} is tomorrow`,
                    recipientEmail: appointment.patient.email,
                    status: emailResult.success ? 'sent' : 'failed',
                    sentAt: emailResult.success ? new Date() : null,
                    error: emailResult.error || null,
                    reminderType: '24hours',
                });
            }

            // Send SMS reminder (mock for now)
            if (appointment.patient.phone) {
                const smsResult = await sendSMSReminder(
                    appointment.patient.phone,
                    appointment.patient.name,
                    appointmentDetails
                );

                await Notification.create({
                    type: 'sms',
                    recipient: appointment.patient._id,
                    appointment: appointment._id,
                    subject: 'Appointment Reminder',
                    message: `Your appointment with Dr. ${appointmentDetails.doctorName} is tomorrow`,
                    recipientPhone: appointment.patient.phone,
                    status: smsResult.success ? 'sent' : 'failed',
                    sentAt: smsResult.success ? new Date() : null,
                    error: smsResult.error || null,
                    reminderType: '24hours',
                });
            }
        }

        console.log('Reminder check completed');
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
};

// Manual trigger for testing
const sendRemindersNow = async () => {
    await sendRemindersFor24Hours();
};

module.exports = {
    scheduleReminders,
    sendRemindersNow,
};

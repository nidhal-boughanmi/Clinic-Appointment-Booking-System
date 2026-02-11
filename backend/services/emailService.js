const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    // For development: use ethereal email (fake SMTP)
    // For production: use real SMTP credentials from .env
    if (process.env.NODE_ENV === 'production') {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // For development/testing
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
                pass: process.env.SMTP_PASS || 'ethereal.password',
            },
        });
    }
};

// Send appointment reminder email
const sendAppointmentReminder = async (userEmail, userName, appointmentDetails) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Clinic Booking System" <${process.env.SMTP_FROM || 'noreply@clinicbooking.com'}>`,
            to: userEmail,
            subject: 'Appointment Reminder - Tomorrow',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Appointment Reminder</h2>
          <p>Dear ${userName},</p>
          <p>This is a friendly reminder about your upcoming appointment:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Doctor:</strong> ${appointmentDetails.doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p><strong>Time:</strong> ${appointmentDetails.time}</p>
            <p><strong>Specialization:</strong> ${appointmentDetails.specialization}</p>
          </div>
          <p>Please arrive 10 minutes early for check-in.</p>
          <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
          <br>
          <p>Best regards,<br>Clinic Booking Team</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

// Send appointment confirmation email
const sendAppointmentConfirmation = async (userEmail, userName, appointmentDetails) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Clinic Booking System" <${process.env.SMTP_FROM || 'noreply@clinicbooking.com'}>`,
            to: userEmail,
            subject: 'Appointment Confirmation',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Appointment Confirmed</h2>
          <p>Dear ${userName},</p>
          <p>Your appointment has been successfully booked!</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Doctor:</strong> ${appointmentDetails.doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p><strong>Time:</strong> ${appointmentDetails.time}</p>
            <p><strong>Specialization:</strong> ${appointmentDetails.specialization}</p>
          </div>
          <p>You will receive a reminder 24 hours before your appointment.</p>
          <br>
          <p>Best regards,<br>Clinic Booking Team</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendAppointmentReminder,
    sendAppointmentConfirmation,
};

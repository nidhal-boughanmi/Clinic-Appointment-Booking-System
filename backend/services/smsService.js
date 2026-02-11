// Mock SMS service - to be replaced with Twilio integration later

const sendSMSReminder = async (phoneNumber, userName, appointmentDetails) => {
    try {
        // Mock SMS sending - log to console for now
        const message = `Hi ${userName}, reminder: Your appointment with Dr. ${appointmentDetails.doctorName} is tomorrow at ${appointmentDetails.time}. Please arrive 10 minutes early.`;

        console.log('=== MOCK SMS ===');
        console.log(`To: ${phoneNumber}`);
        console.log(`Message: ${message}`);
        console.log('================');

        // Simulate SMS sent successfully
        return {
            success: true,
            messageId: `mock_sms_${Date.now()}`,
            message: 'SMS sent (mock)',
        };
    } catch (error) {
        console.error('SMS error:', error);
        return { success: false, error: error.message };
    }
};

// Future Twilio integration
const sendSMSWithTwilio = async (phoneNumber, message) => {
    // Uncomment when ready to use Twilio
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
  
    try {
      const messageResponse = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
  
      return {
        success: true,
        messageId: messageResponse.sid,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
    */
    return { success: false, error: 'Twilio not configured' };
};

module.exports = {
    sendSMSReminder,
    sendSMSWithTwilio,
};

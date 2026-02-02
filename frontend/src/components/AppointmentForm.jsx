import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    MenuItem,
    Typography,
    Alert,
} from '@mui/material';
import { appointmentAPI } from '../services/api';

const AppointmentForm = ({ doctorId, onSuccess }) => {
    const [formData, setFormData] = useState({
        appointmentDate: '',
        startTime: '',
        endTime: '',
        reasonForVisit: '',
        symptoms: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30',
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-set end time 30 minutes after start time
        if (name === 'startTime') {
            const startIndex = timeSlots.indexOf(value);
            if (startIndex !== -1 && startIndex < timeSlots.length - 1) {
                setFormData((prev) => ({ ...prev, endTime: timeSlots[startIndex + 1] }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const appointmentData = {
                doctorId,
                appointmentDate: formData.appointmentDate,
                timeSlot: {
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                },
                reasonForVisit: formData.reasonForVisit,
                symptoms: formData.symptoms,
            };

            await appointmentAPI.createAppointment(appointmentData);
            setSuccess(true);
            setFormData({
                appointmentDate: '',
                startTime: '',
                endTime: '',
                reasonForVisit: '',
                symptoms: '',
            });

            if (onSuccess) {
                setTimeout(() => onSuccess(), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Appointment booked successfully!</Alert>}

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Appointment Date"
                        name="appointmentDate"
                        type="date"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}
                        required
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        select
                        label="Start Time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    >
                        {timeSlots.map((time) => (
                            <MenuItem key={time} value={time}>
                                {time}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="End Time"
                        name="endTime"
                        value={formData.endTime}
                        InputProps={{ readOnly: true }}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Reason for Visit"
                        name="reasonForVisit"
                        value={formData.reasonForVisit}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Symptoms (Optional)"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        multiline
                        rows={2}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            py: 1.5,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            },
                        }}
                    >
                        {loading ? 'Booking...' : 'Book Appointment'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AppointmentForm;

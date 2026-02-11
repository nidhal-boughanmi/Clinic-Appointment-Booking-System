import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
    Chip,
    Rating,
    Button,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Doctor data
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Booking state
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Form state
    const [reason, setReason] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [bookingError, setBookingError] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    // Modal state
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    // Mock reviews
    const [reviews] = useState([
        {
            id: 1,
            patientName: 'John Doe',
            rating: 5,
            comment: 'Excellent doctor! Very professional and caring.',
            date: '2026-01-15',
        },
        {
            id: 2,
            patientName: 'Jane Smith',
            rating: 4,
            comment: 'Great experience. Would recommend.',
            date: '2026-01-10',
        },
        {
            id: 3,
            patientName: 'Mike Johnson',
            rating: 5,
            comment: 'Best doctor I have ever visited. Highly knowledgeable.',
            date: '2026-01-05',
        },
    ]);

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableSlots();
        }
    }, [selectedDate, id]);

    const fetchDoctor = async () => {
        try {
            const { data } = await api.get(`/doctors/${id}`);
            setDoctor(data);
        } catch (err) {
            setError('Failed to load doctor profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const { data } = await api.get(`/doctors/${id}/availability?date=${dateStr}`);
            setAvailableSlots(data.slots || []);
        } catch (err) {
            console.error('Error fetching slots:', err);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!selectedSlot) {
            setBookingError('Please select a time slot');
            return;
        }

        if (!reason.trim()) {
            setBookingError('Please provide a reason for visit');
            return;
        }

        setBookingLoading(true);
        setBookingError('');

        try {
            const appointmentData = {
                doctor: id,
                appointmentDate: selectedDate.format('YYYY-MM-DD'),
                timeSlot: selectedSlot,
                reason: reason.trim(),
                contactPhone: contactPhone || user?.phone,
                paymentMethod,
            };

            const { data } = await api.post('/appointments', appointmentData);

            setBookingDetails({
                ...data,
                doctorName: doctor.user.name,
                specialization: doctor.specialization,
            });
            setConfirmationOpen(true);

            // Reset form
            setSelectedSlot('');
            setReason('');
            setPaymentMethod('card');
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
        navigate('/appointments');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !doctor) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Doctor not found'}</Alert>
            </Container>
        );
    }

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Left Column - Doctor Info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', position: 'sticky', top: 80 }}>
                        <Avatar
                            src={doctor.user?.profileImage}
                            sx={{
                                width: 150,
                                height: 150,
                                margin: '0 auto 20px',
                                border: '4px solid #667eea',
                            }}
                        >
                            {doctor.user?.name?.charAt(0)}
                        </Avatar>

                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            Dr. {doctor.user?.name}
                        </Typography>

                        <Chip
                            label={doctor.specialization}
                            color="primary"
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                            <Rating value={averageRating} readOnly precision={0.5} />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                ({averageRating.toFixed(1)})
                            </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {reviews.length} patient reviews
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        {/* Education */}
                        <Box sx={{ mb: 3, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <SchoolIcon sx={{ mr: 1, color: '#667eea' }} />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Education
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {doctor.qualification}
                            </Typography>
                        </Box>

                        {/* Experience */}
                        <Box sx={{ mb: 3, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <WorkIcon sx={{ mr: 1, color: '#667eea' }} />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Experience
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {doctor.experience} years of practice
                            </Typography>
                        </Box>

                        {/* Consultation Fee */}
                        <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Consultation Fee
                            </Typography>
                            <Typography variant="h4" color="primary" fontWeight={700}>
                                ${doctor.consultationFee}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column - Booking & Reviews */}
                <Grid item xs={12} md={8}>
                    {/* About Section */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            About
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            {doctor.bio || `Dr. ${doctor.user?.name} is a highly experienced ${doctor.specialization} with ${doctor.experience} years of practice. Committed to providing excellent patient care and staying updated with the latest medical advancements.`}
                        </Typography>
                    </Paper>

                    {/* Booking Section */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            <CalendarMonthIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Book an Appointment
                        </Typography>

                        {!isAuthenticated && (
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Please <Button onClick={() => navigate('/login')}>login</Button> to book an appointment
                            </Alert>
                        )}

                        <Grid container spacing={3}>
                            {/* Calendar */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Select Date
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                        value={selectedDate}
                                        onChange={(newValue) => setSelectedDate(newValue)}
                                        minDate={dayjs()}
                                        sx={{
                                            width: '100%',
                                            '& .MuiPickersDay-root.Mui-selected': {
                                                bgcolor: '#667eea',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Time Slots */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Available Time Slots
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                    {selectedDate.format('MMMM DD, YYYY')}
                                </Typography>

                                {loadingSlots ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress size={30} />
                                    </Box>
                                ) : availableSlots.length === 0 ? (
                                    <Alert severity="warning">
                                        No available slots for this date
                                    </Alert>
                                ) : (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {availableSlots.map((slot) => (
                                            <Button
                                                key={slot}
                                                variant={selectedSlot === slot ? 'contained' : 'outlined'}
                                                size="small"
                                                onClick={() => setSelectedSlot(slot)}
                                                sx={{
                                                    minWidth: '80px',
                                                    bgcolor: selectedSlot === slot ? '#667eea' : 'transparent',
                                                }}
                                            >
                                                {slot}
                                            </Button>
                                        ))}
                                    </Box>
                                )}
                            </Grid>

                            {/* Booking Form */}
                            {isAuthenticated && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Reason for Visit"
                                            multiline
                                            rows={3}
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Describe your symptoms or reason for consultation..."
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Phone"
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                            placeholder={user?.phone || 'Enter phone number'}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Payment Method</InputLabel>
                                            <Select
                                                value={paymentMethod}
                                                label="Payment Method"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <MenuItem value="card">Credit/Debit Card</MenuItem>
                                                <MenuItem value="paypal">PayPal</MenuItem>
                                                <MenuItem value="cash">Cash at Clinic</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {bookingError && (
                                        <Grid item xs={12}>
                                            <Alert severity="error">{bookingError}</Alert>
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={handleBookAppointment}
                                            disabled={bookingLoading || !selectedSlot}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                py: 1.5,
                                            }}
                                        >
                                            {bookingLoading ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                `Book Appointment - $${doctor.consultationFee}`
                                            )}
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Paper>

                    {/* Reviews Section */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            <StarIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#ffa726' }} />
                            Patient Reviews ({reviews.length})
                        </Typography>

                        <List>
                            {reviews.map((review, index) => (
                                <React.Fragment key={review.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {review.patientName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {dayjs(review.date).format('MMM DD, YYYY')}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Rating value={review.rating} readOnly size="small" sx={{ my: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {review.comment}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < reviews.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Confirmation Modal */}
            <Dialog
                open={confirmationOpen}
                onClose={handleConfirmationClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h5" fontWeight={700}>
                        Appointment Confirmed!
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {bookingDetails && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Your appointment has been successfully booked
                            </Typography>

                            <Card sx={{ mt: 3, bgcolor: '#f5f7fa' }}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Doctor
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                Dr. {bookingDetails.doctorName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Specialization
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                {bookingDetails.specialization}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Date
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                {dayjs(bookingDetails.appointmentDate).format('MMM DD, YYYY')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Time
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                {bookingDetails.timeSlot}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
                                You will receive a confirmation email and SMS reminder 24 hours before your appointment.
                            </Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleConfirmationClose}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            px: 6,
                        }}
                    >
                        View My Appointments
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DoctorProfile;

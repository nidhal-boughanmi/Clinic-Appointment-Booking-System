import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [cancelDialog, setCancelDialog] = useState({ open: false, appointmentId: null });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentAPI.getAppointments();
            setAppointments(response.data.appointments);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        try {
            await appointmentAPI.cancelAppointment(cancelDialog.appointmentId, 'Patient requested cancellation');
            fetchAppointments();
            setCancelDialog({ open: false, appointmentId: null });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'completed': return 'info';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const filterAppointments = (status) => {
        return appointments.filter(apt => {
            if (activeTab === 0) return apt.status !== 'cancelled'; // Upcoming
            if (activeTab === 1) return apt.status === 'completed'; // Past
            return apt.status === 'cancelled'; // Cancelled
        });
    };

    const filteredAppointments = filterAppointments();

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
                My Appointments
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Manage your healthcare appointments
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Upcoming" />
                    <Tab label="Past" />
                    <Tab label="Cancelled" />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : filteredAppointments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No appointments found
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredAppointments.map((appointment) => (
                        <Grid item xs={12} key={appointment._id}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="h6">
                                                    {user.role === 'patient'
                                                        ? `Dr. ${appointment.doctor?.user?.name}`
                                                        : appointment.patient?.name}
                                                </Typography>
                                            </Box>
                                            {user.role === 'patient' && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {appointment.doctor?.specialization}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                {appointment.reasonForVisit}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarMonthIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                            <Chip
                                                label={appointment.status.toUpperCase()}
                                                color={getStatusColor(appointment.status)}
                                                sx={{ mb: 2 }}
                                            />
                                            {appointment.status === 'pending' && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    fullWidth
                                                    onClick={() => setCancelDialog({ open: true, appointmentId: appointment._id })}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Cancel Dialog */}
            <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, appointmentId: null })}>
                <DialogTitle>Cancel Appointment</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialog({ open: false, appointmentId: null })}>
                        No, Keep It
                    </Button>
                    <Button onClick={handleCancelAppointment} color="error" variant="contained">
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Appointments;

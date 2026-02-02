import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <LocalHospitalIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Expert Doctors',
            description: 'Access to qualified and experienced healthcare professionals',
        },
        {
            icon: <CalendarMonthIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Easy Booking',
            description: 'Book appointments quickly and manage them effortlessly',
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Patient Care',
            description: 'Personalized care and attention for every patient',
        },
        {
            icon: <VerifiedIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Trusted Platform',
            description: 'Secure and reliable healthcare appointment system',
        },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 12,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" fontWeight={700} gutterBottom>
                                Your Health, Our Priority
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                                Book appointments with top doctors instantly
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/doctors')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#667eea',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        '&:hover': { bgcolor: '#f0f0f0' },
                                    }}
                                >
                                    Find Doctors
                                </Button>
                                {!isAuthenticated && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            borderColor: 'white',
                                            color: 'white',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            '&:hover': { borderColor: '#f0f0f0', bgcolor: 'rgba(255,255,255,0.1)' },
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 400,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <LocalHospitalIcon sx={{ fontSize: 200, opacity: 0.3 }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
                    Why Choose ClinicCare?
                </Typography>
                <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                    Experience healthcare the modern way
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    p: 2,
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    bgcolor: '#f5f7fa',
                    py: 8,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Ready to Get Started?
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            Join thousands of patients who trust ClinicCare
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate(isAuthenticated ? '/doctors' : '/register')}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                px: 6,
                                py: 2,
                                fontSize: '1.1rem',
                            }}
                        >
                            {isAuthenticated ? 'Book Appointment' : 'Create Account'}
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Avatar,
    Chip,
    Rating,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredDoctors, setFeaturedDoctors] = useState([]);

    useEffect(() => {
        fetchFeaturedDoctors();
    }, []);

    const fetchFeaturedDoctors = async () => {
        try {
            const { data } = await api.get('/doctors?limit=3');
            setFeaturedDoctors(data.doctors.slice(0, 3));
        } catch (error) {
            console.error('Error fetching featured doctors:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    };

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

    const howItWorks = [
        {
            step: '1',
            icon: <PersonSearchIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Search for Doctors',
            description: 'Find doctors by name, specialization, or location',
        },
        {
            step: '2',
            icon: <EventAvailableIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Choose Time Slot',
            description: 'Select convenient date and time from available slots',
        },
        {
            step: '3',
            icon: <CheckCircleIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Confirm Booking',
            description: 'Receive instant confirmation and reminders',
        },
    ];

    return (
        <Box>
            {/* Hero Section with Search */}
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

                            {/* Search Bar */}
                            <Box
                                component="form"
                                onSubmit={handleSearch}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    p: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Search for doctors, specializations..."
                                    variant="standard"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#667eea' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { px: 2, py: 1, fontSize: '1.1rem' },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#667eea',
                                        px: 4,
                                        py: 1.5,
                                        ml: 1,
                                        '&:hover': { bgcolor: '#5568d3' },
                                    }}
                                >
                                    Search
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/doctors')}
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': { borderColor: '#f0f0f0', bgcolor: 'rgba(255,255,255,0.1)' },
                                    }}
                                >
                                    Browse All Doctors
                                </Button>
                                {!isAuthenticated && (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            bgcolor: 'white',
                                            color: '#667eea',
                                            px: 4,
                                            py: 1.5,
                                            '&:hover': { bgcolor: '#f0f0f0' },
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

            {/* Featured Doctors Section */}
            {featuredDoctors.length > 0 && (
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
                        Featured Doctors
                    </Typography>
                    <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                        Top-rated healthcare professionals
                    </Typography>

                    <Grid container spacing={4}>
                        {featuredDoctors.map((doctor) => (
                            <Grid item xs={12} md={4} key={doctor._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                    onClick={() => navigate(`/doctors?id=${doctor._id}`)}
                                >
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <Avatar
                                            src={doctor.user?.profileImage}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                margin: '0 auto 20px',
                                                border: '4px solid #667eea',
                                            }}
                                        >
                                            {doctor.user?.name?.charAt(0)}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Dr. {doctor.user?.name}
                                        </Typography>
                                        <Chip
                                            label={doctor.specialization}
                                            color="primary"
                                            size="small"
                                            sx={{ mb: 2 }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                            <Rating value={doctor.rating} readOnly precision={0.5} />
                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                ({doctor.rating})
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {doctor.experience} years experience
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                            ${doctor.consultationFee}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/doctors')}
                            sx={{ px: 6 }}
                        >
                            View All Doctors
                        </Button>
                    </Box>
                </Container>
            )}

            {/* How It Works Section */}
            <Box sx={{ bgcolor: '#f5f7fa', py: 10 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
                        How It Works
                    </Typography>
                    <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8 }}>
                        Book your appointment in 3 simple steps
                    </Typography>

                    <Grid container spacing={6} sx={{ position: 'relative' }}>
                        {/* Desktop Timeline Connector */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                position: 'absolute',
                                top: '80px',
                                left: '20%',
                                right: '20%',
                                height: '4px',
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                                zIndex: 0,
                            }}
                        />

                        {howItWorks.map((step, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        textAlign: 'center',
                                        px: 2,
                                    }}
                                >
                                    {/* Step Number Circle */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            zIndex: 1,
                                            margin: '0 auto 24px',
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                                            transition: 'transform 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            fontWeight={700}
                                            sx={{ color: 'white' }}
                                        >
                                            {step.step}
                                        </Typography>
                                    </Box>

                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            mb: 3,
                                            '& svg': {
                                                fontSize: 56,
                                                transition: 'transform 0.3s',
                                            },
                                            '&:hover svg': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    {/* Title */}
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        gutterBottom
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {step.title}
                                    </Typography>

                                    {/* Description */}
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.8 }}
                                    >
                                        {step.description}
                                    </Typography>

                                    {/* Mobile Connector Arrow */}
                                    {index < howItWorks.length - 1 && (
                                        <Box
                                            sx={{
                                                display: { xs: 'block', md: 'none' },
                                                textAlign: 'center',
                                                mt: 4,
                                                fontSize: '2rem',
                                                color: '#667eea',
                                            }}
                                        >
                                            ↓
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Call to Action Button */}
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate(isAuthenticated ? '/doctors' : '/register')}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                px: 6,
                                py: 2,
                                fontSize: '1.1rem',
                                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
                                },
                            }}
                        >
                            {isAuthenticated ? 'Find a Doctor Now' : 'Get Started Today'}
                        </Button>
                    </Box>
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

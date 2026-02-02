import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { doctorAPI } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import SearchIcon from '@mui/icons-material/Search';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        specialization: '',
    });

    const specializations = [
        'All Specializations',
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Pediatrics',
        'Orthopedics',
        'Psychiatry',
        'General Practice',
    ];

    useEffect(() => {
        fetchDoctors();
    }, [filters]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.specialization && filters.specialization !== 'All Specializations') {
                params.specialization = filters.specialization;
            }

            const response = await doctorAPI.getAllDoctors(params);
            setDoctors(response.data.doctors);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Find Your Doctor
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Browse our qualified healthcare professionals
                </Typography>
            </Box>

            {/* Filters */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search by doctor name..."
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            select
                            label="Specialization"
                            name="specialization"
                            value={filters.specialization}
                            onChange={handleFilterChange}
                        >
                            {specializations.map((spec) => (
                                <MenuItem key={spec} value={spec}>
                                    {spec}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Box>

            {/* Results */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : doctors.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No doctors found
                    </Typography>
                </Box>
            ) : (
                <>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Found {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
                    </Typography>
                    <Grid container spacing={3}>
                        {doctors.map((doctor) => (
                            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                                <DoctorCard doctor={doctor} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default Doctors;

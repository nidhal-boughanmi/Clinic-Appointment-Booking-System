import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Pagination,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    Alert,
    Paper,
    Slider,
    Button,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../leaflet.css';
import DoctorCard from '../components/DoctorCard';
import api from '../services/api';

// Fix for Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [view, setView] = useState('list');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [location, setLocation] = useState('');
    const [feeRange, setFeeRange] = useState([0, 500]);
    const [availability, setAvailability] = useState('all');

    const specializations = [
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Pediatrician',
        'Psychiatrist',
        'Orthopedic',
        'General Physician',
        'Dentist',
        'Gynecologist',
        'ENT Specialist',
    ];

    const itemsPerPage = 9;

    useEffect(() => {
        fetchDoctors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, specialization, feeRange, availability, page]);

    const fetchDoctors = async () => {
        setLoading(true);
        setError('');
        try {
            let query = '';
            if (searchQuery) query += `search=${encodeURIComponent(searchQuery)}&`;
            if (specialization) query += `specialization=${encodeURIComponent(specialization)}&`;
            if (feeRange[0] > 0) query += `minFee=${feeRange[0]}&`;
            if (feeRange[1] < 500) query += `maxFee=${feeRange[1]}&`;

            const { data } = await api.get(`/doctors?${query}`);

            // Filter by availability if needed
            let filteredDoctors = data.doctors;
            if (availability === 'available') {
                filteredDoctors = filteredDoctors.filter((doc) => doc.isAvailable);
            }

            // Pagination
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

            setDoctors(paginatedDoctors);
            setTotalPages(Math.ceil(filteredDoctors.length / itemsPerPage));
        } catch (err) {
            setError('Failed to fetch doctors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFeeChange = (event, newValue) => {
        setFeeRange(newValue);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSpecialization('');
        setLocation('');
        setFeeRange([0, 500]);
        setAvailability('all');
        setPage(1);
    };

    // Mock map center (you can use a geolocation API later)
    const mapCenter = [40.7128, -74.0060]; // New York coordinates as example

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Find a Doctor
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Search for doctors by name, specialization, or filter by your preferences
            </Typography>

            <Grid container spacing={3}>
                {/* Filters Sidebar */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Filters
                        </Typography>

                        {/* Search */}
                        <TextField
                            fullWidth
                            placeholder="Search doctors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Specialization */}
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Specialization</InputLabel>
                            <Select
                                value={specialization}
                                label="Specialization"
                                onChange={(e) => setSpecialization(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {specializations.map((spec) => (
                                    <MenuItem key={spec} value={spec}>
                                        {spec}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Location */}
                        <TextField
                            fullWidth
                            label="Location"
                            placeholder="City or ZIP code"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOnIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Fee Range */}
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            Consultation Fee: ${feeRange[0]} - ${feeRange[1]}
                        </Typography>
                        <Slider
                            value={feeRange}
                            onChange={handleFeeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={500}
                            sx={{ mb: 3 }}
                        />

                        {/* Availability */}
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Availability</InputLabel>
                            <Select
                                value={availability}
                                label="Availability"
                                onChange={(e) => setAvailability(e.target.value)}
                            >
                                <MenuItem value="all">All Doctors</MenuItem>
                                <MenuItem value="available">Available Only</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                    </Paper>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={9}>
                    {/* View Toggle */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                            {doctors.length} doctors found
                        </Typography>
                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={(e, newView) => newView && setView(newView)}
                            size="small"
                        >
                            <ToggleButton value="list">
                                <ViewListIcon sx={{ mr: 1 }} />
                                List
                            </ToggleButton>
                            <ToggleButton value="map">
                                <MapIcon sx={{ mr: 1 }} />
                                Map
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* Error State */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* List View */}
                    {!loading && !error && view === 'list' && (
                        <>
                            {doctors.length === 0 ? (
                                <Alert severity="info">
                                    No doctors found matching your criteria. Try adjusting the filters.
                                </Alert>
                            ) : (
                                <>
                                    <Grid container spacing={3}>
                                        {doctors.map((doctor) => (
                                            <Grid item xs={12} sm={6} lg={4} key={doctor._id}>
                                                <DoctorCard doctor={doctor} />
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                            <Pagination
                                                count={totalPages}
                                                page={page}
                                                onChange={handlePageChange}
                                                color="primary"
                                                size="large"
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* Map View */}
                    {!loading && !error && view === 'map' && (
                        <Paper sx={{ height: '600px', overflow: 'hidden' }}>
                            <MapContainer
                                center={mapCenter}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {doctors.map((doctor, index) => (
                                    <Marker
                                        key={doctor._id}
                                        position={[
                                            mapCenter[0] + (Math.random() - 0.5) * 0.1,
                                            mapCenter[1] + (Math.random() - 0.5) * 0.1,
                                        ]}
                                    >
                                        <Popup>
                                            <Box sx={{ p: 1 }}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    Dr. {doctor.user?.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {doctor.specialization}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Fee: ${doctor.consultationFee}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    fullWidth
                                                    sx={{ mt: 1 }}
                                                    onClick={() => window.location.href = `/doctors?id=${doctor._id}`}
                                                >
                                                    View Profile
                                                </Button>
                                            </Box>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Doctors;

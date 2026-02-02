import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1a1a2e',
                color: 'white',
                py: 6,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocalHospitalIcon sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight={700}>
                                ClinicCare
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Your trusted partner in healthcare. Book appointments with top doctors easily and efficiently.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/" color="rgba(255,255,255,0.7)" underline="hover">
                                Home
                            </Link>
                            <Link href="/doctors" color="rgba(255,255,255,0.7)" underline="hover">
                                Find Doctors
                            </Link>
                            <Link href="/appointments" color="rgba(255,255,255,0.7)" underline="hover">
                                My Appointments
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Contact
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Email: support@cliniccare.com
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Phone: +1 (555) 123-4567
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                        © {new Date().getFullYear()} ClinicCare. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;

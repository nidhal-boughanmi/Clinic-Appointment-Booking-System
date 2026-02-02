import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Chip,
    Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: '#667eea',
                            width: 60,
                            height: 60,
                            mr: 2,
                        }}
                    >
                        <LocalHospitalIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            Dr. {doctor.user?.name}
                        </Typography>
                        <Chip
                            label={doctor.specialization}
                            size="small"
                            color="primary"
                            sx={{ mt: 0.5 }}
                        />
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {doctor.qualification}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {doctor.experience} years
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon fontSize="small" sx={{ mr: 0.5, color: '#FFD700' }} />
                        <Typography variant="body2" color="text.secondary">
                            {doctor.rating || 'New'}
                        </Typography>
                    </Box>
                </Box>

                {doctor.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {doctor.bio.substring(0, 100)}
                        {doctor.bio.length > 100 && '...'}
                    </Typography>
                )}

                <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                    sx={{ mt: 2 }}
                >
                    ${doctor.consultationFee}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/doctors/${doctor._id}`)}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                    }}
                >
                    Book Appointment
                </Button>
            </CardActions>
        </Card>
    );
};

export default DoctorCard;

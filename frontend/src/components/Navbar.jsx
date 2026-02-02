import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <LocalHospitalIcon sx={{ mr: 1, fontSize: 32 }} />
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 700,
                            letterSpacing: 1,
                        }}
                    >
                        ClinicCare
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button color="inherit" component={Link} to="/">
                            Home
                        </Button>
                        <Button color="inherit" component={Link} to="/doctors">
                            Doctors
                        </Button>

                        {isAuthenticated ? (
                            <>
                                <Button color="inherit" component={Link} to="/appointments">
                                    Appointments
                                </Button>
                                {user?.role === 'admin' && (
                                    <Button color="inherit" component={Link} to="/admin">
                                        Admin
                                    </Button>
                                )}
                                <IconButton
                                    onClick={handleMenu}
                                    color="inherit"
                                    sx={{ ml: 1 }}
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem disabled>
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.name}
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#667eea',
                                        '&:hover': { bgcolor: '#f0f0f0' },
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;

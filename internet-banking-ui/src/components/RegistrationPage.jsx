import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Container, Box, Paper, Typography, TextField, Button, 
    CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem,
    InputAdornment, IconButton, Divider, Chip, keyframes
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Phone as PhoneIcon,
    Home as AddressIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    AccountBalance as BankIcon
} from '@mui/icons-material';

const api = axios.create({ baseURL: '/api' });

// Define floating animation
const floatAnimation = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
`;

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
        accountType: 'SAVINGS'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/customers/register', {
                customerName: `${formData.firstName} ${formData.lastName}`,
                emailId: formData.email,
                phoneNo: formData.phoneNumber,
                address: formData.address,
                age: 25, // Default age since it's not in the form
                gender: 'OTHER', // Default gender since it's not in the form
                user: {
                    password: formData.password
                },
                accountType: formData.accountType
            });

            if (response.status === 201) {
                navigate('/login', { 
                    state: { message: 'Registration successful! Please login with your credentials.' }
                });
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response) {
                // Server responded with error status
                if (typeof err.response.data === 'string') {
                    setError(err.response.data);
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError(`Registration failed. Server error: ${err.response.status} ${err.response.statusText}`);
                }
            } else if (err.request) {
                // Request was made but no response received
                setError('Cannot connect to server. Please check if the backend server is running on http://localhost:8080');
            } else {
                // Something else happened
                setError(`Registration failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
                py: 4
            }}
        >
            {/* Background decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '15%',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    animation: `${floatAnimation} 6s ease-in-out infinite`
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '10%',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    animation: `${floatAnimation} 8s ease-in-out infinite reverse`
                }}
            />

            <Container component="main" maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: { xs: 3, md: 4 }, 
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <BankIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                        </Box>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 700, 
                                color: 'text.primary',
                                mb: 1,
                                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Create Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Join SecureBank and start managing your finances
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                            {/* First Name */}
                            <TextField
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                        }
                                    }
                                }}
                            />

                            {/* Last Name */}
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                        }
                                    }
                                }}
                            />

                            {/* Email */}
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                        }
                                    }
                                }}
                            />

                            {/* Phone Number */}
                            <TextField
                                required
                                fullWidth
                                id="phoneNumber"
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Address - Full Width */}
                        <TextField
                            required
                            fullWidth
                            id="address"
                            label="Address"
                            name="address"
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={handleInputChange}
                            sx={{
                                mt: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '&.Mui-focused': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AddressIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Account Type */}
                        <FormControl 
                            fullWidth 
                            sx={{ 
                                mt: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px'
                                }
                            }}
                        >
                            <InputLabel id="accountType-label">Account Type</InputLabel>
                            <Select
                                labelId="accountType-label"
                                id="accountType"
                                name="accountType"
                                value={formData.accountType}
                                label="Account Type"
                                onChange={handleInputChange}
                            >
                                <MenuItem value="SAVINGS">Savings Account</MenuItem>
                                <MenuItem value="CURRENT">Current Account</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mt: 3 }}>
                            {/* Password */}
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                        }
                                    }
                                }}
                            />

                            {/* Confirm Password */}
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mt: 3,
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        {/* Divider */}
                        <Divider sx={{ my: 3 }}>
                            <Chip 
                                label="OR" 
                                size="small" 
                                sx={{ 
                                    backgroundColor: 'background.paper',
                                    color: 'text.secondary',
                                    fontWeight: 600
                                }} 
                            />
                        </Divider>

                        {/* Login Link */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    style={{ 
                                        color: '#2563eb', 
                                        textDecoration: 'none', 
                                        fontWeight: 600,
                                        borderBottom: '1px solid transparent',
                                        transition: 'border-bottom-color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.borderBottomColor = '#2563eb'}
                                    onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                                >
                                    Sign in here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegistrationPage;

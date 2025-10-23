import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Stack } from '@mui/material';

const HomePage = () => (
    <Box 
        sx={{
            // This Box will take up the full available screen space
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            // The clean gradient background you requested
            background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
        }}
    >
        {/* We will add the navbar here in the next step */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Container maxWidth="md">
                <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 700, 
                        color: 'primary.main',
                        mb: 2,
                    }}
                >
                    Welcome to Internet Banking
                </Typography>
                <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    sx={{ mb: 4 }}
                >
                    Manage your money safely and smartly, anytime, anywhere.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button 
                        variant="contained" 
                        size="large" 
                        component={Link} 
                        to="/login"
                        // Rounded buttons with shadow
                        sx={{ borderRadius: '50px', px: 5, py: 1.5, boxShadow: 3 }}
                    >
                        Login
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        component={Link} 
                        to="/register"
                        sx={{ borderRadius: '50px', px: 5, py: 1.5 }}
                    >
                        Register
                    </Button>
                </Stack>
            </Container>
        </Box>
    </Box>
);

export default HomePage;
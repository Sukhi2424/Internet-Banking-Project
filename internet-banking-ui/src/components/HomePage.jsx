import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, Button, Container, Stack, Grid, Card, CardContent, 
  useTheme, useMediaQuery, Paper, Chip, keyframes
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  AccountBalance as BankIcon,
  TrendingUp as TrendingIcon,
  Shield as ShieldIcon,
  Phone as PhoneIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';

// Define floating animation
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Bank-Grade Security',
      description: 'Your money and data are protected with enterprise-level encryption and security protocols.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Lightning Fast',
      description: 'Transfer money instantly, check balances in real-time, and manage your finances efficiently.'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock customer support team.'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Mobile Ready',
      description: 'Access your accounts anywhere, anytime with our responsive web application.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: <TrendingIcon /> },
    { label: 'Transactions Daily', value: '100K+', icon: <BankIcon /> },
    { label: 'Security Level', value: '99.9%', icon: <ShieldIcon /> },
    { label: 'Uptime', value: '99.9%', icon: <ComputerIcon /> }
  ];

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="fade-in"
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: `${floatAnimation} 6s ease-in-out infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          animation: `${floatAnimation} 8s ease-in-out infinite reverse`
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            minHeight: '100vh',
            py: 8
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Hero Content */}
            <Grid item xs={12} lg={6}>
              <Box className="slide-in-left">
                <Chip 
                  label="✨ New Banking Experience" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    color: 'white',
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.1
                  }}
                >
                  Banking Made
                  <Typography 
                    component="span" 
                    variant="h1" 
                    sx={{ 
                      display: 'block',
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                      fontSize: 'inherit'
                    }}
                  >
                    Simple & Secure
                  </Typography>
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                    maxWidth: '500px'
                  }}
                >
                  Experience the future of digital banking with instant transfers, 
                  real-time notifications, and enterprise-grade security.
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  sx={{ mb: 4 }}
                >
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={Link} 
                    to="/register"
                    sx={{ 
                      borderRadius: '50px', 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px rgba(245, 158, 11, 0.5)'
                      }
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    component={Link} 
                    to="/login"
                    sx={{ 
                      borderRadius: '50px', 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        transform: 'translateY(-3px)',
                        borderWidth: 2
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} md={3} key={index}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          color: 'white',
                          opacity: 0.9
                        }}
                      >
                        <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Hero Visual */}
            <Grid item xs={12} lg={6}>
              <Box 
                className="slide-in-right"
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mt: { xs: 4, lg: 0 }
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    p: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    maxWidth: 400,
                    width: '100%'
                  }}
                >
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <BankIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Secure Digital Banking
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                      Join thousands of users who trust our platform for their daily banking needs.
                    </Typography>
                    <Box 
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        p: 2,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        "The most intuitive banking experience I've ever had."
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              textAlign: 'center', 
              color: 'white', 
              mb: 6,
              fontWeight: 700
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card 
                  className="hover-lift"
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Container, IconButton, 
  Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme,
  Box, Avatar
} from '@mui/material';
import { 
  AccountBalanceWallet as BankIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Calculate as CalculateIcon,
  Assessment as ReportsIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

const Navbar = ({ auth, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = auth.user ? (
    auth.role === 'CUSTOMER' ? [
      { label: 'My Account', path: '/account/summary', icon: <AccountIcon /> }
    ] : [
      { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
      { label: 'Manage Users', path: '/admin/manage-users', icon: <PeopleIcon /> },
      { label: 'Calculate Interest', path: '/admin/calculate-interest', icon: <CalculateIcon /> },
      { label: 'Reports', path: '/admin/reports', icon: <ReportsIcon /> }
    ]
  ) : [];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Button
              component={NavLink}
              to={item.path}
              fullWidth
              startIcon={item.icon}
              onClick={handleDrawerToggle}
              sx={{
                justifyContent: 'flex-start',
                p: 2,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRight: '4px solid white'
                }
              }}
            >
              {item.label}
            </Button>
          </ListItem>
        ))}
        {auth.user && (
          <ListItem disablePadding>
            <Button
              fullWidth
              onClick={() => {
                handleDrawerToggle();
                onLogout();
              }}
              sx={{
                justifyContent: 'flex-start',
                p: 2,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '70px' }}>
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  borderRadius: '12px',
                  p: 1,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BankIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
              </Box>
              <Typography 
                variant="h6" 
                component={Link} 
                to="/" 
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none', 
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Internet Banking
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Button 
                    key={item.path}
                    color="primary" 
                    component={NavLink} 
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        transform: 'translateY(-2px)'
                      },
                      '&.active': {
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: 'primary.main'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* User section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {auth.user ? (
                <>
                  {!isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' 
                        }}
                      >
                        {auth.user.customerName?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', lg: 'block' } }}>
                        {auth.user.customerName}
                      </Typography>
                    </Box>
                  )}
                  {!isMobile && (
                    <Button 
                      variant="outlined" 
                      onClick={onLogout} 
                      sx={{ 
                        borderRadius: '25px',
                        px: 3,
                        fontWeight: 600,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                        }
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    color="primary" 
                    component={NavLink} 
                    to="/login"
                    sx={{
                      fontWeight: 600,
                      borderRadius: '12px',
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.08)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    component={NavLink} 
                    to="/register" 
                    sx={{ 
                      borderRadius: '25px',
                      px: 3,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
                      }
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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 280,
            border: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
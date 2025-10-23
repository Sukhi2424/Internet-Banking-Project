import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Navbar = ({ auth, onLogout }) => (
  // Use a static white AppBar for a consistent look on all pages
  <AppBar position="static" elevation={1} sx={{ backgroundColor: '#ffffff' }}>
    <Container maxWidth="xl">
        <Toolbar disableGutters>
            <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 1, display: { xs: 'none', md: 'flex' } }} />
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'primary.main', textDecoration: 'none', fontWeight: 'bold' }}>
                Internet Banking
            </Typography>
            {auth.user ? (
                <>
                    {auth.role === 'CUSTOMER' && ( <Button color="primary" component={NavLink} to="/account/summary">My Account</Button> )}
                    {auth.role === 'ADMIN' && (
                        <>
                            <Button color="primary" component={NavLink} to="/admin">Dashboard</Button>
                            <Button color="primary" component={NavLink} to="/admin/manage-users">Manage Users</Button>
                            <Button color="primary" component={NavLink} to="/admin/calculate-interest">Calculate Interest</Button>
                            <Button color="primary" component={NavLink} to="/admin/reports">Reports</Button>
                        </>
                    )}
                    <Button variant="outlined" onClick={onLogout} sx={{ ml: 2, borderRadius: '20px' }}>Logout</Button>
                </>
            ) : (
                <>
                    <Button color="primary" component={NavLink} to="/login">Login</Button>
                    <Button variant="contained" component={NavLink} to="/register" sx={{ ml: 2, borderRadius: '20px', boxShadow: 3 }}>Register</Button>
                </>
            )}
        </Toolbar>
    </Container>
  </AppBar>
);

export default Navbar;
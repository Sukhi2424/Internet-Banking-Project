import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// MUI Imports for the layout
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddCardIcon from '@mui/icons-material/AddCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person'; // <-- THIS IS THE FIX

const AccountLayout = () => {
    const activeLinkStyle = {
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
        color: '#1976d2',
        borderRight: '3px solid #1976d2',
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <Paper elevation={2} sx={{ width: 240, mr: 3 }}>
                <List component="nav">
                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/account/profile"
                            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        >
                            <ListItemIcon><PersonIcon /></ListItemIcon>
                            <ListItemText primary="My Profile" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/account/summary"
                            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        >
                            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary="Account Summary" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/account/transactions"
                            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        >
                            <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
                            <ListItemText primary="Deposit / Withdraw" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/account/transfer"
                            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        >
                            <ListItemIcon><CompareArrowsIcon /></ListItemIcon>
                            <ListItemText primary="Transfer Money" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/account/create"
                            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        >
                            <ListItemIcon><AddCardIcon /></ListItemIcon>
                            <ListItemText primary="Open New Account" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Paper>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AccountLayout;
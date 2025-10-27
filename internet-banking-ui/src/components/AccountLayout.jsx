import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
    Box, Paper, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Typography, Divider, useTheme, alpha 
} from '@mui/material';
import {
    Person as PersonIcon,
    AccountBalance as AccountIcon,
    CompareArrows as TransferIcon,
    AddCard as AddCardIcon,
    Receipt as ReceiptIcon,
    TrendingUp as TrendingIcon
} from '@mui/icons-material';

const AccountLayout = () => {
    const theme = useTheme();

    const menuItems = [
        { 
            path: '/account/profile', 
            icon: <PersonIcon />, 
            label: 'My Profile',
            description: 'View and edit your personal information'
        },
        { 
            path: '/account/summary', 
            icon: <AccountIcon />, 
            label: 'Account Summary',
            description: 'Overview of your accounts and balances'
        },
        { 
            path: '/account/transactions', 
            icon: <ReceiptIcon />, 
            label: 'Deposit / Withdraw',
            description: 'Manage your account transactions'
        },
        { 
            path: '/account/transfer', 
            icon: <TransferIcon />, 
            label: 'Transfer Money',
            description: 'Send money to other accounts'
        },
        { 
            path: '/account/create', 
            icon: <AddCardIcon />, 
            label: 'Open New Account',
            description: 'Create additional bank accounts'
        }
    ];

    return (
        <Box sx={{ display: 'flex', gap: 3, minHeight: '70vh' }}>
            {/* Enhanced Sidebar Navigation */}
            <Paper 
                elevation={0}
                className="sidebar-nav glass-card"
                sx={{ 
                    width: 280, 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <Box 
                    sx={{ 
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                        p: 3,
                        color: 'white',
                        textAlign: 'center'
                    }}
                >
                    <TrendingIcon sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Banking Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Manage your finances
                    </Typography>
                </Box>

                <List component="nav" sx={{ p: 2 }}>
                    {menuItems.map((item, index) => (
                        <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton 
                                component={NavLink} 
                                to={item.path}
                                className="sidebar-nav-item"
                                sx={{
                                    borderRadius: '16px',
                                    p: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                        transform: 'translateX(8px)',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                                    },
                                    '&.active': {
                                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                        transform: 'translateX(8px)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white'
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        minWidth: '40px',
                                        color: 'primary.main',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                            {item.label}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.7, mt: 0.5 }}>
                                            {item.description}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Bottom section */}
                <Box sx={{ p: 2, mt: 'auto' }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box 
                        sx={{ 
                            textAlign: 'center',
                            p: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: '12px',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            Need Help?
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                            Contact our 24/7 support team
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Main Content Area */}
            <Box 
                component="main" 
                className="fade-in"
                sx={{ 
                    flexGrow: 1,
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    p: 3,
                    minHeight: '70vh'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default AccountLayout;

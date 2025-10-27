import React, { useState, useEffect } from 'react';
import axios from 'axios';

// MUI Imports for a professional dashboard layout
import { 
    Paper, Typography, Grid, Card, CardContent, CircularProgress, Box, 
    Alert, Tabs, Tab, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Chart.js Imports
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const api = axios.create({ baseURL: '/api' });

// A small, reusable component for our stat cards
const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
        <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: color, color: '#fff', mr: 2 }}>
            {icon}
        </Box>
        <Box>
            <Typography color="text.secondary">{title}</Typography>
            <Typography variant="h5" component="div">{value}</Typography>
        </Box>
    </Card>
);


const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0); // State to control the active tab

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch both stats and pending users at the same time
            const [statsRes, pendingRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/pending-customers')
            ]);
            setStats(statsRes.data);
            setPending(pendingRes.data);
        } catch (err) {
            setError('Failed to load dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (customerId, action) => {
        try {
            await api.post(`/admin/customers/${customerId}/${action}`);
            fetchData(); // Refresh all data after an action
        } catch (err) { 
            console.error(`Failed to ${action} customer:`, err); 
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) return <Alert severity="error">{error}</Alert>;
    
    const chartData = { /* ... chart data from previous step ... */ };
    const chartOptions = { /* ... chart options from previous step ... */ };

    if (stats) {
        chartData.datasets = [
            { label: 'Total Deposits', data: [stats.totalDepositVolume], backgroundColor: 'rgba(75, 192, 192, 0.6)' },
            { label: 'Total Withdrawals', data: [stats.totalWithdrawalVolume], backgroundColor: 'rgba(255, 99, 132, 0.6)' },
        ];
    }


    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>Admin Panel</Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Dashboard" />
                    <Tab label="Approve Users" />
                </Tabs>
            </Box>

            {/* Dashboard Analytics Content */}
            {tabValue === 0 && stats && (
                <Box sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Customers" value={stats.totalCustomers} icon={<PeopleIcon />} color="primary.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={<PendingActionsIcon />} color="warning.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Deposits" value={`$${stats.totalDepositVolume.toFixed(2)}`} icon={<ArrowUpwardIcon />} color="success.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Withdrawals" value={`$${stats.totalWithdrawalVolume.toFixed(2)}`} icon={<ArrowDownwardIcon />} color="error.main" />
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <Bar options={chartOptions} data={chartData} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Approve Users Content */}
            {tabValue === 1 && (
                <Box sx={{ pt: 3 }}>
                    <List>
                        {pending.length > 0 ? pending.map(c => (
                            <ListItem key={c.customerId} divider secondaryAction={
                                <>
                                    <IconButton edge="end" color="success" onClick={() => handleAction(c.customerId, 'approve')}><CheckCircleIcon /></IconButton>
                                    <IconButton edge="end" color="error" onClick={() => handleAction(c.customerId, 'decline')}><CancelIcon /></IconButton>
                                </>
                            }>
                                <ListItemText primary={c.customerName} secondary={c.emailId} />
                            </ListItem>
                        )) : <Typography>No pending registrations.</Typography>}
                    </List>
                </Box>
            )}
        </Paper>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// MUI Imports
import { 
    Paper, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, 
    CircularProgress, Box, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const api = axios.create({ baseURL: '/api' });

const ManageUsersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/customers');
            setCustomers(response.data);
        } catch (err) {
            setError('Failed to fetch customer data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this user and all their associated data?')) {
            try {
                await api.delete(`/admin/customers/${customerId}`);
                fetchCustomers(); // Refresh the list after deletion
            } catch (err) {
                setError('Failed to delete user.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Users</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total Balance</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.customerId}>
                                <TableCell>{customer.customerId}</TableCell>
                                <TableCell>{customer.customerName}</TableCell>
                                <TableCell>{customer.emailId}</TableCell>
                                <TableCell>{customer.status}</TableCell>
                                
                                {/* --- THIS IS THE CORRECTED LINE --- */}
                                <TableCell>{`$${customer.totalBalance.toFixed(2)}`}</TableCell>
                                
                                <TableCell align="right">
                                    <IconButton 
                                        color="error" 
                                        onClick={() => handleDelete(customer.customerId)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ManageUsersPage;

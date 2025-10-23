import React, { useState } from 'react';
import axios from 'axios';

// MUI Imports
import {
    Paper, Typography, TextField, Box, Button, CircularProgress, Alert
} from '@mui/material';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const TermAccountForm = ({ customerId }) => {
    const [formData, setFormData] = useState({
        interestRate: 7.5,
        balance: 5000,
        dateOfOpening: new Date().toISOString().slice(0, 10),
        months: 12,
        penaltyAmount: 100
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: '', message: '' });
        try {
            // We need to pass the customerId to create the account
            await api.post(`/accounts/term/${customerId}`, formData);
            setFeedback({ type: 'success', message: 'Term Account created successfully!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Failed to create Term Account.' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Open a New Term Account</Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Initial Balance" 
                    name="balance" 
                    type="number" 
                    value={formData.balance} 
                    onChange={handleChange} 
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Interest Rate (%)" 
                    name="interestRate" 
                    type="number" 
                    value={formData.interestRate} 
                    onChange={handleChange} 
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Term in Months" 
                    name="months" 
                    type="number" 
                    value={formData.months} 
                    onChange={handleChange} 
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Term Account'}
                </Button>
            </Box>
            {feedback.message && 
                <Alert severity={feedback.type} sx={{ mt: 3 }} onClose={() => setFeedback({type: '', message: ''})}>
                    {feedback.message}
                </Alert>
            }
        </Paper>
    );
};

export default TermAccountForm;
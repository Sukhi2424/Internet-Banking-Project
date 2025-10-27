import React, { useState } from 'react';
import axios from 'axios';

// MUI Imports for the form and feedback
import { 
    Paper, Typography, TextField, Box, Button, 
    CircularProgress, Alert 
} from '@mui/material';

const api = axios.create({ baseURL: '/api' });

const CalculateInterestPage = () => {
    const [accountId, setAccountId] = useState('');
    const [interest, setInterest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInterest(null);
        try {
            const response = await api.get(`/admin/${accountId}/interest`);
            setInterest(response.data);
        } catch (err) {
            setError('Failed to calculate interest. Please check the account ID.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>Calculate Interest</Typography>
            <Typography color="text.secondary" sx={{mb: 2}}>
                Enter an account ID to calculate the interest due for one year based on its current balance and rate.
            </Typography>
            <Box component="form" onSubmit={handleCalculate}>
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Account ID" 
                    type="number" 
                    value={accountId} 
                    onChange={(e) => setAccountId(e.target.value)} 
                    required
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate'}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
            
            {interest !== null && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography>
                        Calculated Interest Due: <strong>${interest.toFixed(2)}</strong>
                    </Typography>
                </Alert>
            )}
        </Paper>
    );
};

export default CalculateInterestPage;

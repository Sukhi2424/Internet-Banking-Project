import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // <-- IMPORT SWEETALERT2

// MUI Imports
import { 
    Paper, Typography, TextField, Box, Button, CircularProgress, Alert, 
    Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const TransactionsPage = ({ user, onTransactionSuccess }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [loading, setLoading] = useState(true);
    const [transactionAmount, setTransactionAmount] = useState('');
    
    // We no longer need the 'feedback' state

    const fetchAccounts = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get(`/customers/${user.customerId}/accounts`);
            setAccounts(response.data);
            if (response.data.length > 0) {
                setSelectedAccountId(response.data[0].accountId);
            }
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [user, onTransactionSuccess]); // Refresh when parent signals a change

    const handleTransaction = async (type) => {
        if (!selectedAccountId || !transactionAmount) {
            Swal.fire({ // <-- NEW ALERT FOR VALIDATION
                icon: 'warning',
                title: 'Input Required',
                text: 'Please select an account and enter an amount.',
            });
            return;
        }

        try {
            let response;
            if (type === 'deposit') {
                response = await api.post(`/accounts/${selectedAccountId}/deposit?amount=${transactionAmount}`);
            } else { // withdrawal
                const reqBody = { amount: parseFloat(transactionAmount), username: user.emailId, password: 'password123' };
                response = await api.post(`/accounts/${selectedAccountId}/withdraw`, reqBody);
            }

            // --- THIS IS THE NEW SUCCESS ALERT ---
            Swal.fire({
                icon: 'success',
                title: 'Transaction Successful!',
                text: `Your new balance is $${response.data.updatedAccount.balance.toFixed(2)}`,
                timer: 2000, // Auto close after 2 seconds
                showConfirmButton: false
            });
            
            setTransactionAmount('');
            if(onTransactionSuccess) onTransactionSuccess(); // Notify parent to refresh data
            
        } catch (error) {
            // --- THIS IS THE NEW ERROR ALERT ---
            Swal.fire({
                icon: 'error',
                title: 'Transaction Failed',
                text: error.response?.data?.transaction?.transactionRemarks || 'An unexpected error occurred.',
            });
        }
    };

    if (loading) return <CircularProgress />;
    if (accounts.length === 0) return <Alert severity="info">You have no accounts to perform transactions on.</Alert>;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Deposit / Withdraw</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Account</InputLabel>
                <Select
                    value={selectedAccountId}
                    label="Select Account"
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                >
                    {accounts.map(acc => (
                        <MenuItem key={acc.accountId} value={acc.accountId}>
                            Account #{acc.accountId} ({acc.accountType === 'SAVINGS' ? 'Savings' : 'Term'}) - ${acc.balance.toFixed(2)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField 
                fullWidth 
                margin="normal" 
                label="Amount" 
                type="number" 
                value={transactionAmount} 
                onChange={(e) => setTransactionAmount(e.target.value)} 
            />
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => handleTransaction('deposit')} disabled={!transactionAmount}>Deposit</Button>
                <Button variant="contained" color="warning" onClick={() => handleTransaction('withdraw')} disabled={!transactionAmount}>Withdraw</Button>
            </Box>
            {/* The old <Alert> component has been removed */}
        </Paper>
    );
};

export default TransactionsPage;
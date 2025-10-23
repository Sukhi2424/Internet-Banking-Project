import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // <-- IMPORT SWEETALERT2

// MUI Imports
import {
    Paper, Typography, TextField, Box, Button, CircularProgress, Alert,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const TransferMoneyPage = ({ user, onTransactionSuccess }) => {
    const [accounts, setAccounts] = useState([]);
    const [fromAccountId, setFromAccountId] = useState('');
    const [loading, setLoading] = useState(true);
    const [transferAmount, setTransferAmount] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    // We no longer need the 'feedback' state

    const fetchAccounts = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get(`/customers/${user.customerId}/accounts`);
            setAccounts(response.data);
            if (response.data.length > 0) {
                // Default to the first SAVINGS account for transfers
                const firstSavings = response.data.find(acc => acc.accountType === 'SAVINGS');
                if (firstSavings) {
                    setFromAccountId(firstSavings.accountId);
                }
            }
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // This will now re-fetch accounts whenever a transaction happens anywhere in the dashboard
        fetchAccounts();
    }, [user, onTransactionSuccess]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        const reqBody = {
            receiverAccountId: parseInt(recipientAccount),
            amount: parseFloat(transferAmount),
            username: user.emailId,
            password: 'password123' // Placeholder
        };
        try {
            await api.post(`/accounts/${fromAccountId}/transfer`, reqBody);

            // --- THIS IS THE NEW SUCCESS ALERT ---
            Swal.fire({
                icon: 'success',
                title: 'Transfer Successful!',
                text: `You have successfully sent $${transferAmount}.`,
                timer: 2000,
                showConfirmButton: false
            });

            setTransferAmount('');
            setRecipientAccount('');
            if (onTransactionSuccess) onTransactionSuccess(); // Notify parent to refresh all account data

        } catch (error) {
            // --- THIS IS THE NEW ERROR ALERT ---
            Swal.fire({
                icon: 'error',
                title: 'Transfer Failed',
                text: error.response?.data?.transaction?.transactionRemarks || 'Please check the recipient account and your balance.',
            });
        }
    };

    if (loading) return <CircularProgress />;
    if (accounts.filter(acc => acc.accountType === 'SAVINGS').length === 0) {
        return <Alert severity="warning">You do not have any savings accounts to transfer from.</Alert>;
    }


    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Transfer Money</Typography>
            <Box component="form" onSubmit={handleTransfer}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>From Account</InputLabel>
                    <Select
                        value={fromAccountId}
                        label="From Account"
                        onChange={(e) => setFromAccountId(e.target.value)}
                    >
                        {/* We only allow transfers from Savings accounts */}
                        {accounts.filter(acc => acc.accountType === 'SAVINGS').map(acc => (
                            <MenuItem key={acc.accountId} value={acc.accountId}>
                                Account #{acc.accountId} (Savings) - ${acc.balance.toFixed(2)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Recipient Account Number" 
                    type="number" 
                    value={recipientAccount} 
                    onChange={(e) => setRecipientAccount(e.target.value)} 
                    required
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Amount" 
                    type="number" 
                    value={transferAmount} 
                    onChange={(e) => setTransferAmount(e.target.value)} 
                    required
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ mt: 2 }} 
                    disabled={!transferAmount || !recipientAccount || !fromAccountId}
                >
                    Send Money
                </Button>
            </Box>
        </Paper>
    );
};

export default TransferMoneyPage;
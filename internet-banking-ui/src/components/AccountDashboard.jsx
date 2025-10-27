import React, { useState, useEffect } from 'react';
import axios from 'axios';

// MUI Imports
import {
    Paper, Typography, Grid, Divider, TextField, Box, Button,
    CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

const api = axios.create({ baseURL: '/api' });

const AccountDashboard = ({ user }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // Fetch all accounts belonging to the logged-in user
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
    }, [user]);

    // Update selected account details when the dropdown changes
    useEffect(() => {
        const account = accounts.find(acc => acc.accountId === selectedAccountId);
        setSelectedAccount(account);
    }, [selectedAccountId, accounts]);


    const handleTransaction = async (type) => {
        setFeedback({ type: '', message: '' });
        try {
            if (type === 'deposit') {
                await api.post(`/accounts/${selectedAccount.accountId}/deposit?amount=${transactionAmount}`);
            } else { // withdrawal
                const reqBody = { amount: parseFloat(transactionAmount), username: user.emailId, password: 'password123' };
                await api.post(`/accounts/${selectedAccount.accountId}/withdraw`, reqBody);
            }
            setFeedback({ type: 'success', message: `${type.charAt(0).toUpperCase() + type.slice(1)} of $${transactionAmount} was successful!` });
            fetchAccounts();
            setTransactionAmount('');
        } catch (error) {
            setFeedback({ type: 'error', message: `Transaction failed.` });
        }
    };

     const handleTransfer = async (e) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });
        const reqBody = {
            receiverAccountId: parseInt(recipientAccount),
            amount: parseFloat(transferAmount),
            username: user.emailId, password: 'password123'
        };
        try {
            await api.post(`/accounts/${selectedAccount.accountId}/transfer`, reqBody);
            setFeedback({ type: 'success', message: `Transfer of $${transferAmount} was successful!` });
            fetchAccounts();
            setTransferAmount('');
            setRecipientAccount('');
        } catch (error) {
            setFeedback({ type: 'error', message: 'Transfer failed.' });
        }
    };

    if (loading) return <CircularProgress />;
    if (accounts.length === 0) return <Alert severity="info">You have no accounts yet. An admin must first approve your registration.</Alert>;
    if (!selectedAccount) return <p>Please select an account.</p>;

    return (
        // *** THE FIX IS IN THE GRID COMPONENTS BELOW ***
        <Grid container spacing={4}>
            {/* Account Details */}
            <Grid xs={12}> {/* <-- REMOVED 'item' PROP */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>Welcome, {user.customerName}</Typography>
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel>Select Account</InputLabel>
                        <Select
                            value={selectedAccountId}
                            label="Select Account"
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                        >
                            {accounts.map(acc => (
                                <MenuItem key={acc.accountId} value={acc.accountId}>
                                    Account #{acc.accountId} ({acc.accountType === 'SAVINGS' ? 'Savings' : 'Term'})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                     <Divider sx={{ my: 2 }} />
                    <Typography><strong>Account Holder:</strong> {user.customerName}</Typography>
                    <Typography><strong>Account Number:</strong> {selectedAccount.accountId}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}><strong>Balance:</strong> ${selectedAccount.balance.toFixed(2)}</Typography>
                </Paper>
            </Grid>

            {/* Deposit / Withdraw */}
            <Grid xs={12} md={6}> {/* <-- REMOVED 'item' PROP */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>Transactions</Typography>
                    <TextField fullWidth margin="normal" label="Amount" type="number" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => handleTransaction('deposit')} disabled={!transactionAmount}>Deposit</Button>
                        <Button variant="contained" color="warning" onClick={() => handleTransaction('withdraw')} disabled={!transactionAmount}>Withdraw</Button>
                    </Box>
                </Paper>
            </Grid>

            {/* Money Transfer */}
            <Grid xs={12} md={6}> {/* <-- REMOVED 'item' PROP */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>Transfer Money</Typography>
                    <Box component="form" onSubmit={handleTransfer}>
                        <TextField fullWidth margin="normal" label="Recipient Account Number" type="number" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} required/>
                        <TextField fullWidth margin="normal" label="Amount" type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} required/>
                        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={!transferAmount || !recipientAccount}>Send Money</Button>
                    </Box>
                </Paper>
            </Grid>
            {feedback.message && 
                <Grid xs={12}> {/* <-- REMOVED 'item' PROP */}
                    <Alert severity={feedback.type} onClose={() => setFeedback({type: '', message: ''})}>{feedback.message}</Alert>
                </Grid>
            }
        </Grid>
    );
};

export default AccountDashboard;

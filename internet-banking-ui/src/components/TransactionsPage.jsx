import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// MUI Imports
import { 
    Paper, Typography, TextField, Box, Button, CircularProgress, Alert, 
    Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent,
    Avatar, Divider, alpha, useTheme
} from '@mui/material';
import {
    AccountBalance as AccountIcon,
    TrendingUp as DepositIcon,
    TrendingDown as WithdrawIcon,
    AttachMoney as MoneyIcon
} from '@mui/icons-material';

const api = axios.create({ baseURL: '/api' });

const TransactionsPage = ({ user, onTransactionSuccess }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transactionAmount, setTransactionAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const theme = useTheme();

    const fetchAccounts = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get(`/customers/${user.customerId}/accounts`);
            setAccounts(response.data);
            if (response.data.length > 0) {
                setSelectedAccountId(response.data[0].accountId);
                setSelectedAccount(response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [user, onTransactionSuccess]);

    useEffect(() => {
        const account = accounts.find(acc => acc.accountId === selectedAccountId);
        setSelectedAccount(account);
    }, [selectedAccountId, accounts]);

    const handleTransaction = async (type) => {
        if (!selectedAccountId || !transactionAmount) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please select an account and enter an amount.',
            });
            return;
        }

        if (parseFloat(transactionAmount) <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Please enter a valid positive amount.',
            });
            return;
        }

        setProcessing(true);
        try {
            let response;
            if (type === 'deposit') {
                response = await api.post(`/accounts/${selectedAccountId}/deposit?amount=${transactionAmount}`);
            } else {
                const reqBody = { amount: parseFloat(transactionAmount), username: user.emailId, password: 'password123' };
                response = await api.post(`/accounts/${selectedAccountId}/withdraw`, reqBody);
            }

            Swal.fire({
                icon: 'success',
                title: 'Transaction Successful!',
                text: `Your new balance is $${response.data.updatedAccount.balance.toFixed(2)}`,
                timer: 2000,
                showConfirmButton: false
            });
            
            setTransactionAmount('');
            if(onTransactionSuccess) onTransactionSuccess();
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Failed',
                text: error.response?.data?.transaction?.transactionRemarks || 'An unexpected error occurred.',
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress size={60} />
        </Box>
    );

    if (accounts.length === 0) return (
        <Alert 
            severity="info" 
            sx={{ 
                borderRadius: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
        >
            You have no accounts to perform transactions on.
        </Alert>
    );

    return (
        <Box className="fade-in">
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    Manage Transactions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Deposit money or make withdrawals from your accounts
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Account Selection Card */}
                <Grid item xs={12} lg={8}>
                    <Paper 
                        elevation={0}
                        className="glass-card"
                        sx={{ 
                            p: 4, 
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountIcon color="primary" />
                            Transaction Details
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Select Account</InputLabel>
                            <Select
                                value={selectedAccountId}
                                label="Select Account"
                                onChange={(e) => setSelectedAccountId(e.target.value)}
                                sx={{
                                    borderRadius: '12px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(theme.palette.primary.main, 0.3)
                                    }
                                }}
                            >
                                {accounts.map(acc => (
                                    <MenuItem key={acc.accountId} value={acc.accountId}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                            <Avatar 
                                                sx={{ 
                                                    width: 32, 
                                                    height: 32,
                                                    background: acc.accountType === 'SAVINGS' ? 'success.main' : 'primary.main'
                                                }}
                                            >
                                                <AccountIcon sx={{ fontSize: '1rem' }} />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    Account #{acc.accountId}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {acc.accountType} • ${acc.balance.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedAccount && (
                            <Box 
                                sx={{ 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '16px',
                                    p: 3,
                                    color: 'white',
                                    mb: 3
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                    Current Balance
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                    ${selectedAccount.balance.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                                    {selectedAccount.accountType} Account • #{selectedAccount.accountId}
                                </Typography>
                            </Box>
                        )}

                        <TextField 
                            fullWidth 
                            margin="normal" 
                            label="Transaction Amount" 
                            type="number" 
                            value={transactionAmount} 
                            onChange={(e) => setTransactionAmount(e.target.value)}
                            placeholder="Enter amount to deposit or withdraw"
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '&.Mui-focused': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: <MoneyIcon color="action" sx={{ mr: 1 }} />
                            }}
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Button 
                                    fullWidth
                                    variant="contained" 
                                    size="large"
                                    startIcon={<DepositIcon />}
                                    onClick={() => handleTransaction('deposit')} 
                                    disabled={!transactionAmount || processing}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                                        },
                                        '&:disabled': {
                                            background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                                        }
                                    }}
                                >
                                    {processing ? <CircularProgress size={20} color="inherit" /> : 'Deposit Money'}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button 
                                    fullWidth
                                    variant="contained" 
                                    size="large"
                                    startIcon={<WithdrawIcon />}
                                    onClick={() => handleTransaction('withdraw')} 
                                    disabled={!transactionAmount || processing}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)'
                                        },
                                        '&:disabled': {
                                            background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                                        }
                                    }}
                                >
                                    {processing ? <CircularProgress size={20} color="inherit" /> : 'Withdraw Money'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Transaction Guide Card */}
                <Grid item xs={12} lg={4}>
                    <Paper 
                        elevation={0}
                        className="glass-card"
                        sx={{ 
                            p: 3, 
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: 'fit-content'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Transaction Guide
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ background: 'success.main', width: 40, height: 40 }}>
                                    <DepositIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        Deposit Money
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Add funds to your account instantly
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ background: 'warning.main', width: 40, height: 40 }}>
                                    <WithdrawIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        Withdraw Money
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Take money out of your account
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                                Important Notes:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Minimum transaction amount is $1.00
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Withdrawals cannot exceed account balance
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • All transactions are processed instantly
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TransactionsPage;

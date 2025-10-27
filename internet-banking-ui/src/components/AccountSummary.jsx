import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

// MUI Imports
import {
    Paper, Typography, Grid, Divider, CircularProgress, Alert, Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, FormControl, InputLabel, Button, Card, CardContent,
    Chip, Avatar, useTheme, alpha
} from '@mui/material';
import {
    Download as DownloadIcon,
    AccountBalance as AccountIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Savings as SavingsIcon,
    AccountBalanceWallet as WalletIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';

const api = axios.create({ baseURL: '/api' });

const AccountSummary = ({ user, onTransactionSuccess }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [miniStatement, setMiniStatement] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const theme = useTheme();

    const fetchAllData = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const accountsResponse = await api.get(`/customers/${user.customerId}/accounts`);
            const userAccounts = accountsResponse.data;
            setAccounts(userAccounts);

            if (userAccounts.length > 0) {
                const firstAccountId = selectedAccountId || userAccounts[0].accountId;
                if(!selectedAccountId) setSelectedAccountId(firstAccountId);
                
                const statementResponse = await api.get(`/accounts/${firstAccountId}/mini-statement`);
                setMiniStatement(statementResponse.data);
            }
        } catch (err) {
            setError('Failed to load account information.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAllData();
    }, [user, onTransactionSuccess]);

    useEffect(() => {
        const fetchStatement = async () => {
            if (!selectedAccountId) return;
            try {
                const statementResponse = await api.get(`/accounts/${selectedAccountId}/mini-statement`);
                setMiniStatement(statementResponse.data);
                const currentAccount = accounts.find(acc => acc.accountId === selectedAccountId);
                setSelectedAccount(currentAccount);
            } catch (err) { console.error("Failed to fetch mini statement", err); }
        };
        if(accounts.length > 0) fetchStatement();
    }, [selectedAccountId, accounts]);

    const generatePDF = async () => {
        if (!selectedAccount) return;

        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait while we prepare your full statement.',
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false
        });

        try {
            const fullStatementResponse = await api.get(`/accounts/${selectedAccount.accountId}/full-statement`);
            const fullTransactionHistory = fullStatementResponse.data;

            if (fullTransactionHistory.length === 0) {
                Swal.fire('No Transactions', 'There is no transaction history to generate a statement for.', 'info');
                return;
            }

            const doc = new jsPDF();
            
            doc.setFontSize(22);
            doc.text("Full Account Statement", 14, 22);
            
            doc.setFontSize(12);
            doc.text(`Account Holder: ${user.customerName}`, 14, 40);
            doc.text(`Account Number: ${selectedAccount.accountId}`, 14, 46);
            doc.text(`Current Balance: $${selectedAccount.balance.toFixed(2)}`, 14, 52);

            autoTable(doc, {
                startY: 60,
                head: [['Date & Time', 'Type', 'Amount', 'Status', 'Remarks']],
                body: fullTransactionHistory.map(tx => [
                    new Date(tx.transactionDate).toLocaleString(),
                    tx.transactionType,
                    `${tx.transactionType === 'DEPOSIT' ? '+' : '-'}$${tx.amount.toFixed(2)}`,
                    tx.transactionStatus,
                    tx.transactionRemarks || '-'
                ]),
            });

            doc.save(`full-statement-account-${selectedAccount.accountId}.pdf`);
            Swal.close();

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while generating the PDF.',
            });
            console.error(err);
        }
    };

    const getAccountTypeIcon = (type) => {
        return type === 'SAVINGS' ? <SavingsIcon /> : <AccountIcon />;
    };

    const getTotalBalance = () => {
        return accounts.reduce((total, account) => total + account.balance, 0);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress size={60} />
        </Box>
    );
    
    if (error) return <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>;

    return (
        <Box className="fade-in">
            {/* Welcome Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                    }}
                >
                    Welcome back, {user.customerName}!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Here's your financial overview
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Account Overview Cards */}
                {accounts.length === 0 ? (
                    <Grid item xs={12}>
                        <Alert 
                            severity="info" 
                            sx={{ 
                                borderRadius: '16px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.2)'
                            }}
                        >
                            You do not have any open accounts yet. Please contact support for account creation.
                        </Alert>
                    </Grid>
                ) : (
                    <>
                        {/* Total Balance Card */}
                        <Grid item xs={12} md={4}>
                            <Card 
                                className="balance-card hover-lift"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    borderRadius: '20px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: '160px'
                                }}
                            >
                                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                mr: 2,
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            <WalletIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Total Balance
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                ${getTotalBalance().toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Account Count Card */}
                        <Grid item xs={12} md={4}>
                            <Card 
                                className="metric-card hover-lift"
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: '160px'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                                mr: 2,
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            <AccountIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Active Accounts
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {accounts.length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {accounts.map(acc => (
                                            <Chip 
                                                key={acc.accountId}
                                                label={acc.accountType}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: acc.accountType === 'SAVINGS' ? 'success.main' : 'primary.main',
                                                    color: 'white',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Recent Transactions Card */}
                        <Grid item xs={12} md={4}>
                            <Card 
                                className="metric-card hover-lift"
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: '160px'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                                mr: 2,
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            <ReceiptIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Recent Transactions
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {miniStatement.length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Last 10 transactions shown
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Account Selection and Details */}
                        <Grid item xs={12}>
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        Account Details
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        onClick={generatePDF}
                                        disabled={!selectedAccount}
                                        sx={{
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        Download Statement
                                    </Button>
                                </Box>

                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Select Account to View</InputLabel>
                                    <Select
                                        value={selectedAccountId}
                                        label="Select Account to View"
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
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {getAccountTypeIcon(acc.accountType)}
                                                    <Box>
                                                        <Typography variant="body1">
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
                                        className="account-card"
                                        sx={{ 
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '16px',
                                            p: 3,
                                            color: 'white',
                                            mb: 3
                                        }}
                                    >
                                        <Grid container spacing={3} alignItems="center">
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                                    Current Balance
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                                    ${selectedAccount.balance.toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                                    <Chip 
                                                        label={selectedAccount.accountType}
                                                        sx={{ 
                                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            mb: 1
                                                        }}
                                                    />
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        Account #{selectedAccount.accountId}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Enhanced Transactions Table */}
                        <Grid item xs={12}>
                            <Paper 
                                elevation={0}
                                className="glass-card"
                                sx={{ 
                                    borderRadius: '20px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ReceiptIcon color="primary" />
                                        Recent Transactions
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Your latest financial activities
                                    </Typography>
                                </Box>
                                
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date & Time</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Type</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>Amount</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {miniStatement.length > 0 ? miniStatement.map((tx, index) => (
                                                <TableRow 
                                                    key={tx.transactionId}
                                                    className="transaction-row"
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                        }
                                                    }}
                                                >
                                                    <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {new Date(tx.transactionDate).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                            {new Date(tx.transactionDate).toLocaleTimeString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {tx.transactionType === 'DEPOSIT' ? 
                                                                <TrendingUpIcon sx={{ color: 'success.main', fontSize: '1rem' }} /> :
                                                                <TrendingDownIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
                                                            }
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {tx.transactionType}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell 
                                                        align="right" 
                                                        sx={{ 
                                                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                                                            color: tx.transactionType === 'DEPOSIT' ? 'success.main' : 'error.main', 
                                                            fontWeight: 700,
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        {tx.transactionType === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                                        <Chip 
                                                            label={tx.transactionStatus}
                                                            size="small"
                                                            className={`status-${tx.transactionStatus.toLowerCase()}`}
                                                            sx={{
                                                                backgroundColor: tx.transactionStatus === 'SUCCESS' ? 'success.main' : 
                                                                                tx.transactionStatus === 'PENDING' ? 'warning.main' : 'error.main',
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center" sx={{ py: 4, borderBottom: 'none' }}>
                                                        <Typography variant="body1" color="text.secondary">
                                                            No recent transactions found.
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Start using your account to see transaction history here.
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
};

export default AccountSummary;

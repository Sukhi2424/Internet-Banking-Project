import React, { useState } from 'react';
import axios from 'axios';

// MUI Imports
import { 
    Paper, Typography, TextField, Box, Button, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const api = axios.create({ baseURL: '/api' });

const TransactionReportPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [filterAccountId, setFilterAccountId] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');


    const handleFetchReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTransactions([]);

        const params = {};
        if (filterAccountId) params.accountId = filterAccountId;
        if (filterType) params.type = filterType;
        if (filterStartDate) params.startDate = `${filterStartDate}T00:00:00`;
        if (filterEndDate) params.endDate = `${filterEndDate}T23:59:59`;
        
        try {
            const response = await api.get('/admin/transactions/filter', { params });
            setTransactions(response.data);
            if (response.data.length === 0) {
                setError('No transactions found for the selected criteria.');
            }
        } catch (err) {
            setError('Failed to fetch report. Please check your filters.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        return new Date(dateTimeString).toLocaleString();
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>Transaction Report</Typography>
            <Typography color="text.secondary" sx={{mb: 2}}>
                Filter transactions by account, type, or date range.
            </Typography>
            <Box component="form" onSubmit={handleFetchReport}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                         <TextField 
                            fullWidth
                            label="Account ID (Optional)"
                            type="number"
                            value={filterAccountId}
                            onChange={(e) => setFilterAccountId(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Transaction Type</InputLabel>
                            <Select
                                value={filterType}
                                label="Transaction Type"
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <MenuItem value=""><em>All Types</em></MenuItem>
                                <MenuItem value="DEPOSIT">Deposit</MenuItem>
                                <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
                                <MenuItem value="TRANSFER">Transfer</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField 
                            fullWidth label="Start Date" type="date"
                            value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField 
                            fullWidth label="End Date" type="date"
                            value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button 
                            type="submit" variant="contained" fullWidth
                            sx={{ height: '56px' }} disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Filter'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {error && !loading && <Alert severity="warning" sx={{ mt: 3 }}>{error}</Alert>}
            
            <TableContainer component={Paper} sx={{ mt: 4, display: transactions.length > 0 ? 'block' : 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Txn ID</TableCell>
                            <TableCell>Account ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date & Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Remarks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.transactionId}>
                                <TableCell>{tx.transactionId}</TableCell>
                                <TableCell>{tx.accountId}</TableCell>
                                <TableCell>{tx.transactionType}</TableCell>
                                {/* --- THIS IS THE CORRECTED LINE --- */}
                                <TableCell>{`$${tx.amount.toFixed(2)}`}</TableCell>
                                <TableCell>{formatDateTime(tx.transactionDate)}</TableCell>
                                <TableCell>{tx.transactionStatus}</TableCell>
                                <TableCell>{tx.transactionRemarks}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TransactionReportPage;

import React, {useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

// MUI Imports
import {
    Paper, Typography, Grid, Divider, CircularProgress, Alert, Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, FormControl, InputLabel, Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const AccountSummary = ({ user, onTransactionSuccess }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [miniStatement, setMiniStatement] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllData = async () => {
        // ... (This function remains the same as before)
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


    // --- THIS IS THE NEW, UPGRADED PDF GENERATION LOGIC ---
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
            // 1. Fetch the FULL transaction history for the PDF
            const fullStatementResponse = await api.get(`/accounts/${selectedAccount.accountId}/full-statement`);
            const fullTransactionHistory = fullStatementResponse.data;

            if (fullTransactionHistory.length === 0) {
                Swal.fire('No Transactions', 'There is no transaction history to generate a statement for.', 'info');
                return;
            }

            // 2. Generate the PDF with the full history
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


    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Grid container spacing={3}>
            {/* Account Summary Card */}
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" gutterBottom>Welcome, {user.customerName}!</Typography>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={generatePDF}
                            disabled={!selectedAccount}
                        >
                            Download Full Statement
                        </Button>
                    </Box>

                     {accounts.length === 0 ? (
                        <Alert severity="info">You do not have any open accounts.</Alert>
                    ) : (
                        <>
                            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                                <InputLabel>Select Account to View</InputLabel>
                                <Select
                                    value={selectedAccountId}
                                    label="Select Account to View"
                                    onChange={(e) => setSelectedAccountId(e.target.value)}
                                >
                                    {accounts.map(acc => (
                                        <MenuItem key={acc.accountId} value={acc.accountId}>
                                            Account #{acc.accountId} ({acc.accountType === 'SAVINGS' ? 'Savings' : 'Term'}) - ${acc.balance.toFixed(2)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {selectedAccount && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h5">
                                        Current Balance: ${selectedAccount.balance.toFixed(2)}
                                    </Typography>
                                </>
                            )}
                        </>
                    )}
                </Paper>
            </Grid>

            {/* Mini Statement Card */}
            {accounts.length > 0 && (
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Recent Transactions (On-Screen)</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date & Time</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {miniStatement.length > 0 ? miniStatement.map((tx) => (
                                        <TableRow key={tx.transactionId}>
                                            <TableCell>{new Date(tx.transactionDate).toLocaleString()}</TableCell>
                                            <TableCell>{tx.transactionType}</TableCell>
                                            <TableCell align="right" sx={{ color: tx.transactionType === 'DEPOSIT' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                                                {tx.transactionType === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>{tx.transactionStatus}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={4} align="center">No recent transactions found.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            )}
        </Grid>
    );
};

export default AccountSummary;
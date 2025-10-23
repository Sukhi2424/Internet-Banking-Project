import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Import MUI components for the form
import { 
    Container, Box, Paper, Typography, TextField, Button, 
    CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const RegistrationPage = () => {
    const [formData, setFormData] = useState({ customerName: '', phoneNo: '', emailId: '', age: '', gender: 'MALE', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        const postData = { ...formData, age: parseInt(formData.age), user: { password: formData.password } };
        try {
            await api.post('/customers/register', postData);
            setMessage('Registration successful! Please wait for admin approval. Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={6} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Create Your Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField fullWidth margin="normal" label="Full Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Email" name="emailId" type="email" value={formData.emailId} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Phone Number" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Gender</InputLabel>
                        <Select name="gender" value={formData.gender} label="Gender" onChange={handleChange}>
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="FEMALE">Female</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                        </Select>
                    </FormControl>
                    {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegistrationPage;
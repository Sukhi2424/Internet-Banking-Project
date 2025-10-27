import React, { useState, useEffect } from 'react';
import axios from 'axios';

// MUI Imports for the profile page layout
import { 
    Paper, Typography, Grid, TextField, Button, 
    CircularProgress, Alert, Box, Avatar 
} from '@mui/material';

const api = axios.create({ baseURL: '/api' });

const ProfilePage = ({ user, onProfileUpdate }) => {
    // We use a local state for the form so we can cancel edits
    const [formData, setFormData] = useState({
        customerName: user.customerName || '',
        emailId: user.emailId || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // When the user prop changes (e.g., after a successful update), reset the form
    useEffect(() => {
        setFormData({
            customerName: user.customerName || '',
            emailId: user.emailId || '',
        });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: '', message: '' });
        try {
            const response = await api.put(`/customers/${user.customerId}`, formData);
            setFeedback({ type: 'success', message: 'Profile updated successfully!' });
            onProfileUpdate(response.data); // Notify the parent App of the change
            setIsEditing(false); // Exit edit mode
        } catch (err) {
            setFeedback({ type: 'error', message: 'Failed to update profile.' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`;
        }
        return name[0];
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, fontSize: '2rem', mr: 2 }}>
                    {getInitials(user.customerName)}
                </Avatar>
                <Typography variant="h4">
                    My Profile
                </Typography>
            </Box>
            
            {isEditing ? (
                // EDIT MODE FORM
                <Box component="form" onSubmit={handleUpdate}>
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Full Name" 
                        name="customerName" 
                        value={formData.customerName} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Email Address" 
                        name="emailId" 
                        type="email" 
                        value={formData.emailId} 
                        onChange={handleChange} 
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" disabled={loading} sx={{ mr: 1 }}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                        </Button>
                        <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </Box>
                </Box>
            ) : (
                // VIEW MODE
                <Box>
                    <Typography variant="body1" gutterBottom><strong>Name:</strong> {user.customerName}</Typography>
                    <Typography variant="body1" gutterBottom><strong>Email:</strong> {user.emailId}</Typography>
                    <Typography variant="body1" gutterBottom><strong>User ID:</strong> {user.user.userId}</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                </Box>
            )}

            {feedback.message && 
                <Alert severity={feedback.type} sx={{ mt: 3 }} onClose={() => setFeedback({type: '', message: ''})}>
                    {feedback.message}
                </Alert>
            }
        </Paper>
    );
};

export default ProfilePage;

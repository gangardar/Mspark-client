/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Optional: Add an icon

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'start',
                minHeight: '100vh', // Full viewport height
                textAlign: 'center',
                backgroundColor: '#f5f5f5', // Light background color
            }}
        >
            <ErrorOutlineIcon
                sx={{
                    fontSize: '6rem', // Large icon size
                    color: 'error.main', // Use MUI's error color
                    my: 3
                }}
            />
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 2, // Margin bottom
                }}
            >
                404 - Page Not Found
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    color: 'text.secondary',
                    mb: 4, // Margin bottom
                }}
            >
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                sx={{
                    fontSize: '1.1rem',
                    padding: '10px 20px',
                    borderRadius: '8px',
                }}
            >
                Go Back Home
            </Button>
        </Box>
    );
};

export default NotFound;
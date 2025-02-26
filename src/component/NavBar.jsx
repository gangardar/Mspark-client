/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CatchingPokemon } from '@mui/icons-material';
import Auth from './Auth';
import { AuthProvider } from '../context/AuthContext';

function NavBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="logo">
                    <CatchingPokemon />
                </IconButton>
                <Typography component="div" variant="h5" sx={{ flexGrow: 1 }}>
                    Mspark
                </Typography>
                <AuthProvider>
                    <Auth/>
                </AuthProvider>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
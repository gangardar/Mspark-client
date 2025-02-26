/* eslint-disable no-unused-vars */
import React from 'react';
import 'normalize.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material';
import theme from './createTheme.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)

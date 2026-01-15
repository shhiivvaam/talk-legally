import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import LawyerVerification from './pages/LawyerVerification';
import UserManagement from './pages/UserManagement';
import LawyerManagement from './pages/LawyerManagement';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verification" element={<LawyerVerification />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/lawyers" element={<LawyerManagement />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;

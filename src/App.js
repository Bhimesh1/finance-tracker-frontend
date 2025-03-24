// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AccountsList from './pages/Accounts/AccountsList';
import AccountDetails from './pages/Accounts/AccountDetails';
import TransactionsList from './pages/Transactions/TransactionsList';
import BudgetsList from './pages/Budgets/BudgetsList';
import GoalsList from './pages/Goals/GoalsList';
import Reports from './pages/Reports/Reports';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#388e3c',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/accounts" element={<AccountsList />} />
                <Route path="/accounts/:id" element={<AccountDetails />} />
                <Route path="/transactions" element={<TransactionsList />} />
                <Route path="/budgets" element={<BudgetsList />} />
                <Route path="/goals" element={<GoalsList />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;










//{/* Redirect from root to dashboard or login */}
//<Route path="/" element={<Navigate to="/dashboard" />} />
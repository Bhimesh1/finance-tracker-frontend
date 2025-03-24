import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Paper, CircularProgress, Alert, Button,
  Card, CardContent, CardActions, Divider
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SavingsIcon from '@mui/icons-material/Savings';
import FlagIcon from '@mui/icons-material/Flag';
import AddIcon from '@mui/icons-material/Add';
import { getDashboardSummary } from '../../api/analyticsApi';
import TransactionTable from '../../components/transactions/TransactionTable';
import { getTransactions } from '../../api/transactionApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardCard = ({ title, value, icon, color, subtitle }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          bgcolor: `${color}20`,
          p: 1.5,
          borderRadius: 2,
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>
      </Box>
    </Box>
    {subtitle && (
      <Typography variant="caption" color="textSecondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setDashboardData(data);
      
      // Also fetch recent transactions
      const transactionsData = await getTransactions(0, 5);
      setTransactions(transactionsData.content);
      
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="info">
          No data available. Start by adding accounts and transactions.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard 
            title="Total Balance" 
            value={`$${dashboardData.totalBalance.toFixed(2)}`}
            icon={<AccountBalanceIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard 
            title="Monthly Income" 
            value={`$${dashboardData.monthlyIncome.toFixed(2)}`}
            icon={<ArrowUpwardIcon sx={{ color: '#4caf50' }} />}
            color="#4caf50"
            subtitle="Current month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard 
            title="Monthly Expenses" 
            value={`$${dashboardData.monthlyExpense.toFixed(2)}`}
            icon={<ArrowDownwardIcon sx={{ color: '#f44336' }} />}
            color="#f44336"
            subtitle="Current month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard 
            title="Savings" 
            value={`$${dashboardData.monthlySavings.toFixed(2)}`}
            icon={<SavingsIcon sx={{ color: '#ff9800' }} />}
            color="#ff9800"
            subtitle="Current month"
          />
        </Grid>
        
        {/* Budget and Goals Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Active Budgets
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/budgets')}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ color: '#1976d2', fontSize: 40, mr: 1 }} />
                <Typography variant="h4">
                  {dashboardData.activeBudgetsCount}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/budgets')}
              >
                Add Budget
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Financial Goals
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/goals')}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FlagIcon sx={{ color: '#f44336', fontSize: 40, mr: 1 }} />
                <Typography variant="h4">
                  {dashboardData.activeGoalsCount}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/goals')}
              >
                Add Goal
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Categories
            </Typography>
            {dashboardData.topCategories.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography variant="body2" color="textSecondary">
                  No category data available
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardData.topCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({name}) => name}
                  >
                    {dashboardData.topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Transactions
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/transactions')}
              >
                View All
              </Button>
            </Box>
            {transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  No transactions found.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/transactions')}
                  sx={{ mt: 1 }}
                >
                  Add Transaction
                </Button>
              </Box>
            ) : (
              <TransactionTable 
                transactions={transactions}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
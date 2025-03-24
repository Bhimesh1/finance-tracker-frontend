import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, CircularProgress, Alert, Tab, Tabs,
  FormControl, InputLabel, Select, MenuItem, TextField, Button
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  PieChart, Pie, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { getExpensesByCategory, getCashFlowForMonth, getMonthlySummary, getAccountBalanceHistory } from '../../api/analyticsApi';
import { getAllAccounts } from '../../api/accountApi';
import { Cell } from 'recharts';



const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);
  
  // Expense by Category states
  const [expensesStartDate, setExpensesStartDate] = useState(startOfMonth(new Date()));
  const [expensesEndDate, setExpensesEndDate] = useState(endOfMonth(new Date()));
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  
  // Cash Flow states
  const [cashFlowDate, setCashFlowDate] = useState(new Date());
  const [cashFlowData, setCashFlowData] = useState(null);
  
  // Monthly Summary states
  const [summaryStartDate, setSummaryStartDate] = useState(startOfMonth(subMonths(new Date(), 5)));
  const [summaryEndDate, setSummaryEndDate] = useState(endOfMonth(new Date()));
  const [monthlySummaryData, setMonthlySummaryData] = useState([]);
  
  // Account Balance History states
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [balanceStartDate, setBalanceStartDate] = useState(startOfMonth(subMonths(new Date(), 2)));
  const [balanceEndDate, setBalanceEndDate] = useState(endOfMonth(new Date()));
  const [balanceHistoryData, setBalanceHistoryData] = useState([]);

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccountId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load accounts', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Load data based on the selected tab
    switch (newValue) {
      case 0:
        fetchExpensesByCategory();
        break;
      case 1:
        fetchCashFlowData();
        break;
      case 2:
        fetchMonthlySummary();
        break;
      case 3:
        fetchBalanceHistory();
        break;
      default:
        break;
    }
  };

  // Expenses by Category
  const fetchExpensesByCategory = async () => {
    try {
      setLoading(true);
      const data = await getExpensesByCategory(
        format(expensesStartDate, 'yyyy-MM-dd'),
        format(expensesEndDate, 'yyyy-MM-dd')
      );
      setExpensesByCategory(data);
      setError('');
    } catch (err) {
      setError('Failed to load expense data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cash Flow
  const fetchCashFlowData = async () => {
    try {
      setLoading(true);
      const year = cashFlowDate.getFullYear();
      const month = cashFlowDate.getMonth() + 1;
      const data = await getCashFlowForMonth(year, month);
      setCashFlowData(data);
      setError('');
    } catch (err) {
      setError('Failed to load cash flow data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Monthly Summary
  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      const startYear = summaryStartDate.getFullYear();
      const startMonth = summaryStartDate.getMonth() + 1;
      const endYear = summaryEndDate.getFullYear();
      const endMonth = summaryEndDate.getMonth() + 1;
      
      const data = await getMonthlySummary(startYear, startMonth, endYear, endMonth);
      
      // Format data for chart
      const formattedData = data.data.map(item => ({
        name: format(new Date(item.month), 'MMM yyyy'),
        income: item.income,
        expenses: item.expense,
        savings: item.savings
      }));
      
      setMonthlySummaryData(formattedData);
      setError('');
    } catch (err) {
      setError('Failed to load monthly summary data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Account Balance History
  const fetchBalanceHistory = async () => {
    if (!selectedAccountId) return;
    
    try {
      setLoading(true);
      const data = await getAccountBalanceHistory(
        selectedAccountId,
        format(balanceStartDate, 'yyyy-MM-dd'),
        format(balanceEndDate, 'yyyy-MM-dd')
      );
      
      // Format data for chart
      const formattedData = data.balanceHistory.map(item => ({
        name: format(new Date(item.date), 'MM/dd'),
        balance: item.balance
      }));
      
      setBalanceHistoryData(formattedData);
      setError('');
    } catch (err) {
      setError('Failed to load balance history data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect hooks to load data when parameters change
  useEffect(() => {
    if (tabValue === 0) {
      fetchExpensesByCategory();
    }
  }, [expensesStartDate, expensesEndDate]);

  useEffect(() => {
    if (tabValue === 1) {
      fetchCashFlowData();
    }
  }, [cashFlowDate]);

  useEffect(() => {
    if (tabValue === 2) {
      fetchMonthlySummary();
    }
  }, [summaryStartDate, summaryEndDate]);

  useEffect(() => {
    if (tabValue === 3 && selectedAccountId) {
      fetchBalanceHistory();
    }
  }, [selectedAccountId, balanceStartDate, balanceEndDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Expenses by Category" />
            <Tab label="Cash Flow" />
            <Tab label="Monthly Summary" />
            <Tab label="Balance History" />
          </Tabs>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Expenses by Category */}
            {tabValue === 0 && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={5}>
                    <DatePicker
                      label="Start Date"
                      value={expensesStartDate}
                      onChange={setExpensesStartDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <DatePicker
                      label="End Date"
                      value={expensesEndDate}
                      onChange={setExpensesEndDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{ height: '56px' }}
                    >
                      Export
                    </Button>
                  </Grid>
                </Grid>
                
                <Paper sx={{ p: 3, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Expenses by Category
                  </Typography>
                  {expensesByCategory.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                      <Typography variant="body1" color="text.secondary">
                        No expense data available for the selected period
                      </Typography>
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          dataKey="amount"
                          nameKey="categoryName"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ categoryName, percentage }) => `${categoryName}: ${percentage.toFixed(1)}%`}
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.categoryColor || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Paper>
              </Box>
            )}
            
            {/* Cash Flow */}
            {tabValue === 1 && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={10}>
                    <DatePicker
                      label="Month"
                      views={['year', 'month']}
                      value={cashFlowDate}
                      onChange={setCashFlowDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{ height: '56px' }}
                    >
                      Export
                    </Button>
                  </Grid>
                </Grid>
                
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Monthly Overview
                  </Typography>
                  {!cashFlowData ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No data available for the selected month
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Income
                          </Typography>
                          <Typography variant="h4" color="primary">
                            ${cashFlowData.totalIncome.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#fbe9e7', borderRadius: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Expenses
                          </Typography>
                          <Typography variant="h4" color="error">
                            ${cashFlowData.totalExpense.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9', borderRadius: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Net Cash Flow
                          </Typography>
                          <Typography 
                            variant="h4" 
                            color={cashFlowData.netCashFlow >= 0 ? 'success' : 'error'}
                          >
                            ${cashFlowData.netCashFlow.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Paper>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 400 }}>
                      <Typography variant="h6" gutterBottom>
                        Income Sources
                      </Typography>
                      {!cashFlowData || cashFlowData.incomeItems.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                          <Typography variant="body1" color="text.secondary">
                            No income data available
                          </Typography>
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={cashFlowData.incomeItems}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categoryName" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                            <Bar dataKey="amount" fill="#4caf50" name="Amount" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 400 }}>
                      <Typography variant="h6" gutterBottom>
                        Expense Categories
                      </Typography>
                      {!cashFlowData || cashFlowData.expenseItems.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                          <Typography variant="body1" color="text.secondary">
                            No expense data available
                          </Typography>
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={cashFlowData.expenseItems}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categoryName" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                            <Bar dataKey="amount" fill="#f44336" name="Amount" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Monthly Summary */}
            {tabValue === 2 && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={5}>
                    <DatePicker
                      label="Start Month"
                      views={['year', 'month']}
                      value={summaryStartDate}
                      onChange={setSummaryStartDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <DatePicker
                      label="End Month"
                      views={['year', 'month']}
                      value={summaryEndDate}
                      onChange={setSummaryEndDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{ height: '56px' }}
                    >
                      Export
                    </Button>
                  </Grid>
                </Grid>
                
                <Paper sx={{ p: 3, height: 500 }}>
                  <Typography variant="h6" gutterBottom>
                    Monthly Financial Summary
                  </Typography>
                  {monthlySummaryData.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                      <Typography variant="body1" color="text.secondary">
                        No data available for the selected period
                      </Typography>
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={monthlySummaryData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#4caf50" name="Income" />
                        <Line type="monotone" dataKey="expenses" stroke="#f44336" name="Expenses" />
                        <Line type="monotone" dataKey="savings" stroke="#2196f3" name="Savings" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                    )}
                    </Paper>
                  </Box>
                )}
                
                {/* Balance History */}
                {tabValue === 3 && (
                  <Box>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <InputLabel>Account</InputLabel>
                          <Select
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            label="Account"
                          >
                            {accounts.map(account => (
                              <MenuItem key={account.id} value={account.id}>
                                {account.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <DatePicker
                          label="Start Date"
                          value={balanceStartDate}
                          onChange={setBalanceStartDate}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <DatePicker
                          label="End Date"
                          value={balanceEndDate}
                          onChange={setBalanceEndDate}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button 
                          variant="outlined" 
                          startIcon={<DownloadIcon />}
                          fullWidth
                          sx={{ height: '56px' }}
                        >
                          Export
                        </Button>
                      </Grid>
                    </Grid>
                    
                    <Paper sx={{ p: 3, height: 500 }}>
                      <Typography variant="h6" gutterBottom>
                        Account Balance History
                      </Typography>
                      {balanceHistoryData.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                          <Typography variant="body1" color="text.secondary">
                            No data available for the selected account and period
                          </Typography>
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart
                            data={balanceHistoryData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Balance']} />
                            <Line type="monotone" dataKey="balance" stroke="#1976d2" name="Balance" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </Paper>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </LocalizationProvider>
      );
     };
     
     export default Reports;
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert, FormControl,
  InputLabel, Select, MenuItem, Grid, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import TransactionTable from '../../components/transactions/TransactionTable';
import TransactionForm from '../../components/transactions/TransactionForm';
import { 
  getTransactions, createTransaction, updateTransaction, deleteTransaction 
} from '../../api/transactionApi';
import { getAllAccounts } from '../../api/accountApi';
import { getAllCategories } from '../../api/categoryApi';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [filters, setFilters] = useState({
    accountId: '',
    categoryId: '',
    type: '',
    startDate: null,
    endDate: null
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions(page, 10);
      setTransactions(data.content);
      setTotalTransactions(data.totalElements);
      setError('');
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountsAndCategories = async () => {
    try {
      const [accountsData, categoriesData] = await Promise.all([
        getAllAccounts(),
        getAllCategories()
      ]);
      setAccounts(accountsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load accounts or categories', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccountsAndCategories();
  }, [page]);

  const handleCreateTransaction = async (transactionData) => {
    try {
      await createTransaction(transactionData);
      fetchTransactions();
      setOpenForm(false);
    } catch (err) {
      setError('Failed to create transaction');
      console.error(err);
    }
  };

  const handleUpdateTransaction = async (transactionData) => {
    try {
      await updateTransaction(currentTransaction.id, transactionData);
      fetchTransactions();
      setOpenForm(false);
      setCurrentTransaction(null);
    } catch (err) {
      setError('Failed to update transaction');
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        fetchTransactions();
      } catch (err) {
        setError('Failed to delete transaction');
        console.error(err);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setOpenForm(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleDateChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentTransaction(null);
            setOpenForm(true);
          }}
        >
          Add Transaction
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Account</InputLabel>
              <Select
                name="accountId"
                value={filters.accountId}
                onChange={handleFilterChange}
                label="Account"
              >
                <MenuItem value="">All Accounts</MenuItem>
                {accounts.map(account => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="INCOME">Income</MenuItem>
                <MenuItem value="EXPENSE">Expense</MenuItem>
                <MenuItem value="TRANSFER">Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(newValue) => handleDateChange('startDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(newValue) => handleDateChange('endDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TransactionTable
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          page={page}
          setPage={setPage}
          totalCount={totalTransactions}
        />
      )}

      <TransactionForm
        open={openForm}
        handleClose={() => {
          setOpenForm(false);
          setCurrentTransaction(null);
        }}
        transaction={currentTransaction}
        onSubmit={currentTransaction ? handleUpdateTransaction : handleCreateTransaction}
        title={currentTransaction ? "Edit Transaction" : "Create New Transaction"}
        accounts={accounts}
        categories={categories}
      />
    </Box>
  );
};

export default TransactionsList;
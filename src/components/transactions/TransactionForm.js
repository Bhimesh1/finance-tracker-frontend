import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TransactionForm = ({ 
  open, 
  handleClose, 
  transaction, 
  onSubmit, 
  title,
  accounts = [],
  categories = []
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    transactionDate: new Date(),
    accountId: '',
    categoryId: '',
    notes: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        type: transaction.type || 'EXPENSE',
        transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate) : new Date(),
        accountId: transaction.account?.id || '',
        categoryId: transaction.category?.id || '',
        notes: transaction.notes || ''
      });
    } else if (accounts.length > 0) {
      // Set default account if creating new transaction
      setFormData(prev => ({
        ...prev,
        accountId: accounts[0].id
      }));
    }
  }, [transaction, accounts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      transactionDate: newDate
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
    handleClose();
  };

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    category => formData.type === 'INCOME' 
      ? category.type === 'INCOME' 
      : category.type === 'EXPENSE'
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title || 'Transaction'}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="INCOME">Income</MenuItem>
                    <MenuItem value="EXPENSE">Expense</MenuItem>
                    <MenuItem value="TRANSFER">Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: <span>$</span>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Account</InputLabel>
                  <Select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    label="Account"
                    required
                  >
                    {accounts.map(account => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="">None</MenuItem>
                    {filteredCategories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  label="Transaction Date"
                  value={formData.transactionDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  value={formData.notes}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          {transaction ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;
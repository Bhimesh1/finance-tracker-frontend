import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Grid, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const BudgetForm = ({ open, handleClose, budget, onSubmit, title, categories = [] }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: new Date()
  });
  
  // Filter to only show expense categories
  const expenseCategories = categories.filter(category => category.type === 'EXPENSE');

  useEffect(() => {
    if (budget) {
      setFormData({
        categoryId: budget.category?.id || '',
        amount: budget.amount?.toString() || '',
        period: budget.period ? new Date(budget.period) : new Date()
      });
    } else if (expenseCategories.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: expenseCategories[0].id
      }));
    }
  }, [budget, expenseCategories]);

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
      period: newDate
    }));
  };

  const handleSubmit = () => {
    // Convert date to YYYY-MM format for API
    const monthString = (formData.period.getMonth() + 1).toString().padStart(2, '0');
    const yearString = formData.period.getFullYear();
    
    // Create a YearMonth object in format YYYY-MM
    const periodFormatted = `${yearString}-${monthString}`;
    
    onSubmit({
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      period: periodFormatted
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || 'Budget'}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    label="Category"
                    required
                  >
                    {expenseCategories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="amount"
                  label="Budget Amount"
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
              <Grid item xs={12}>
                <DatePicker
                  label="Budget Month"
                  views={['year', 'month']}
                  value={formData.period}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <Typography variant="caption" color="text.secondary">
                  This budget will be applied for the entire month.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {budget ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetForm;
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Grid, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const GoalForm = ({ open, handleClose, goal, onSubmit, title, accounts = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)), // 6 months from now
    accountId: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        description: goal.description || '',
        targetAmount: goal.targetAmount?.toString() || '',
        currentAmount: goal.currentAmount?.toString() || '0',
        targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(),
        accountId: goal.account?.id || ''
      });
    } else if (accounts.length > 0) {
      setFormData(prev => ({
        ...prev,
        accountId: accounts[0].id
      }));
    }
  }, [goal, accounts]);

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
      targetDate: newDate
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      name: formData.name,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || 0),
      targetDate: formData.targetDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      accountId: formData.accountId || null
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || 'Financial Goal'}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Goal Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="targetAmount"
                  label="Target Amount"
                  type="number"
                  value={formData.targetAmount}
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
                <TextField
                  name="currentAmount"
                  label="Current Amount"
                  type="number"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <span>$</span>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="Target Date"
                  value={formData.targetDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  minDate={new Date()} // Cannot set date in the past
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Associated Account (Optional)</InputLabel>
                  <Select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    label="Associated Account (Optional)"
                  >
                    <MenuItem value="">None</MenuItem>
                    {accounts.map(account => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
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
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {goal ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalForm;
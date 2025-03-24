import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, Box
} from '@mui/material';

const AccountForm = ({ open, handleClose, account, onSubmit, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'CHECKING',
    balance: '',
    institution: ''
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        description: account.description || '',
        type: account.type || 'CHECKING',
        balance: account.balance?.toString() || '',
        institution: account.institution || ''
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      balance: Number(formData.balance)
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || 'Account'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Account Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Account Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Account Type"
                >
                  <MenuItem value="CHECKING">Checking</MenuItem>
                  <MenuItem value="SAVINGS">Savings</MenuItem>
                  <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                  <MenuItem value="INVESTMENT">Investment</MenuItem>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="balance"
                label="Balance"
                type="number"
                value={formData.balance}
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
              <TextField
                name="institution"
                label="Institution"
                value={formData.institution}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          {account ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountForm;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Button, Chip, Divider, CircularProgress,
  Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TransactionTable from '../../components/transactions/TransactionTable';
import AccountForm from '../../components/accounts/AccountForm';
import { getAccountById, updateAccount, deleteAccount } from '../../api/accountApi';
import { getTransactionsByAccount } from '../../api/transactionApi';

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const accountData = await getAccountById(id);
      setAccount(accountData);
      
      const transactionsData = await getTransactionsByAccount(id);
      setTransactions(transactionsData);
      
      setError('');
    } catch (err) {
      setError('Failed to load account details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [id]);

  const handleUpdateAccount = async (accountData) => {
    try {
      await updateAccount(id, accountData);
      fetchAccountData();
    } catch (err) {
      setError('Failed to update account');
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(id);
      navigate('/accounts');
    } catch (err) {
      setError('Failed to delete account');
      console.error(err);
      setOpenDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!account) {
    return (
      <Alert severity="error">
        Account not found
      </Alert>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{account.name}</Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setOpenEditForm(true)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Account Type
            </Typography>
            <Chip 
              label={account.type} 
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Institution
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {account.institution || 'Not specified'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Balance
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              ${account.balance.toFixed(2)}
            </Typography>
          </Grid>
          {account.description && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                Description
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {account.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Transactions
        </Typography>
        <TransactionTable 
          transactions={transactions}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </Box>

      <AccountForm
        open={openEditForm}
        handleClose={() => setOpenEditForm(false)}
        account={account}
        onSubmit={handleUpdateAccount}
        title="Edit Account"
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this account? This action cannot be undone, and all transactions associated with this account will be affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountDetails;
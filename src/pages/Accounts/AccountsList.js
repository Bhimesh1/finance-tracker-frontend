import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCard from '../../components/accounts/AccountCard';
import AccountForm from '../../components/accounts/AccountForm';
import { getAllAccounts, createAccount } from '../../api/accountApi';

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAllAccounts();
      setAccounts(data);
      setError('');
    } catch (err) {
      setError('Failed to load accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (accountData) => {
    try {
      await createAccount(accountData);
      fetchAccounts();
    } catch (err) {
      setError('Failed to create account');
      console.error(err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Accounts</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Account
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        accounts.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No accounts found. Create your first account to get started.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {accounts.map(account => (
              <Grid item xs={12} sm={6} md={4} key={account.id}>
                <AccountCard account={account} />
              </Grid>
            ))}
          </Grid>
        )
      )}

      <AccountForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        onSubmit={handleCreateAccount}
        title="Create New Account"
      />
    </Box>
  );
};

export default AccountsList;
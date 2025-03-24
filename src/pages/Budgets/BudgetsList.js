import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, CircularProgress, Alert, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import BudgetCard from '../../components/budgets/BudgetCard';
import BudgetForm from '../../components/budgets/BudgetForm';
import { getAllBudgets, getBudgetsByPeriod, createBudget, updateBudget, deleteBudget } from '../../api/budgetApi';
import { getAllCategories } from '../../api/categoryApi';

const BudgetsList = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      const data = await getBudgetsByPeriod(year, month);
      setBudgets(data);
      setError('');
    } catch (err) {
      setError('Failed to load budgets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, [selectedMonth]);

  const handleCreateBudget = async (budgetData) => {
    try {
      await createBudget(budgetData);
      fetchBudgets();
      setOpenForm(false);
    } catch (err) {
      setError('Failed to create budget');
      console.error(err);
    }
  };

  const handleUpdateBudget = async (budgetData) => {
    try {
      await updateBudget(currentBudget.id, budgetData);
      fetchBudgets();
      setOpenForm(false);
      setCurrentBudget(null);
    } catch (err) {
      setError('Failed to update budget');
      console.error(err);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchBudgets();
      } catch (err) {
        setError('Failed to delete budget');
        console.error(err);
      }
    }
  };

  const handleEditBudget = (budget) => {
    setCurrentBudget(budget);
    setOpenForm(true);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Budgets</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentBudget(null);
            setOpenForm(true);
          }}
        >
          Add Budget
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Month
          </Typography>
          <DatePicker
            views={['year', 'month']}
            value={selectedMonth}
            onChange={handleMonthChange}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
        </Box>
      </LocalizationProvider>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        budgets.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No budgets found for this month. Create a budget to start tracking your spending.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {budgets.map(budget => (
              <Grid item xs={12} sm={6} md={4} key={budget.id}>
                <BudgetCard 
                  budget={budget} 
                  onClick={() => handleEditBudget(budget)} 
                />
              </Grid>
            ))}
          </Grid>
        )
      )}

      <BudgetForm
        open={openForm}
        handleClose={() => {
          setOpenForm(false);
          setCurrentBudget(null);
        }}
        budget={currentBudget}
        onSubmit={currentBudget ? handleUpdateBudget : handleCreateBudget}
        title={currentBudget ? "Edit Budget" : "Create New Budget"}
        categories={categories}
      />
    </Box>
  );
};

export default BudgetsList;
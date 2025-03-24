import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, CircularProgress, Alert, Tabs, Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GoalCard from '../../components/goals/GoalCard';
import GoalForm from '../../components/goals/GoalForm';
import GoalProgressDialog from '../../components/goals/GoalProgressDialog';
import { getAllGoals, getGoalsByStatus, createGoal, updateGoal, updateGoalProgress, deleteGoal } from '../../api/goalApi';
import { getAllAccounts } from '../../api/accountApi';

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const tabOptions = ['ALL', 'IN_PROGRESS', 'ACHIEVED', 'FAILED'];

  const fetchGoals = async () => {
    try {
      setLoading(true);
      let data;
      
      if (tabValue === 0) {
        data = await getAllGoals();
      } else {
        data = await getGoalsByStatus(tabOptions[tabValue]);
      }
      
      setGoals(data);
      setError('');
    } catch (err) {
      setError('Failed to load goals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('Failed to load accounts', err);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchAccounts();
  }, [tabValue]);

  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      fetchGoals();
      setOpenForm(false);
    } catch (err) {
      setError('Failed to create goal');
      console.error(err);
    }
  };

  const handleUpdateGoal = async (goalData) => {
    try {
      await updateGoal(currentGoal.id, goalData);
      fetchGoals();
      setOpenForm(false);
      setCurrentGoal(null);
    } catch (err) {
      setError('Failed to update goal');
      console.error(err);
    }
  };

  const handleUpdateProgress = async (amount) => {
    try {
      await updateGoalProgress(currentGoal.id, amount);
      fetchGoals();
      setOpenProgressDialog(false);
      setCurrentGoal(null);
    } catch (err) {
      setError('Failed to update progress');
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        fetchGoals();
      } catch (err) {
        setError('Failed to delete goal');
        console.error(err);
      }
    }
  };

  const handleEditGoal = (goal) => {
    setCurrentGoal(goal);
    setOpenForm(true);
  };

  const handleUpdateGoalProgress = (goal) => {
    setCurrentGoal(goal);
    setOpenProgressDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Financial Goals</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentGoal(null);
            setOpenForm(true);
          }}
        >
          Add Goal
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="goal status tabs">
          <Tab label="All Goals" />
          <Tab label="In Progress" />
          <Tab label="Achieved" />
          <Tab label="Failed" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        goals.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No goals found. Create a goal to start tracking your progress.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {goals.map(goal => (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <GoalCard 
                  goal={goal} 
                  onClick={() => {
                    if (goal.status === 'IN_PROGRESS') {
                      handleUpdateGoalProgress(goal);
                    } else {
                      handleEditGoal(goal);
                    }
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        )
      )}

      <GoalForm
        open={openForm}
        handleClose={() => {
          setOpenForm(false);
          setCurrentGoal(null);
        }}
        goal={currentGoal}
        onSubmit={currentGoal ? handleUpdateGoal : handleCreateGoal}
        title={currentGoal ? "Edit Goal" : "Create New Goal"}
        accounts={accounts}
      />

      <GoalProgressDialog
        open={openProgressDialog}
        handleClose={() => {
          setOpenProgressDialog(false);
          setCurrentGoal(null);
        }}
        goal={currentGoal}
        onSubmit={handleUpdateProgress}
      />
    </Box>
  );
};

export default GoalsList;
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, LinearProgress
} from '@mui/material';

const GoalProgressDialog = ({ open, handleClose, goal, onSubmit }) => {
  const [amount, setAmount] = useState(goal?.currentAmount || 0);

  if (!goal) return null;

  const progress = goal.progressPercentage || 0;
  const remaining = goal.targetAmount - goal.currentAmount;

  const handleChange = (e) => {
    setAmount(parseFloat(e.target.value) || 0);
  };

  const handleSubmit = () => {
    onSubmit(amount);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Goal Progress</DialogTitle>
     <DialogContent>
       <Box sx={{ my: 2 }}>
         <Typography variant="h6" gutterBottom>
           {goal.name}
         </Typography>
         <LinearProgress 
           variant="determinate" 
           value={Math.min(progress, 100)} 
           sx={{ height: 10, borderRadius: 5, mb: 2 }}
         />
         
         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
           <Typography variant="body2">
             Current: ${goal.currentAmount?.toFixed(2) || '0.00'}
           </Typography>
           <Typography variant="body2">
             Target: ${goal.targetAmount?.toFixed(2) || '0.00'}
           </Typography>
         </Box>
         
         <Typography variant="body2" color="text.secondary" gutterBottom>
           ${remaining?.toFixed(2)} remaining to reach your goal
         </Typography>
         
         <TextField
           label="Current Amount"
           type="number"
           value={amount}
           onChange={handleChange}
           fullWidth
           margin="normal"
           InputProps={{
             startAdornment: <span>$</span>,
           }}
         />
         
         <Typography variant="caption" color="text.secondary">
           Update the current amount to track your progress
         </Typography>
       </Box>
     </DialogContent>
     <DialogActions>
       <Button onClick={handleClose}>Cancel</Button>
       <Button onClick={handleSubmit} variant="contained" color="primary">
         Update Progress
       </Button>
     </DialogActions>
   </Dialog>
 );
};

export default GoalProgressDialog;
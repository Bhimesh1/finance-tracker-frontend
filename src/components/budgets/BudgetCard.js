import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

const getColorByPercentage = (percentage) => {
  if (percentage < 70) return 'success';
  if (percentage < 90) return 'warning';
  return 'error';
};

const BudgetCard = ({ budget, onClick }) => {
  const percentage = budget.spentPercentage || 0;
  const color = getColorByPercentage(percentage);

  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 3
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" noWrap>
            {budget.category?.name || 'Unknown Category'}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color={color}>
            {percentage.toFixed(0)}%
          </Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={Math.min(percentage, 100)} 
          color={color}
          sx={{ height: 8, borderRadius: 5, mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Spent
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Budget
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" fontWeight="medium">
            ${budget.spentAmount?.toFixed(2) || '0.00'}
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            ${budget.amount?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {budget.period?.substring(0, 7) || 'No period specified'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';

const getStatusColor = (status) => {
  switch (status) {
    case 'ACHIEVED':
      return 'success';
    case 'FAILED':
      return 'error';
    default:
      return 'primary';
  }
};

const GoalCard = ({ goal, onClick }) => {
  const progress = goal.progressPercentage || 0;
  const daysRemaining = goal.daysRemaining || 0;
  const statusColor = getStatusColor(goal.status);

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
            {goal.name}
          </Typography>
          <Chip 
            label={goal.status.replace('_', ' ')} 
            color={statusColor} 
            size="small" 
          />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={Math.min(progress, 100)} 
          color={goal.status === 'FAILED' ? 'error' : 'primary'}
          sx={{ height: 8, borderRadius: 5, mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Current
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Target
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" fontWeight="medium">
            ${goal.currentAmount?.toFixed(2) || '0.00'}
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            ${goal.targetAmount?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {progress.toFixed(0)}% complete
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {goal.status === 'IN_PROGRESS' 
              ? `${daysRemaining} days remaining` 
              : `Target: ${new Date(goal.targetDate).toLocaleDateString()}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, Box, Chip
} from '@mui/material';

const getAccountTypeColor = (type) => {
  const colors = {
    CHECKING: '#1976d2',
    SAVINGS: '#388e3c',
    CREDIT_CARD: '#d32f2f',
    INVESTMENT: '#f57c00',
    CASH: '#7b1fa2',
    OTHER: '#757575'
  };
  return colors[type] || colors.OTHER;
};

const AccountCard = ({ account }) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
      onClick={() => navigate(`/accounts/${account.id}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div" noWrap>
            {account.name}
          </Typography>
          <Chip 
            label={account.type} 
            size="small" 
            sx={{ 
              bgcolor: getAccountTypeColor(account.type),
              color: 'white'
            }} 
          />
        </Box>
        <Typography color="textSecondary" gutterBottom>
          {account.institution || 'Not specified'}
        </Typography>
        <Typography variant="h5" component="div" sx={{ mt: 2 }}>
          ${account.balance.toFixed(2)}
        </Typography>
        {account.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {account.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountCard;
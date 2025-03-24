import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack
  } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import SavingsIcon from '@mui/icons-material/Savings';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Finance Tracker
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 8, 
        textAlign: 'center',
        backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
      }}>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Take Control of Your Finances
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Track expenses, set budgets, and achieve your financial goals
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              sx={{ color: 'white', borderColor: 'white' }}
              size="large"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
          Why Choose Our Finance Tracker?
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="div" gutterBottom>
                  Track All Your Accounts
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage all your financial accounts in one place. Track balances, income, and expenses with ease.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <BarChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="div" gutterBottom>
                  Powerful Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Gain insights into your spending habits with detailed reports and visualizations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <SavingsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="div" gutterBottom>
                  Set & Achieve Goals
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create financial goals and track your progress toward achieving them over time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Stay on Budget
              </Typography>
              <Typography variant="body1" paragraph>
                Create custom budgets for different spending categories and track your progress. Get notified when you're approaching your limits.
              </Typography>
              <Typography variant="body1">
                Our intuitive dashboard gives you a quick overview of your finances at a glance, helping you make better financial decisions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  height: 300, 
                  bgcolor: 'primary.light',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h5" color="white">
                  Dashboard Preview
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, textAlign: 'center' }}>
        <Container>
          <Typography variant="h5" gutterBottom>
            Ready to take control of your finances?
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
      
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Home;
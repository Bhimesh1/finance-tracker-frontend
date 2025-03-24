import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Box, Typography, TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

const getTransactionTypeColor = (type) => {
  return type === 'INCOME' ? '#388e3c' : type === 'EXPENSE' ? '#d32f2f' : '#1976d2';
};

const TransactionTable = ({ 
    transactions = [], 
    onEdit, 
    onDelete,
    page,
    setPage,
    totalCount
   }) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
   
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
   
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
   
    if (!transactions.length) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" color="textSecondary">
            No transactions found.
          </Typography>
        </Box>
      );
    }
   
    return (
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.transactionDate), 'MM/dd/yyyy')}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {transaction.category && (
                      <Chip 
                        label={transaction.category.name} 
                        size="small"
                        style={{ 
                          backgroundColor: transaction.category.color || '#757575',
                          color: 'white'
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{transaction.account.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.type} 
                      size="small"
                      style={{ 
                        backgroundColor: getTransactionTypeColor(transaction.type),
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: transaction.type === 'INCOME' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => onEdit(transaction)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(transaction.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount || transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
   };
   
   export default TransactionTable;
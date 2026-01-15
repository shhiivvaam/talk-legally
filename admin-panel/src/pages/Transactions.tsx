import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useQuery } from 'react-query';
import { adminService } from '../services/api';

export default function Transactions() {
  const { data } = useQuery('transactions', () => adminService.getTransactions(50, 0));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.transactions?.map((transaction: any) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.user?.name || 'N/A'}</TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell>₹{transaction.amount?.toFixed(2)}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

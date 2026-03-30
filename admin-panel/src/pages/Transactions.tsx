import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useQuery } from 'react-query';
import { adminService } from '../services/api';

interface TransactionRecord {
  id: string;
  user?: { name: string };
  transactionType: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface TransactionsResponse {
  transactions: TransactionRecord[];
  total: number;
}

export default function Transactions() {
  const { data: response } = useQuery('transactions', () => adminService.getTransactions(50, 0));
  const transactionsData = response?.data as TransactionsResponse | undefined;

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
          {transactionsData?.transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.user?.name ?? 'N/A'}</TableCell>
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

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useQuery } from 'react-query';
import { adminService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
}

export default function UserManagement() {
  const { data: response } = useQuery('users', () => adminService.getUsers(20, 0));
  const usersData = response?.data as UsersResponse | undefined;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData?.users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>₹{user.walletBalance?.toFixed(2)}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

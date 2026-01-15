import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useQuery } from 'react-query';
import { adminService } from '../services/api';

export default function LawyerManagement() {
  const { data } = useQuery('lawyers', () => adminService.getLawyers(20, 0));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Earnings</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.lawyers?.map((lawyer: any) => (
            <TableRow key={lawyer.id}>
              <TableCell>{lawyer.name}</TableCell>
              <TableCell>{lawyer.email}</TableCell>
              <TableCell>
                <Chip
                  label={lawyer.verificationStatus}
                  color={lawyer.verificationStatus === 'approved' ? 'success' : 'warning'}
                />
              </TableCell>
              <TableCell>{lawyer.ratingAvg?.toFixed(1)} ⭐</TableCell>
              <TableCell>₹{lawyer.totalEarnings?.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

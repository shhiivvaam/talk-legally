import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useQuery } from 'react-query';
import { adminService } from '../services/api';

interface LawyerSummary {
  id: string;
  name: string;
  email: string;
  verificationStatus: string;
  ratingAvg: number;
  totalEarnings: number;
}

interface LawyersResponse {
  lawyers: LawyerSummary[];
  total: number;
}

export default function LawyerManagement() {
  const { data: response } = useQuery('lawyers', () => adminService.getLawyers(20, 0));
  const lawyersData = response?.data as LawyersResponse | undefined;

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
          {lawyersData?.lawyers?.map((lawyer) => (
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

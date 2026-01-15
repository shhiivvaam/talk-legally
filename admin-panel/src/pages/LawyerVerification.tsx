import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminService } from '../services/api';

export default function LawyerVerification() {
  const queryClient = useQueryClient();
  const { data: pendingLawyers } = useQuery('pendingLawyers', () => adminService.getPendingVerifications());

  const verifyMutation = useMutation(
    ({ id, status }: { id: string; status: string }) => adminService.verifyLawyer(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingLawyers');
      },
    }
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingLawyers?.map((lawyer: any) => (
            <TableRow key={lawyer.id}>
              <TableCell>{lawyer.name}</TableCell>
              <TableCell>{lawyer.email}</TableCell>
              <TableCell>{lawyer.phone}</TableCell>
              <TableCell>
                <Chip label={lawyer.verificationStatus} color="warning" />
              </TableCell>
              <TableCell>
                <Button
                  color="success"
                  onClick={() => verifyMutation.mutate({ id: lawyer.id, status: 'approved' })}
                >
                  Approve
                </Button>
                <Button
                  color="error"
                  onClick={() => verifyMutation.mutate({ id: lawyer.id, status: 'rejected' })}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

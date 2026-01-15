import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { adminService } from '../services/api';

export default function Dashboard() {
  const { data: analytics } = useQuery('analytics', () => adminService.getAnalytics('week'));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Total Sessions</Typography>
            <Typography variant="h4">{analytics?.totalSessions || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Total Revenue</Typography>
            <Typography variant="h4">₹{analytics?.totalRevenue?.toFixed(2) || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Active Users</Typography>
            <Typography variant="h4">{analytics?.activeUsers || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Active Lawyers</Typography>
            <Typography variant="h4">{analytics?.activeLawyers || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

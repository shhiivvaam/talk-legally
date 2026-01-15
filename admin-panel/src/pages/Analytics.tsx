import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from 'react-query';
import { adminService } from '../services/api';

export default function Analytics() {
  const { data } = useQuery('analytics', () => adminService.getAnalytics('month'));

  // Mock data for chart - in production, this would come from the API
  const chartData = [
    { name: 'Week 1', sessions: 120, revenue: 50000 },
    { name: 'Week 2', sessions: 150, revenue: 65000 },
    { name: 'Week 3', sessions: 180, revenue: 78000 },
    { name: 'Week 4', sessions: 200, revenue: 90000 },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sessions" stroke="#8884d8" />
        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

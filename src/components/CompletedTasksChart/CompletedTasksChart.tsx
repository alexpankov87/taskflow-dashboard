import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task } from '../../types';

interface CompletedTasksChartProps {
  tasks: Task[];
}

const CompletedTasksChart: React.FC<CompletedTasksChartProps> = ({ tasks }) => {
  // Берём только выполненные задачи с датой завершения
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt);

  // Группировка по дням за последние 7 дней
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();

  const data = last7Days.map(date => {
    const count = completedTasks.filter(t => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === date.getTime();
    }).length;

    return {
      date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      count,
    };
  });

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>Выполнено задач по дням</Typography>
      <Box sx={{ width: '100%', height: 'calc(100% - 40px)' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="Задач выполнено" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CompletedTasksChart;
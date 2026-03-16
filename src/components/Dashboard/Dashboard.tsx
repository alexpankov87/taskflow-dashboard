import React, { useState } from 'react';
import { Paper, Typography, Box, IconButton, Tooltip, Button } from '@mui/material';
import { Brightness4, Brightness7, Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import TaskBoard from '../TaskBoard/TaskBoard';
import FilteredTasksModal from '../FilteredTasksModal/FilteredTasksModal';
import TaskModal from '../TaskModal/TaskModal';
import CompletedTasksChart from '../CompletedTasksChart/CompletedTasksChart';
import type { Task } from '../../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      stiffness: 100,
      damping: 12,
    },
  },
};

const Dashboard: React.FC = () => {
  const { tasks, updateTask, addTask, deleteTask } = useTasks(); // добавили deleteTask
  const { mode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const todayDate = new Date().setHours(0, 0, 0, 0);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t: Task) => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter((t: Task) => t.status === 'pending').length;
  const overdueTasks = tasks.filter((t: Task) => {
    if (!t.dueDate || t.status === 'completed') return false;
    const taskDate = new Date(t.dueDate).setHours(0, 0, 0, 0);
    return taskDate < todayDate;
  }).length;

  const priorityData = [
    { name: 'High', value: tasks.filter((t: Task) => t.priority === 'high').length },
    { name: 'Medium', value: tasks.filter((t: Task) => t.priority === 'medium').length },
    { name: 'Low', value: tasks.filter((t: Task) => t.priority === 'low').length },
  ];

  const statusData = [
    { name: 'Pending', value: pendingTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Completed', value: completedTasks },
  ];

  const handleCardClick = (filterType: string) => {
    let filtered: Task[] = [];
    let title = '';

    switch (filterType) {
      case 'total':
        filtered = tasks;
        title = 'Все задачи';
        break;
      case 'completed':
        filtered = tasks.filter(t => t.status === 'completed');
        title = 'Выполненные задачи';
        break;
      case 'inProgress':
        filtered = tasks.filter(t => t.status === 'in-progress');
        title = 'Задачи в работе';
        break;
      case 'pending':
        filtered = tasks.filter(t => t.status === 'pending');
        title = 'Ожидающие задачи';
        break;
      case 'overdue':
        filtered = tasks.filter(t => {
          if (!t.dueDate || t.status === 'completed') return false;
          const taskDate = new Date(t.dueDate).setHours(0, 0, 0, 0);
          return taskDate < todayDate;
        });
        title = 'Просроченные задачи';
        break;
      default:
        return;
    }

    setFilteredTasks(filtered);
    setModalTitle(title);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Удалить задачу?')) {
      deleteTask(id);
    }
  };

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setEditModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (selectedTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
    setEditModalOpen(false);
    setSelectedTask(undefined);
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Dashboard
          </Typography>
          <Tooltip title={mode === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.selected',
                '&:hover': {
                  bgcolor: 'action.hover',
                  boxShadow: 2,
                },
                transition: 'all 0.2s',
              }}
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      <motion.div
        variants={cardContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {[
            { label: 'Всего задач', value: totalTasks, filter: 'total' },
            { label: 'Выполнено', value: completedTasks, filter: 'completed' },
            { label: 'В работе', value: inProgressTasks, filter: 'inProgress' },
            { label: 'Ожидают', value: pendingTasks, filter: 'pending' },
            { label: 'Просрочено', value: overdueTasks, filter: 'overdue' },
          ].map((card) => (
            <motion.div
              key={card.filter}
              variants={cardVariants}
              style={{ flex: '1 1 200px', minWidth: 200, cursor: 'pointer' }}
            >
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'scale(1.02)', boxShadow: 3 },
                }}
                onClick={() => handleCardClick(card.filter)}
              >
                <Typography variant="h6">{card.label}</Typography>
                <Typography variant="h3">{card.value}</Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </motion.div>

      {mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
            <Box sx={{ flex: 1, height: 300 }}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>Приоритеты задач</Typography>
                <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priorityData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
            <Box sx={{ flex: 1, height: 300 }}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>Статус задач</Typography>
                <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Линейный график выполнения задач */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ mb: 4 }}>
            <CompletedTasksChart tasks={tasks} />
          </Box>
        </motion.div>
      )}

      {/* Кнопка создания задачи */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddTask}>
          Новая задача
        </Button>
      </Box>

      {/* Доска с задачами — теперь передаём onEditTask и onDeleteTask */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <TaskBoard
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </motion.div>

      <FilteredTasksModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        tasks={filteredTasks}
      />

      <TaskModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
      />
    </Box>
  );
};

export default Dashboard;
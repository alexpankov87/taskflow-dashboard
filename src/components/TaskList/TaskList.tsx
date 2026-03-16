import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useTasks } from '../../context/TaskContext';
import TaskModal from '../TaskModal/TaskModal';
import type { Task } from '../../types';

interface TaskListProps {
  tasks?: Task[];          // если передан, используем этот список, иначе из контекста
  hideAddButton?: boolean;  // скрыть кнопку добавления (для модалок)
  onTaskChange?: () => void; // колбэк после изменений (если нужно)
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks: propTasks, 
  hideAddButton = false,
  onTaskChange 
}) => {
  const context = useTasks();
  // Используем переданные задачи или из контекста
  const tasks = propTasks !== undefined ? propTasks : context.tasks;
  const { updateTask, deleteTask, addTask } = context;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedTask(undefined);
    setModalOpen(true);
  };

  const handleSave = (task: Task) => {
    if (selectedTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
    onTaskChange?.();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить задачу?')) {
      deleteTask(id);
      onTaskChange?.();
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(undefined);
  };

  const statusLabels = {
    pending: 'Ожидает',
    'in-progress': 'В работе',
    completed: 'Выполнено'
  };

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  };

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      {!hideAddButton && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Список задач</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} size="small">
            Новая задача
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {tasks.map((task) => (
          <Box key={task.id} sx={{ flex: '1 1 300px', maxWidth: '100%' }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{task.title}</Typography>
                {task.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {task.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={statusLabels[task.status]} size="small"
                    color={task.status === 'completed' ? 'success' : 'default'} />
                  <Chip label={task.priority} size="small"
                    color={priorityColors[task.priority] as any} />
                </Box>
                {task.dueDate && (
                  <Typography variant="caption" display="block">
                    Срок: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleEdit(task)}><Edit /></IconButton>
                <IconButton size="small" onClick={() => handleDelete(task.id)}><Delete /></IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <TaskModal open={modalOpen} onClose={handleCloseModal} onSave={handleSave} task={selectedTask} />
    </Paper>
  );
};

export default TaskList;
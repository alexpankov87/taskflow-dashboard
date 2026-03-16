import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import type { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
    }
  }, [task, open]);

  const handleSave = () => {
    const newTask: Task = {
      id: task?.id || Date.now().toString(),
      title,
      description,
      status,
      priority,
      createdAt: task?.createdAt || new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };
    onSave(newTask);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Редактировать задачу' : 'Новая задача'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={status}
              label="Статус"
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value="pending">Ожидает</MenuItem>
              <MenuItem value="in-progress">В работе</MenuItem>
              <MenuItem value="completed">Выполнено</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Приоритет</InputLabel>
            <Select
              value={priority}
              label="Приоритет"
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <MenuItem value="low">Низкий</MenuItem>
              <MenuItem value="medium">Средний</MenuItem>
              <MenuItem value="high">Высокий</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Срок выполнения"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" disabled={!title}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
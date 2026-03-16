import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { Edit, Delete, DragIndicator } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.();
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{ mb: 2 }}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          {/* Ручка перетаскивания */}
          <Box
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'grab',
              mr: 1,
              color: 'action.active',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <DragIndicator />
          </Box>
          <CardContent sx={{ flex: 1, p: 0, '&:last-child': { pb: 0 } }}>
            <Typography variant="h6" gutterBottom>{task.title}</Typography>
            {task.description && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {task.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              <Chip
                label={statusLabels[task.status]}
                size="small"
                color={task.status === 'completed' ? 'success' : 'default'}
              />
              <Chip
                label={task.priority}
                size="small"
                color={priorityColors[task.priority] as any}
              />
            </Box>
            {task.dueDate && (
              <Typography variant="caption" display="block">
                Срок: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            )}
          </CardContent>
          <Box sx={{ display: 'flex', ml: 1 }}>
            <IconButton size="small" onClick={handleEditClick}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDeleteClick}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default TaskCard;
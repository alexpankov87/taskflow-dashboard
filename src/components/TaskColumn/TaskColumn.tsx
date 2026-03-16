import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from '../TaskCard/TaskCard';
import type { Task } from '../../types';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  droppableId: string;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 },
};

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks, droppableId, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isOver ? 'action.hover' : 'background.paper',
        transition: 'background-color 0.2s',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title} ({tasks.length})
      </Typography>
      <Box sx={{ flex: 1, minHeight: 200, overflowY: 'auto' }}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  onEdit={() => onEditTask?.(task)}
                  onDelete={() => onDeleteTask?.(task.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
      </Box>
    </Paper>
  );
};

export default TaskColumn;
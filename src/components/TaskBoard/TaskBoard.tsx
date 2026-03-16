import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useTasks } from '../../context/TaskContext';
import TaskColumn from '../TaskColumn/TaskColumn';
import type { Task } from '../../types';

interface TaskBoardProps {
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ onEditTask, onDeleteTask }) => {
  const { tasks, updateTask } = useTasks();

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverColumn = ['pending', 'inProgress', 'completed'].includes(overId);

    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    if (isOverColumn) {
      let newStatus: Task['status'] = task.status;
      if (overId === 'pending') newStatus = 'pending';
      else if (overId === 'inProgress') newStatus = 'in-progress';
      else if (overId === 'completed') newStatus = 'completed';

      if (newStatus !== task.status) {
        updateTask({ ...task, status: newStatus });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mt: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <TaskColumn
            title="Ожидают"
            tasks={pendingTasks}
            droppableId="pending"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <TaskColumn
            title="В работе"
            tasks={inProgressTasks}
            droppableId="inProgress"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <TaskColumn
            title="Выполнено"
            tasks={completedTasks}
            droppableId="completed"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        </motion.div>
      </Box>
    </DndContext>
  );
};

export default TaskBoard;
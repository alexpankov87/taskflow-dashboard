import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TaskList from '../TaskList/TaskList';
import type { Task } from '../../types';

interface FilteredTasksModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tasks: Task[];
}

const FilteredTasksModal: React.FC<FilteredTasksModalProps> = ({ open, onClose, title, tasks }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TaskList tasks={tasks} hideAddButton onTaskChange={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default FilteredTasksModal;
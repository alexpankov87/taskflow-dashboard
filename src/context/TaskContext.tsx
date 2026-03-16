import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Изучить React',
    description: 'Пройти туториал на официальном сайте',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(2025, 2, 1),
    dueDate: new Date(2025, 2, 10),
    completedAt: new Date(2025, 2, 9), // пример даты выполнения
  },
  {
    id: '2',
    title: 'Создать дашборд',
    description: 'Разработать компоненты Dashboard',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(2025, 2, 5),
    dueDate: new Date(2025, 2, 15),
  },
  {
    id: '3',
    title: 'Покрыть тестами',
    description: 'Написать тесты для ключевых компонентов',
    status: 'pending',
    priority: 'low',
    createdAt: new Date(2025, 2, 7),
    dueDate: new Date(2025, 2, 20),
  },
  {
    id: '4',
    title: 'Задеплоить проект',
    description: 'Выложить на Vercel',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(2025, 2, 8),
    dueDate: new Date(2025, 2, 18),
  },
];

interface TaskContextType {
  tasks: Task[];
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
  addTask: (task: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved, (key, value) => {
          if (key === 'createdAt' || key === 'dueDate' || key === 'completedAt') {
            return value ? new Date(value) : undefined;
          }
          return value;
        });
        return parsed;
      } catch {
        return initialTasks;
      }
    }
    return initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== updatedTask.id) return task;

      const wasCompleted = task.status === 'completed';
      const isCompleted = updatedTask.status === 'completed';

      let completedAt = updatedTask.completedAt;
      if (!wasCompleted && isCompleted) {
        // Стала выполненной – ставим текущую дату
        completedAt = new Date();
      } else if (wasCompleted && !isCompleted) {
        // Перестала быть выполненной – очищаем
        completedAt = undefined;
      }

      return { ...updatedTask, completedAt };
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addTask = (task: Task) => {
    // У новой задачи completedAt не нужен
    setTasks(prev => [...prev, { ...task, completedAt: undefined }]);
  };

  return (
    <TaskContext.Provider value={{ tasks, updateTask, deleteTask, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
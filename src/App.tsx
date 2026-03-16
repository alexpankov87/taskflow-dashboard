import React from 'react';
import { Container } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <ThemeProvider>  {/* наш кастомный провайдер темы */}
      <TaskProvider>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Dashboard />
        </Container>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
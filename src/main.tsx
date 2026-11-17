import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './ThemeContext';
import TodoApp from './components/TodoApp';
import './style.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('找不到 React 根节点');
}

createRoot(root).render(
  <ThemeProvider>
    <TodoApp />
  </ThemeProvider>
);

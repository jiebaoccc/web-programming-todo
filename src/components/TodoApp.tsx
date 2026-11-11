
import { useEffect, useState } from 'react';
import {
  addTodo,
  nextTodoId,
  parseTodos,
  removeTodo,
  toggleTodo,
  type Todo,
} from '../todo';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const KEY = 'todos';

function loadTodos(): Todo[] {
  try {
    return parseTodos(localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [feedback, setFeedback] = useState('');

  // 当 todos 改变时，保存到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(todos));
    } catch {
      setFeedback('保存失败：本地存储不可用。');
    }
  }, [todos]);

  function handleAdd(text: string): boolean {
    const id = nextTodoId(todos, Date.now());
    const result = addTodo(todos, text, id);

    if (!result.added) {
      setFeedback('请输入非空且未超长的待办事项。');
      return false;
    }

    setTodos(prev => {
      const newId = nextTodoId(prev, Date.now());
      return addTodo(prev, text, newId).todos;
    });
    setFeedback('');
    return true;
  }

  function handleToggle(id: number) {
    setTodos(prev => toggleTodo(prev, id));
  }

  function handleDelete(id: number) {
    setTodos(prev => removeTodo(prev, id));
  }

  return (
    <main>
      <h1>Todo V4.0</h1>
      <TodoForm onAdd={handleAdd} />

      <p id="todo-feedback" role="status">
        {feedback}
      </p>

      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </main>
  );
}

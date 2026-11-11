
import type { Todo } from '../todo';
import TodoItem from './TodoItem';

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
}: TodoListProps) {
  return (
    <ul id="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

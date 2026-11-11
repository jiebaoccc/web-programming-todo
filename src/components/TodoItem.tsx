
import type { Todo } from '../todo';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <li className={todo.completed ? 'done' : ''}>
      <button
        type="button"
        className="todo-text"
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </button>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label={'删除待办：' + todo.text}
      >
        删除
      </button>
    </li>
  );
}

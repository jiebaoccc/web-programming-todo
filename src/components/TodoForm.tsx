
import { useState, type FormEvent } from 'react';

interface TodoFormProps {
  onAdd: (text: string) => boolean;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const added = onAdd(text);

    if (added) {
      setText('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder="输入待办事项"
        maxLength={120}
      />

      <button type="submit">添加</button>
    </form>
  );
}

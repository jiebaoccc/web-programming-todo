
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 纯函数：不可变添加任务
export function addTask(
  todos: Todo[],
  text: string,
  now: number
): Todo[] {
  const value = text.trim();

  // 空白输入不添加任务
  if (!value) return todos;

  // 检查 ID 是否重复
  const ids = new Set(todos.map(t => t.id));
  let id = now;

  while (ids.has(id)) {
    id += 1;
  }

  // 创建新数组，不修改原 State
  return [
    ...todos,
    {
      id,
      text: value,
      completed: false,
    },
  ];
}

// 纯函数：不可变切换完成状态
export function toggleTask(
  todos: Todo[],
  id: number
): Todo[] {
  return todos.map(t =>
    t.id === id
      ? { ...t, completed: !t.completed }
      : t
  );
}

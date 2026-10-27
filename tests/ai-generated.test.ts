// 示例：AI 第一版测试（特意保留待审查的无效断言，不应视为充分测试）。
import { describe, expect, it } from 'vitest';
import { addTodo, toggleTodo, type Todo } from '../src/todo.js';

describe('AI 初版测试', () => {
  it('添加后列表长度不为负数（无效：无法证明真的添加成功）', () => {
    const result = addTodo([], '学习 TypeScript', 1);
    expect(result.todos.length).toBeGreaterThanOrEqual(0);
  });

  it('切换函数返回数组（无效：无法证明 completed 发生变化）', () => {
    const initial: Todo[] = [{ id: 1, text: '任务', completed: false }];
    expect(Array.isArray(toggleTodo(initial, 1))).toBe(true);
  });
});

// 任务 2：addTodo 与 toggleTodo 基础单元测试（AI 辅助编写）。
import { describe, expect, it } from 'vitest';
import { addTodo, toggleTodo, type Todo } from '../src/todo.js';

describe('addTodo 添加待办', () => {
  it('正常添加：文本去除首尾空格，初始状态为未完成', () => {
    const result = addTodo([], '  完成 Web 作业  ', 101);
    expect(result.added).toBe(true);
    expect(result.todos).toEqual([
      { id: 101, text: '完成 Web 作业', completed: false }
    ]);
  });

  it('空白输入：拒绝添加，列表保持不变', () => {
    const initial: Todo[] = [{ id: 1, text: '已有事项', completed: false }];
    const result = addTodo(initial, '  \t  ', 102);
    expect(result.added).toBe(false);
    expect(result.todos).toEqual(initial);
    expect(initial).toHaveLength(1);
  });

  it('空字符串：拒绝添加', () => {
    const result = addTodo([], '', 103);
    expect(result.added).toBe(false);
    expect(result.todos.length).toBe(0);
  });

  it('重复 ID：拒绝添加，原任务未被覆盖', () => {
    const initial: Todo[] = [{ id: 1, text: '已有事项', completed: false }];
    const result = addTodo(initial, '新事项', 1);
    expect(result.added).toBe(false);
    expect(result.todos).toEqual(initial);
  });

  it('文本超过 120 字符：拒绝添加', () => {
    const result = addTodo([], 'a'.repeat(121), 103);
    expect(result.added).toBe(false);
    expect(result.todos).toEqual([]);
  });

  it('正常添加不会修改原数组', () => {
    const initial: Todo[] = [{ id: 1, text: '已有事项', completed: true }];
    const result = addTodo(initial, '新增事项', 2);
    expect(initial).toEqual([{ id: 1, text: '已有事项', completed: true }]);
    expect(result.todos).toHaveLength(2);
    expect(result.todos).not.toBe(initial);
  });
});

describe('toggleTodo 切换待办状态', () => {
  it('未完成切换为已完成', () => {
    const initial: Todo[] = [{ id: 1, text: '任务 A', completed: false }];
    const result = toggleTodo(initial, 1);
    expect(result[0]?.completed).toBe(true);
  });

  it('已完成切换为未完成', () => {
    const initial: Todo[] = [{ id: 1, text: '任务 A', completed: true }];
    const result = toggleTodo(initial, 1);
    expect(result[0]?.completed).toBe(false);
  });

  it('连续切换两次，恢复初始状态', () => {
    const initial: Todo[] = [{ id: 1, text: '任务 A', completed: false }];
    const twice = toggleTodo(toggleTodo(initial, 1), 1);
    expect(twice).toEqual(initial);
  });

  it('不存在的 ID：不改变任务内容或状态', () => {
    const initial: Todo[] = [{ id: 1, text: '任务 A', completed: false }];
    expect(toggleTodo(initial, 999)).toEqual(initial);
  });

  it('切换指定任务时，其他任务不受影响，原数组不被修改', () => {
    const initial: Todo[] = [
      { id: 1, text: '任务 A', completed: false },
      { id: 2, text: '任务 B', completed: true }
    ];
    const result = toggleTodo(initial, 1);
    expect(result).toEqual([
      { id: 1, text: '任务 A', completed: true },
      { id: 2, text: '任务 B', completed: true }
    ]);
    expect(initial[0]?.completed).toBe(false);
    expect(initial[1]?.completed).toBe(true);
  });
});

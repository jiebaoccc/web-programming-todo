// AI 测试审查后的修补参考（任务 3），不是手写测试任务 2 的成果。
import { describe, expect, it } from 'vitest';
import { addTodo, parseTodoId, parseTodos, toggleTodo, type Todo } from '../src/todo.js';

describe('AI 测试修补', () => {
  it('添加后检查内容、ID 和初始状态', () => {
    const result = addTodo([], '  学习 TypeScript  ', 5);
    expect(result.added).toBe(true);
    expect(result.todos).toEqual([{ id: 5, text: '学习 TypeScript', completed: false }]);
  });

  it('无效空白文本被拦截，原列表不变', () => {
    const initial: Todo[] = [{ id: 1, text: '已有任务', completed: false }];
    const result = addTodo(initial, '  \t ', 2);
    expect(result.added).toBe(false);
    expect(result.todos).toEqual(initial);
  });

  it('切换一次变为已完成，切换两次恢复未完成', () => {
    const initial: Todo[] = [{ id: 1, text: '任务', completed: false }];
    const once = toggleTodo(initial, 1);
    expect(once[0]?.completed).toBe(true);
    expect(toggleTodo(once, 1)[0]?.completed).toBe(false);
    expect(initial[0]?.completed).toBe(false);
  });

  it('不存在的 ID 不改变已有任务状态', () => {
    const initial: Todo[] = [{ id: 1, text: '任务', completed: false }];
    expect(toggleTodo(initial, 99)).toEqual(initial);
  });

  it('过滤损坏或类型错误的持久化数据', () => {
    const raw = JSON.stringify([
      { id: 1, text: '有效', completed: false },
      { id: '2', text: '错误类型', completed: false },
      { id: 3, text: '', completed: true },
      { id: 1, text: '重复 ID', completed: true }
    ]);
    expect(parseTodos(raw)).toEqual([{ id: 1, text: '有效', completed: false }]);
    expect(parseTodos('{invalid')).toEqual([]);
  });

  it('dataset.id 拦截 NaN、负数、小数及不安全整数', () => {
    expect(parseTodoId('12')).toBe(12);
    for (const input of [undefined, '-1', '3.5', 'abc', '9007199254740992']) {
      expect(parseTodoId(input)).toBeNull();
    }
  });
});


import { describe, expect, it } from 'vitest';
import {
  addTask,
  toggleTask,
  type Todo,
} from '../src/fake-react-logic';

describe('任务3：AI 修复代码业务验证', () => {
  it('空字符串不能添加任务', () => {
    const result = addTask([], '', 101);
    expect(result).toHaveLength(0);
  });

  it('纯空格不能添加任务', () => {
    const result = addTask([], '  \t  ', 102);
    expect(result).toHaveLength(0);
  });

  it('正常添加并去除首尾空格', () => {
    const result = addTask([], '  任务A  ', 103);

    expect(result).toEqual([
      { id: 103, text: '任务A', completed: false },
    ]);
  });

  it('添加任务不修改原数组', () => {
    const initial: Todo[] = [
      { id: 1, text: '原任务', completed: false },
    ];

    const result = addTask(initial, '任务B', 2);

    expect(initial).toHaveLength(1);
    expect(result).toHaveLength(2);
    expect(result).not.toBe(initial);
  });

  it('重复 ID 自动生成新 ID', () => {
    const initial: Todo[] = [
      { id: 101, text: '任务A', completed: false },
    ];

    const result = addTask(initial, '任务B', 101);

    expect(result[1]?.id).toBe(102);
  });

  it('未完成切换为已完成', () => {
    const initial: Todo[] = [
      { id: 1, text: '任务A', completed: false },
    ];

    const result = toggleTask(initial, 1);

    expect(result[0]?.completed).toBe(true);
    expect(result).not.toBe(initial);
    expect(result[0]).not.toBe(initial[0]);
  });

  it('连续切换两次恢复原状态', () => {
    const initial: Todo[] = [
      { id: 1, text: '任务A', completed: false },
    ];

    const result = toggleTask(toggleTask(initial, 1), 1);

    expect(result).toEqual(initial);
  });

  it('不存在的 ID 不改变其他任务', () => {
    const initial: Todo[] = [
      { id: 1, text: '任务A', completed: false },
    ];

    const result = toggleTask(initial, 999);

    expect(result).toEqual(initial);
  });
});

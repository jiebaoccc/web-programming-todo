# 任务 2：请自己独立手写测试

请新建 `tests/manual.test.ts`，不要复制 `ai-generated.test.ts` 或 `ai-revised.test.ts` 冒充手写。

至少独立测试：
- addTodo 正常输入：数组新增一项、text 正确、completed 为 false。
- addTodo 空字符串/全空格：拒绝添加、原列表不变。
- toggleTodo 存在 ID：false -> true（并检查其他任务未改变）。
- toggleTodo 不存在 ID：不应意外修改其他任务。

测试时可参考 `src/todo.ts` 的函数签名。完成后执行 `npm run test` 并截图。

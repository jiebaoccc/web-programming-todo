# 第 9 周：Todo V2.0 TypeScript 重构与单元测试

基于上传的 `app.js`、`index.html` 与 `style.css` 修改。`app_w8.js` 保留上一周原代码，`ai_original.js` 是此前的审查素材，不参与页面执行。

## 本地环境

需要 Node.js 20+。首次运行：

```bash
npm install
npm run build
npm run test
```

浏览器预览：进入项目目录执行 `python -m http.server 8000`，打开 `http://localhost:8000`（不要直接双击 HTML，因为模块脚本在 file:// 下可能被跨源策略阻止）。

## 文件说明
- `src/todo.ts`：纯函数业务逻辑，含 `interface Todo`、空值/脏数据/ID 处理。
- `src/app.ts`：DOM 事件、渲染、本地存储；安全处理缺失 DOM；dataset 字符串校验。
- `dist/`：`npm run build` 后生成的运行文件。
- `tests/ai-generated.test.ts`：用于审查的 AI 初版测试，包含故意保留的无效断言。
- `tests/ai-revised.test.ts`：针对上述问题的修补参考测试。
- `tests/HANDWRITTEN-TODO.md`：任务 2 的独立手写要求，须自行完成。

## 任务 3 结构化 Prompt 示例

角色：你是 TypeScript 单元测试工程师。背景：Todo V2.0 的业务逻辑位于 `src/todo.ts`，使用 Vitest。目标：生成针对 `addTodo` 和 `toggleTodo` 的测试。约束：不得使用 `any`，测试必须断言实际数据和状态变化，覆盖正常输入、空白输入及不存在的 ID，不依赖 DOM。输出：仅输出 `tests/ai-generated.test.ts` 测试代码，并逐条说明每条断言验证的业务行为。

注：`tests/ai-generated.test.ts` 是为审查练习保留的**故意不充分示例**，并非声称这段代码是某一次真实 AI 回复的原文。实际提交请将你与 AI 的真实问答记录及审查过程如实写进报告。

## 审查参考
- 初版 `expect(result.todos.length).toBeGreaterThanOrEqual(0)`：空数组也满足，不能证明添加成功。
- 初版 `expect(Array.isArray(toggleTodo(...))).toBe(true)`：即使切换失败、只返回原数组也成立。
- 需要补齐：空白输入、不存在的 ID、实际 completed 值变化；扩展持久化数据格式、重复 ID、`dataset.id` 非法格式与越界整数等边界。

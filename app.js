// 第6周：Todo V2.0 基础版，仅实现添加与显示
const input = document.querySelector('#todo-input');
const button = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');
const feedback = document.querySelector('#todo-feedback');

// 一查执行条件：避免 DOM 元素缺失导致空引用错误
if (!input || !button || !list || !feedback) {
  console.error('Todo 初始化失败：缺少必要的 DOM 元素。');
} else {
  button.addEventListener('click', () => {
    // 二查输入边界：过滤只包含空格的输入
    const text = input.value.trim();
    if (text === '') {
      feedback.textContent = '请输入非空的待办事项。';
      input.focus();
      return;
    }

    // 三查状态变化：安全创建节点并立即显示新条目
    const li = document.createElement('li');
    li.textContent = text; // 不把用户输入解析为 HTML
    list.appendChild(li);
    input.value = '';
    feedback.textContent = '';
    input.focus();
  });
}

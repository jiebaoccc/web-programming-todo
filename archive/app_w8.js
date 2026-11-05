
const input = document.querySelector('#todo-input');
const button = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');
const feedback = document.querySelector('#todo-feedback');

const KEY = 'todos';
let todos = load();

// 保存任务数据
function save() {
  localStorage.setItem(KEY, JSON.stringify(todos));
}

// 读取任务数据
function load() {
  const raw = localStorage.getItem(KEY);
  if (raw === null) return [];

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('读取待办数据失败：', error);
    return [];
  }
}

// 根据 todos 数组生成页面
function render() {
  list.innerHTML = '';

  todos.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    li.dataset.id = t.id;

    if (t.completed) {
      li.classList.add('done');
    }

    li.addEventListener('click', () => toggleTodo(t.id));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = '×';
    delBtn.setAttribute('aria-label', '删除待办：' + t.text);

    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      removeTodo(t.id);
    });

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// 添加任务：展开运算符生成新数组
function addTodo(text) {
  const value = text.trim();

  if (value === '') {
    feedback.textContent = '请输入非空的待办事项。';
    return;
  }

  const item = {
    id: Date.now(),
    text: value,
    completed: false
  };

  todos = [...todos, item];
  save();
  render();

  input.value = '';
  feedback.textContent = '';
  input.focus();
}

// 删除任务：filter 生成新数组
function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

// 切换完成状态：map + 对象展开
function toggleTodo(id) {
  todos = todos.map(t =>
    t.id === id
      ? { ...t, completed: !t.completed }
      : t
  );

  save();
  render();
}

// 初始化事件
if (!input || !button || !list || !feedback) {
  console.error('Todo 初始化失败：缺少必要的 DOM 元素。');
} else {
  button.addEventListener('click', () => {
    addTodo(input.value);
  });

  render();
}

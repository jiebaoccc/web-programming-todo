
const input = document.querySelector('#todo-input');
const button = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');
const feedback = document.querySelector('#todo-feedback');

const KEY = 'todos';
let todos = load();
let filter = 'all';
const filterButtons = document.querySelectorAll('.todo-filters button');

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

// 根据 todos 数组和筛选状态生成页面
function render() {
  list.innerHTML = '';

  // 根据当前筛选条件决定显示哪些任务
  const shown = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'done' ? t.completed : !t.completed
  );

  shown.forEach(t => {
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

  // 更新筛选按钮的选中状态
  filterButtons.forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
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

// 切换筛选状态：只改变视图，不修改任务数据
function setFilter(f) {
  if (!['all', 'active', 'done'].includes(f)) return;

  filter = f;
  render();
}

// 初始化事件
if (!input || !button || !list || !feedback) {
  console.error('Todo 初始化失败：缺少必要的 DOM 元素。');
} else {
  button.addEventListener('click', () => {
    addTodo(input.value);
  });

  // 绑定筛选按钮事件
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  render();
}

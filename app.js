
const input = document.querySelector('#todo-input');
const button = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');
const feedback = document.querySelector('#todo-feedback');

const KEY = 'todos';
let todos = load();
let filter = 'all';
let editingId = null;
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

// 根据任务数据及筛选条件重新渲染列表
function render() {
  if (!list) return;

  list.replaceChildren();

  const shown = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'done' ? t.completed : !t.completed
  );

  shown.forEach(t => {
    const li = document.createElement('li');
    li.dataset.id = String(t.id);

    if (t.completed) {
      li.classList.add('done');
    }

    // 当前任务正在编辑
    if (editingId === t.id) {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = t.text;
      editInput.maxLength = 120;
      editInput.className = 'todo-edit-input';
      editInput.setAttribute('aria-label', '编辑待办内容');

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.textContent = '保存';
      saveBtn.dataset.action = 'save';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = '取消';
      cancelBtn.dataset.action = 'cancel';

      li.appendChild(editInput);
      li.appendChild(saveBtn);
      li.appendChild(cancelBtn);
    } else {
      // 正常显示任务
      const taskText = document.createElement('span');
      taskText.textContent = t.text;
      taskText.className = 'todo-text';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = '编辑';
      editBtn.dataset.action = 'edit';
      editBtn.setAttribute('aria-label', '编辑待办：' + t.text);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.textContent = '×';
      delBtn.dataset.action = 'delete';
      delBtn.setAttribute('aria-label', '删除待办：' + t.text);

      li.appendChild(taskText);
      li.appendChild(editBtn);
      li.appendChild(delBtn);
    }

    list.appendChild(li);
  });

  // 更新筛选按钮状态
  filterButtons.forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

// 新增任务
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

// 删除任务
function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);

  if (editingId === id) {
    editingId = null;
  }

  save();
  render();
}

// 清除所有已完成任务
function clearCompleted() {
  todos = todos.filter(t => !t.completed);

  if (!todos.some(t => t.id === editingId)) {
    editingId = null;
  }

  save();
  render();
}

// 切换任务完成状态
function toggleTodo(id) {
  todos = todos.map(t =>
    t.id === id
      ? { ...t, completed: !t.completed }
      : t
  );

  save();
  render();
}

// 切换筛选状态
function setFilter(f) {
  if (!['all', 'active', 'done'].includes(f)) return;

  filter = f;
  editingId = null;
  render();
}

// 开始编辑
function startEdit(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  editingId = id;
  feedback.textContent = '';
  render();

  const item = Array.from(list.children).find(
    li => li.dataset.id === String(id)
  );

  const editInput = item?.querySelector('.todo-edit-input');

  if (editInput) {
    editInput.focus();
    editInput.select();
  }
}

// 保存编辑内容
function saveEdit(id) {
  const item = Array.from(list.children).find(
    li => li.dataset.id === String(id)
  );

  if (!item) return;

  const editInput = item.querySelector('.todo-edit-input');
  if (!editInput) return;

  const value = editInput.value.trim();

  if (value === '') {
    feedback.textContent = '待办内容不能为空。';
    editInput.focus();
    return;
  }

  if (value.length > 120) {
    feedback.textContent = '待办内容不能超过120个字符。';
    editInput.focus();
    return;
  }

  todos = todos.map(t =>
    t.id === id
      ? { ...t, text: value }
      : t
  );

  editingId = null;
  save();
  render();

  feedback.textContent = '';
}

// 取消编辑
function cancelEdit() {
  editingId = null;
  feedback.textContent = '';
  render();
}

// 初始化事件
if (!input || !button || !list || !feedback) {
  console.error('Todo 初始化失败：缺少必要的 DOM 元素。');
} else {
  // 添加任务
  button.addEventListener('click', () => {
    addTodo(input.value);
  });

  // 父容器统一处理列表点击事件
  list.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;

    const item = e.target.closest('li');

    // 防止点击列表空白区域或列表外元素
    if (!item || !list.contains(item)) return;

    const rawId = item.dataset.id;
    if (!rawId) return;

    const id = Number(rawId);
    if (!Number.isSafeInteger(id)) return;

    const actionBtn = e.target.closest('[data-action]');
    const action = actionBtn && item.contains(actionBtn)
      ? actionBtn.dataset.action
      : null;

    // 根据操作类型进行分流
    if (action === 'delete') {
      removeTodo(id);
      return;
    }

    if (action === 'edit') {
      startEdit(id);
      return;
    }

    if (action === 'save') {
      saveEdit(id);
      return;
    }

    if (action === 'cancel') {
      cancelEdit();
      return;
    }

    // 正在编辑时，点击输入框不切换任务状态
    if (editingId === id) return;

    // 点击任务文字或任务行时切换完成状态
    toggleTodo(id);
  });

  // 编辑输入框的键盘操作
  list.addEventListener('keydown', (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    if (!e.target.classList.contains('todo-edit-input')) return;

    const item = e.target.closest('li');
    if (!item || !list.contains(item)) return;

    const id = Number(item.dataset.id);
    if (!Number.isSafeInteger(id)) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(id);
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });

  // 筛选按钮事件
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  render();
}

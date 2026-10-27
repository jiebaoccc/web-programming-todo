import { addTodo, nextTodoId, parseTodoId, parseTodos, removeTodo, toggleTodo } from './todo.js';
const input = document.querySelector('#todo-input');
const button = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');
const feedback = document.querySelector('#todo-feedback');
const KEY = 'todos';
function startTodoApp(todoInput, addButton, todoList, status) {
    let todos;
    try {
        todos = parseTodos(localStorage.getItem(KEY));
    }
    catch {
        todos = [];
        status.textContent = '本地存储不可用，当前数据仅在本页有效。';
    }
    function save() {
        try {
            localStorage.setItem(KEY, JSON.stringify(todos));
        }
        catch {
            status.textContent = '保存失败：本地存储不可用。';
        }
    }
    function render() {
        todoList.replaceChildren();
        todos.forEach(t => {
            const li = document.createElement('li');
            li.textContent = t.text;
            li.dataset.id = String(t.id);
            if (t.completed)
                li.classList.add('done');
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.textContent = '×';
            delBtn.setAttribute('aria-label', '删除待办：' + t.text);
            li.appendChild(delBtn);
            todoList.appendChild(li);
        });
    }
    addButton.addEventListener('click', () => {
        const result = addTodo(todos, todoInput.value, nextTodoId(todos, Date.now()));
        if (!result.added) {
            status.textContent = '请输入非空且未超长的待办事项。';
            return;
        }
        todos = result.todos;
        status.textContent = '';
        save();
        render();
        todoInput.value = '';
        todoInput.focus();
    });
    // 事件委托：统一从 dataset.id 读取字符串并校验后转为 number。
    todoList.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof Element))
            return;
        const li = target.closest('li');
        if (!li || !todoList.contains(li))
            return;
        const id = parseTodoId(li.dataset.id);
        if (id === null)
            return;
        if (target.closest('button')) {
            todos = removeTodo(todos, id);
        }
        else {
            todos = toggleTodo(todos, id);
        }
        save();
        render();
    });
    render();
}
if (!input || !button || !list || !feedback) {
    console.error('Todo 初始化失败：缺少必要的 DOM 元素。');
}
else {
    startTodoApp(input, button, list, feedback);
}

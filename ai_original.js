// AI 初始版本（用于审查，勿与 app.js 同时引入）
const input = document.querySelector('#todo-input');
const button = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');
button.addEventListener('click', () => {
  const text = input.value;
  const li = document.createElement('li');
  li.innerHTML = text;
  list.appendChild(li);
  input.value = '';
});

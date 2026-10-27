export function isTodo(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const item = value;
    return typeof item.id === 'number'
        && Number.isSafeInteger(item.id)
        && item.id >= 0
        && typeof item.text === 'string'
        && item.text.trim().length > 0
        && typeof item.completed === 'boolean';
}
export function parseTodos(raw) {
    if (raw === null)
        return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        const seen = new Set();
        return parsed.filter((item) => {
            if (!isTodo(item) || seen.has(item.id))
                return false;
            seen.add(item.id);
            return true;
        });
    }
    catch {
        return [];
    }
}
export function parseTodoId(raw) {
    if (raw === undefined || !/^(0|[1-9]\d*)$/.test(raw))
        return null;
    const id = Number(raw);
    return Number.isSafeInteger(id) ? id : null;
}
export function addTodo(todos, text, id) {
    const value = text.trim();
    if (!value || value.length > 120 || !Number.isSafeInteger(id) || id < 0 || todos.some(t => t.id === id)) {
        return { todos: [...todos], added: false };
    }
    return { todos: [...todos, { id, text: value, completed: false }], added: true };
}
export function toggleTodo(todos, id) {
    return todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
}
export function removeTodo(todos, id) {
    return todos.filter(t => t.id !== id);
}
export function nextTodoId(todos, now) {
    // Date.now() 毫秒级可能重复；优先保持原有时间戳 ID 风格。
    const used = new Set(todos.map(t => t.id));
    let id = Number.isSafeInteger(now) && now >= 0 ? now : 0;
    while (used.has(id)) {
        if (id === Number.MAX_SAFE_INTEGER)
            throw new Error('无法生成安全的待办 ID');
        id += 1;
    }
    return id;
}

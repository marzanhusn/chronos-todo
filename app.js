const ERAS = {
  today:    { name: 'Today',     icon: '⚡', color: '#667eea' },
  tomorrow: { name: 'Tomorrow',  icon: '🌅', color: '#ed8936' },
  week:     { name: 'This Week', icon: '📆', color: '#48bb78' },
  someday:  { name: 'Someday',   icon: '🌌', color: '#9f7aea' }
};

let tasks = JSON.parse(localStorage.getItem('chronos')) || [];
let streak = Number(localStorage.getItem('streak')) || 0;
let lastActive = localStorage.getItem('lastActive') || '';
let activeEra = null;
let searchQuery = '';

const body = document.body;
const themeBtn = document.getElementById('themeBtn');
const input = document.getElementById('taskInput');
const titleInput = document.getElementById('titleInput');
const searchInput = document.getElementById('searchInput');
const eraSelect = document.getElementById('eraSelect');
const addBtn = document.getElementById('addBtn');
const timeline = document.getElementById('timeline');
const taskList = document.getElementById('taskList');
const modalBg = document.getElementById('modalBg');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const modalList = document.getElementById('modalList');
const closeBtn = document.getElementById('closeBtn');

function save() {
  localStorage.setItem('chronos', JSON.stringify(tasks));
  localStorage.setItem('streak', streak);
  localStorage.setItem('lastActive', lastActive);
}

function applyTheme(theme) {
  body.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

function updateStreak() {
  const today = new Date().toDateString();
  if (lastActive === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  streak = lastActive === yesterday.toDateString() ? streak + 1 : 1;
  lastActive = today;
  save();
}

function celebrate() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#a78bfa', '#ec4899', '#f59e0b']
    });
  }
}

function getCountdown(eraKey) {
  const now = new Date();
  const target = new Date();

  if (eraKey === 'today') target.setHours(23, 59, 59, 999);
  else if (eraKey === 'tomorrow') {
    target.setDate(target.getDate() + 1);
    target.setHours(23, 59, 59, 999);
  } else if (eraKey === 'week') {
    target.setDate(target.getDate() + (7 - target.getDay()));
    target.setHours(23, 59, 59, 999);
  } else return null;

  const diff = target - now;
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days}d left`;
  if (hours >= 1) return `${hours}h left`;
  return 'soon';
}

function addTask() {
  const text = input.value.trim();
  const title = titleInput.value.trim();
  if (!text) return alert('Please type a task!');

  tasks.push({ id: Date.now(), text, title, era: eraSelect.value, done: false });
  input.value = '';
  titleInput.value = '';
  updateStreak();
  save();
  render();
}

function toggle(id) {
  const task = tasks.find(t => t.id === id);
  task.done = !task.done;
  save();
  render();
  if (activeEra) openModal(activeEra);

  const allDone = tasks.length > 0 && tasks.every(t => t.done);
  if (allDone && task.done) celebrate();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
  if (activeEra) openModal(activeEra);
}

function getVisibleTasks() {
  if (!searchQuery) return tasks;
  const q = searchQuery.toLowerCase();
  return tasks.filter(t =>
    t.text.toLowerCase().includes(q) ||
    (t.title && t.title.toLowerCase().includes(q))
  );
}

function render() {
  timeline.innerHTML = Object.keys(ERAS).map(key => {
    const era = ERAS[key];
    const list = tasks.filter(t => t.era === key);
    const allDone = list.length > 0 && list.every(t => t.done);

    return `
      <div class="era-card ${allDone ? 'complete' : ''}" style="--color:${era.color}" data-era="${key}">
        <span class="era-icon">${era.icon}</span>
        <div class="era-name">${era.name.toUpperCase()}</div>
        <div class="era-count">${list.length} task${list.length !== 1 ? 's' : ''}</div>
      </div>
    `;
  }).join('');

  const visible = getVisibleTasks();

  taskList.innerHTML = visible.length
    ? visible.slice().reverse().map(t => {
        const era = ERAS[t.era];
        const countdown = getCountdown(t.era);

        return `
          <li class="task ${t.done ? 'done' : ''}">
            <input type="checkbox" class="check" ${t.done ? 'checked' : ''} data-toggle="${t.id}">
            <div class="task-body">
              ${t.title ? `<span class="task-title">${t.title}</span>` : ''}
              <span class="text">${t.text}</span>
            </div>
            ${countdown ? `<span class="countdown ${countdown.includes('d') ? '' : 'safe'}">⏱ ${countdown}</span>` : ''}
            <span class="era-tag" style="color:${era.color};background:${era.color}20">${era.icon} ${era.name}</span>
            <button class="del" data-delete="${t.id}">✕</button>
          </li>
        `;
      }).join('')
    : `<li class="empty">${searchQuery ? 'No tasks match your search.' : 'No tasks yet. Add one above!'}</li>`;

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('statStreak').textContent = streak;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statDone').textContent = done;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statPct').textContent = pct + '%';
}

function openModal(eraKey) {
  activeEra = eraKey;
  const era = ERAS[eraKey];
  const list = tasks.filter(t => t.era === eraKey);

  modal.style.setProperty('--color', era.color);
  modalTitle.textContent = `${era.icon} ${era.name}`;
  modalSub.textContent = `${list.length} task${list.length !== 1 ? 's' : ''} in this timeline`;

  modalList.innerHTML = list.length
    ? list.slice().reverse().map(t => `
        <li class="task ${t.done ? 'done' : ''}">
          <input type="checkbox" class="check" ${t.done ? 'checked' : ''} data-toggle="${t.id}">
          <div class="task-body">
            ${t.title ? `<span class="task-title">${t.title}</span>` : ''}
            <span class="text">${t.text}</span>
          </div>
          <button class="del" data-delete="${t.id}">✕</button>
        </li>
      `).join('')
    : '<li class="empty">No tasks in this timeline.</li>';

  modalBg.classList.add('show');
}

function closeModal() {
  modalBg.classList.remove('show');
  activeEra = null;
}

themeBtn.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

timeline.addEventListener('click', e => {
  const card = e.target.closest('.era-card');
  if (card) openModal(card.dataset.era);
});

taskList.addEventListener('click', e => {
  const toggleId = e.target.dataset.toggle;
  const deleteId = e.target.dataset.delete;
  if (toggleId) toggle(Number(toggleId));
  if (deleteId) deleteTask(Number(deleteId));
});

modalList.addEventListener('click', e => {
  const toggleId = e.target.dataset.toggle;
  const deleteId = e.target.dataset.delete;
  if (toggleId) toggle(Number(toggleId));
  if (deleteId) deleteTask(Number(deleteId));
});

modalBg.addEventListener('click', e => {
  if (e.target === modalBg) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  render();
});

addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

titleInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

closeBtn.addEventListener('click', closeModal);

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

if (!lastActive) updateStreak();

render();

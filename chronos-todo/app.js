const ERAS = {
  today:    { name: 'Today',     icon: '⚡', color: '#667eea' },
  tomorrow: { name: 'Tomorrow',  icon: '🌅', color: '#ed8936' },
  week:     { name: 'This Week', icon: '📆', color: '#48bb78' },
  someday:  { name: 'Someday',   icon: '🌌', color: '#9f7aea' }
};

let tasks = JSON.parse(localStorage.getItem('chronos')) || [];
let activeEra = null;

const input = document.getElementById('taskInput');
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
}

function addTask() {
  const text = input.value.trim();
  if (!text) return alert('Please type a task!');

  tasks.push({ id: Date.now(), text, era: eraSelect.value, done: false });
  input.value = '';
  save();
  render();
}

function toggle(id) {
  const task = tasks.find(t => t.id === id);
  task.done = !task.done;
  save();
  render();
  if (activeEra) openModal(activeEra);
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
  if (activeEra) openModal(activeEra);
}

function render() {
  timeline.innerHTML = Object.keys(ERAS).map(key => {
    const era = ERAS[key];
    const count = tasks.filter(t => t.era === key).length;

    return `
      <div class="era-card" style="--color:${era.color}" data-era="${key}">
        <span class="era-icon">${era.icon}</span>
        <div class="era-name">${era.name.toUpperCase()}</div>
        <div class="era-count">${count} task${count !== 1 ? 's' : ''}</div>
      </div>
    `;
  }).join('');

  taskList.innerHTML = tasks.length
    ? tasks.slice().reverse().map(t => {
        const era = ERAS[t.era];

        return `
          <li class="task ${t.done ? 'done' : ''}">
            <input type="checkbox" class="check" ${t.done ? 'checked' : ''} data-toggle="${t.id}">
            <span class="text">${t.text}</span>
            <span class="era-tag" style="color:${era.color};background:${era.color}20">${era.icon} ${era.name}</span>
            <button class="del" data-delete="${t.id}">✕</button>
          </li>
        `;
      }).join('')
    : '<li class="empty">No tasks yet. Add one above!</li>';

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

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
          <span class="text">${t.text}</span>
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

addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

closeBtn.addEventListener('click', closeModal);

render();
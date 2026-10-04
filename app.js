const ERAS = {
  today:    { name:'Today',     icon:'⚡', color:'#667eea' },
  tomorrow: { name:'Tomorrow',  icon:'🌅', color:'#ed8936' },
  week:     { name:'This Week', icon:'📆', color:'#48bb78' },
  someday:  { name:'Someday',   icon:'🌌', color:'#9f7aea' }
};

const $ = id => document.getElementById(id);
let tasks = JSON.parse(localStorage.getItem('chronos')) || [];
let streak = Number(localStorage.getItem('streak')) || 0;
let lastActive = localStorage.getItem('lastActive') || '';
let activeEra = null, searchQuery = '';
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
let reminderInterval = null, alarmInterval = null;

const body = document.body, themeBtn = $('themeBtn'), soundBtn = $('soundBtn');
const input = $('taskInput'), titleInput = $('titleInput'), timeInput = $('timeInput');
const searchInput = $('searchInput'), eraSelect = $('eraSelect'), addBtn = $('addBtn');
const timeline = $('timeline'), taskList = $('taskList'), modalBg = $('modalBg');
const modal = $('modal'), modalTitle = $('modalTitle'), modalSub = $('modalSub');
const modalList = $('modalList'), closeBtn = $('closeBtn'), toast = $('toast');

const save = () => {
  localStorage.setItem('chronos', JSON.stringify(tasks));
  localStorage.setItem('streak', streak);
  localStorage.setItem('lastActive', lastActive);
};

const applyTheme = t => {
  body.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', t);
};

const applySound = () => {
  soundBtn.textContent = soundEnabled ? '🔔' : '🔕';
  soundBtn.classList.toggle('muted', !soundEnabled);
};

const updateStreak = () => {
  const today = new Date().toDateString();
  if (lastActive === today) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  streak = lastActive === y.toDateString() ? streak + 1 : 1;
  lastActive = today;
  save();
};

const tone = (freq, dur, type = 'sine', vol = 0.15, delay = 0) => {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = type; osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t); osc.stop(t + dur);
  } catch {}
};

const playDing   = () => tone(880, 0.2);
const playAlarm  = () => [0, 0.18, 0.36, 0.54].forEach(d => tone(1100, 0.15, 'triangle', 0.18, d));
const playTikTok = () => [1200, 900, 1200].forEach((f, i) => tone(f, 0.08, 'square', 0.08, i * 0.25));

const celebrate = () => {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 },
      colors: ['#8b5cf6','#a78bfa','#ec4899','#f59e0b'] });
  }
};

const showToast = (msg, type) => {
  toast.textContent = msg;
  toast.classList.remove('warn', 'info');
  if (type) toast.classList.add(type);
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
};

const getCountdown = k => {
  const now = new Date(), t = new Date();
  if (k === 'today') t.setHours(23,59,59,999);
  else if (k === 'tomorrow') { t.setDate(t.getDate()+1); t.setHours(23,59,59,999); }
  else if (k === 'week') { t.setDate(t.getDate()+(7-t.getDay())); t.setHours(23,59,59,999); }
  else return null;
  const h = Math.floor((t - now) / 3600000);
  const d = Math.floor(h / 24);
  return d >= 1 ? `${d}d left` : h >= 1 ? `${h}h left` : 'soon';
};

const pendingCount = () => tasks.filter(t => !t.done).length;

const checkAlarms = () => {
  const now = new Date();
  const cur = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  tasks.forEach(t => {
    if (!t.done && t.time && !t.alarmFired && t.time === cur) {
      t.alarmFired = true;
      save(); playAlarm();
      showToast(`⏰ ${t.title || t.text}`, 'warn');
      render();
    }
  });
};

const startAlarmLoop = () => { if (!alarmInterval) alarmInterval = setInterval(checkAlarms, 10000); };

const startReminderLoop = () => {
  clearInterval(reminderInterval);
  reminderInterval = setInterval(() => {
    const p = pendingCount();
    if (p > 0) { playTikTok(); showToast(`⏰ ${p} task${p!==1?'s':''} still pending`, 'warn'); }
    else { clearInterval(reminderInterval); reminderInterval = null; }
  }, 60000);
};

const runOpenReminder = () => {
  const p = pendingCount();
  if (p > 0) {
    setTimeout(() => { playTikTok(); showToast(`⏰ You have ${p} pending task${p!==1?'s':''}`, 'warn'); }, 800);
    startReminderLoop();
  }
};

const addTask = () => {
  const text = input.value.trim();
  if (!text) return alert('Please type a task!');
  tasks.push({
    id: Date.now(), text,
    title: titleInput.value.trim(),
    time: timeInput.value,
    era: eraSelect.value,
    done: false, alarmFired: false
  });
  input.value = titleInput.value = timeInput.value = '';
  updateStreak(); save(); render();
  showToast('✓ Task added', 'info');
  if (!reminderInterval && pendingCount() > 0) startReminderLoop();
  startAlarmLoop();
};

const toggle = id => {
  const task = tasks.find(t => t.id === id);
  task.done = !task.done;
  if (task.done) task.alarmFired = true;
  save(); render();
  if (activeEra) openModal(activeEra);
  if (!task.done) return;
  const doneCount = tasks.filter(t => t.done).length;
  const allDone = tasks.length > 0 && doneCount === tasks.length;
  playDing();
  if (allDone) {
    celebrate();
    showToast('🎉 All tasks complete. Legendary.');
    clearInterval(reminderInterval); reminderInterval = null;
  } else {
    const eraTasks = tasks.filter(t => t.era === task.era);
    if (eraTasks.every(t => t.done)) {
      celebrate();
      showToast(`🏆 ${ERAS[task.era].name} cleared`);
    } else {
      showToast(`✓ ${doneCount} of ${tasks.length} done`);
    }
  }
};

const deleteTask = id => {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
  if (activeEra) openModal(activeEra);
};

const getVisible = () => {
  if (!searchQuery) return tasks;
  const q = searchQuery.toLowerCase();
  return tasks.filter(t => t.text.toLowerCase().includes(q) || (t.title && t.title.toLowerCase().includes(q)));
};

const render = () => {
  timeline.innerHTML = Object.keys(ERAS).map(k => {
    const era = ERAS[k], list = tasks.filter(t => t.era === k);
    const done = list.length > 0 && list.every(t => t.done);
    return `<div class="era-card ${done?'complete':''}" style="--color:${era.color}" data-era="${k}">
      <span class="era-icon">${era.icon}</span>
      <div class="era-name">${era.name.toUpperCase()}</div>
      <div class="era-count">${list.length} task${list.length!==1?'s':''}</div>
    </div>`;
  }).join('');

  const visible = getVisible();
  taskList.innerHTML = visible.length
    ? visible.slice().reverse().map(t => {
        const era = ERAS[t.era];
        const cd = getCountdown(t.era);
        return `<li class="task ${t.done?'done':''} ${t.alarmFired&&!t.done?'ringing':''}">
          <input type="checkbox" class="check" ${t.done?'checked':''} data-toggle="${t.id}">
          <div class="task-body">
            ${t.title ? `<span class="task-title">${t.title}</span>` : ''}
            <span class="text">${t.text}</span>
          </div>
          ${t.time ? `<span class="task-time">🕐 ${t.time}</span>` : ''}
          ${cd ? `<span class="countdown ${cd.includes('d')?'':'safe'}">⏱ ${cd}</span>` : ''}
          <span class="era-tag" style="color:${era.color};background:${era.color}20">${era.icon} ${era.name}</span>
          <button class="del" data-delete="${t.id}">✕</button>
        </li>`;
      }).join('')
    : `<li class="empty">${searchQuery ? 'No tasks match your search.' : 'No tasks yet. Add one above!'}</li>`;

  const total = tasks.length, done = tasks.filter(t => t.done).length;
  $('statStreak').textContent = streak;
  $('statTotal').textContent = total;
  $('statDone').textContent = done;
  $('statPending').textContent = total - done;
  $('statPct').textContent = total ? Math.round(done/total*100) + '%' : '0%';
};

const openModal = k => {
  activeEra = k;
  const era = ERAS[k], list = tasks.filter(t => t.era === k);
  modal.style.setProperty('--color', era.color);
  modalTitle.textContent = `${era.icon} ${era.name}`;
  modalSub.textContent = `${list.length} task${list.length!==1?'s':''} in this timeline`;
  modalList.innerHTML = list.length
    ? list.slice().reverse().map(t => `
      <li class="task ${t.done?'done':''}">
        <input type="checkbox" class="check" ${t.done?'checked':''} data-toggle="${t.id}">
        <div class="task-body">
          ${t.title ? `<span class="task-title">${t.title}</span>` : ''}
          <span class="text">${t.text}</span>
        </div>
        ${t.time ? `<span class="task-time">🕐 ${t.time}</span>` : ''}
        <button class="del" data-delete="${t.id}">✕</button>
      </li>`).join('')
    : '<li class="empty">No tasks in this timeline.</li>';
  modalBg.classList.add('show');
};

const closeModal = () => { modalBg.classList.remove('show'); activeEra = null; };

const handleClick = e => {
  const tid = e.target.dataset.toggle, did = e.target.dataset.delete;
  if (tid) toggle(Number(tid));
  if (did) deleteTask(Number(did));
};

themeBtn.addEventListener('click', () => applyTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
soundBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  applySound();
  showToast(soundEnabled ? '🔔 Sound on' : '🔕 Sound off', 'info');
});

timeline.addEventListener('click', e => {
  const c = e.target.closest('.era-card');
  if (c) openModal(c.dataset.era);
});
taskList.addEventListener('click', handleClick);
modalList.addEventListener('click', handleClick);
modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
searchInput.addEventListener('input', e => { searchQuery = e.target.value.trim(); render(); });
addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
titleInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
closeBtn.addEventListener('click', closeModal);

applyTheme(localStorage.getItem('theme') || 'light');
applySound();
if (!lastActive) updateStreak();
render();
runOpenReminder();
startAlarmLoop();

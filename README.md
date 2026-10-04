# Chronos

> **A time-travel themed to-do app that turns your daily tasks into a journey across today, tomorrow, this week, and someday.**

![Chronos](https://img.shields.io/badge/version-1.0-8b5cf6?style=flat-square)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 🌌 What is Chronos?

Chronos is not just another to-do list. Instead of dumping every task into one flat list, it **organizes your life by time horizon**:

| Era | Meaning |
|-----|---------|
| ⚡ **Today** | Fire — do it now |
| 🌅 **Tomorrow** | Prepare ahead |
| 📆 **This Week** | Plan your week |
| 🌌 **Someday** | Ideas for later |

Click any era card and see only what matters in that timeline.

---

## ✨ Features

### Core
- ➕ **Add tasks** with text, optional title, time, and era
- ✅ **Mark complete** with a click
- 🗑️ **Delete tasks** instantly
- 🔍 **Search** across titles and text in real time
- 💾 **Auto-save** with localStorage — no account needed

### Time & Reminders
- 🕐 **Time picker** for each task
- ⏰ **Alarm** beeps when the task time arrives
- 🟡 **Ringing pulse** — task glows amber until done
- 🔔 **Tik-tok reminder** every 60 seconds if tasks are pending

### Motivation
- 🎉 **Confetti burst** when an era is cleared
- 🏆 **Full celebration** when all tasks are complete
- 🔥 **Day streak** counter — stay consistent
- 📊 **Live stats** — Total, Done, Pending, Progress %

### Design
- 🌗 **Light & dark theme** toggle
- 💜 **Modern lavender** light theme
- 🌊 **Neon cyan** dark theme
- 📱 **Fully responsive** — desktop, tablet, and mobile
- 🎨 **Color-coded eras** with emojis
- 🔔 **Sound toggle** for silent mode

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/chronos.git

# 2. Open in your browser
cd chronos
open index.html
# README.md

```markdown
# ⏳ Chronos

> **A time-travel themed to-do app that turns your daily tasks into a journey across today, tomorrow, this week, and someday.**

![Chronos](https://img.shields.io/badge/version-1.0-8b5cf6?style=flat-square)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 🌌 What is Chronos?

Chronos is not just another to-do list. Instead of dumping every task into one flat list, it **organizes your life by time horizon**:

| Era | Meaning |
|-----|---------|
| ⚡ **Today** | Fire — do it now |
| 🌅 **Tomorrow** | Prepare ahead |
| 📆 **This Week** | Plan your week |
| 🌌 **Someday** | Ideas for later |

Click any era card and see only what matters in that timeline.

---

## ✨ Features

### Core
- ➕ **Add tasks** with text, optional title, time, and era
- ✅ **Mark complete** with a click
- 🗑️ **Delete tasks** instantly
- 🔍 **Search** across titles and text in real time
- 💾 **Auto-save** with localStorage — no account needed

### Time & Reminders
- 🕐 **Time picker** for each task
- ⏰ **Alarm** beeps when the task time arrives
- 🟡 **Ringing pulse** — task glows amber until done
- 🔔 **Tik-tok reminder** every 60 seconds if tasks are pending

### Motivation
- 🎉 **Confetti burst** when an era is cleared
- 🏆 **Full celebration** when all tasks are complete
- 🔥 **Day streak** counter — stay consistent
- 📊 **Live stats** — Total, Done, Pending, Progress %

### Design
- 🌗 **Light & dark theme** toggle
- 💜 **Modern lavender** light theme
- 🌊 **Neon cyan** dark theme
- 📱 **Fully responsive** — desktop, tablet, and mobile
- 🎨 **Color-coded eras** with emojis
- 🔔 **Sound toggle** for silent mode

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/chronos.git

# 2. Open in your browser
cd chronos
open index.html
```

**That's it.** No installation, no build step, no dependencies.

---

## 📁 Project Structure

```
chronos/
├── index.html     → Structure
├── style.css      → Styling & themes
├── app.js         → Logic & interactions
└── README.md      → This file
```

---

## 🎮 How to Use

1. **Type** your task in the input field
2. **Add** an optional short title
3. **Pick a time** (optional alarm)
4. **Select an era** — Today / Tomorrow / This Week / Someday
5. **Click Add Task**
6. **Click any era card** to open a focused timeline modal
7. **Check tasks off** — the app plays a ding and can trigger confetti

---

## 🎯 What Makes Chronos Different

| Traditional To-Do | Chronos |
|-------------------|---------|
| One long flat list | Tasks split by time horizon |
| No urgency | Countdown timers on each task |
| No celebration | Confetti + sounds on completion |
| No motivation | Daily streak counter |
| Basic look | Dual-theme neon design |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Style | CSS3 (custom variables for theming) |
| Logic | Vanilla JavaScript (ES6) |
| Storage | localStorage |
| Confetti | canvas-confetti CDN |
| Sounds | Web Audio API (no audio files needed) |

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| **Desktop** (>768px) | 4-column era grid |
| **Tablet** (520–768px) | 2-column era grid |
| **Phone** (≤520px) | Stacked inputs, 2×2 stats, wrapped tasks |

---

## 🌈 Themes

### Light Theme
- Soft lavender gradient background
- White cards with indigo borders
- Purple gradient buttons

### Dark Theme
- Deep navy background
- Dark slate cards
- Neon cyan accents with glow effects

Click the **🌙 / ☀️ button** in the header to switch.

---

## 🔔 Sound System

| Sound | When It Plays |
|-------|---------------|
| **Ding** | When a task is checked |
| **Alarm** | When a task's time arrives |
| **Tik-tok** | On open + every 60s if tasks pending |

All sounds are generated using the **Web Audio API** — no audio files, no downloads.

Click the **🔔 / 🔕 button** to mute/unmute.

---

## 🎉 Celebration Logic

| Trigger | Response |
|---------|----------|
| Task checked | Soft ding |
| Era fully cleared | Confetti + toast |
| All tasks done | Bigger confetti + "Legendary" toast |
| Day streak milestone | Counter updates in stats bar |

---

## 📊 Stats Bar

Every session shows:

| Stat | Meaning |
|------|---------|
| **DAY STREAK** | Consecutive days you've added tasks |
| **TOTAL** | All tasks |
| **DONE** | Completed tasks |
| **PENDING** | Tasks not done yet |
| **PROGRESS** | Percentage done |

---

## 🌐 Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Edge | ✅ |

---

## 📄 License

MIT License — free to use, modify, and share.

---

## 👤 Author

**Marzan Husain**
- GitHub: [@marzanhusain](https://github.com/marzanhusain)

---

<div align="center">

⭐ **If Chronos helped you organize your time, give it a star!**

*Built with care, curiosity, and a love for clean design.*

</div>
```

---

## 🎯 What Makes This README Stand Out

| Element | Why It Works |
|---------|--------------|
| **Tagline with blockquote** | Grabs attention immediately |
| **Badges** | Looks professional on GitHub |
| **Tables instead of bullets** | Easier to scan |
| **Visual era breakdown** | Shows the concept at a glance |
| **Feature categories** | Core / Time / Motivation / Design |
| **"What Makes Chronos Different" table** | Sells the value instantly |
| **Quick start with code block** | Developer-friendly |
| **Sound + celebration sections** | Highlights unique features |
| **Centered footer** | Clean, modern finish |

---


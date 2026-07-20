import './styles.css';

const STORAGE_KEY = 'thumbkids:lastPracticeResult';
const questions = [
  { prompt: '2 + 3 = ?', answer: '5' },
  { prompt: '7 - 4 = ?', answer: '3' },
  { prompt: '4 + 4 = ?', answer: '8' },
  { prompt: '9 - 6 = ?', answer: '3' },
  { prompt: '5 + 6 = ?', answer: '11' },
];

const state = {
  screen: 'landing',
  currentQuestion: 0,
  answers: [],
  latestResult: readResult(),
};

function readResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveResult(result) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  state.latestResult = result;
}

function setScreen(screen) {
  state.screen = screen;
  render();
}

function startPractice() {
  state.currentQuestion = 0;
  state.answers = [];
  setScreen('practice');
}

function submitAnswer(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const answer = String(form.get('answer') || '').trim();
  state.answers.push(answer);

  if (state.currentQuestion < questions.length - 1) {
    state.currentQuestion += 1;
    render();
    return;
  }

  const correct = questions.reduce(
    (total, question, index) => total + (state.answers[index] === question.answer ? 1 : 0),
    0,
  );
  const coins = 25 + correct * 10;
  const badge = correct >= 4 ? 'Bintang Jempol Emas' : 'Pejuang Latihan';
  saveResult({
    correct,
    total: questions.length,
    coins,
    badge,
    completedAt: new Date().toISOString(),
  });
  setScreen('reward');
}

function icon(name) {
  const paths = {
    spark: '<path d="M12 2l1.8 5.5L19 9.4l-5.2 1.9L12 17l-1.8-5.7L5 9.4l5.2-1.9L12 2Z"/><path d="M19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15Z"/>',
    book: '<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z"/><path d="M5 4.5A2.5 2.5 0 0 0 2.5 7v12A2.5 2.5 0 0 0 5 21.5"/><path d="M8 6h8"/>',
    coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10.2c.6-.8 1.5-1.2 2.7-1.2 1.4 0 2.3.7 2.3 1.7 0 2.5-5 1.2-5 3.7 0 1 .9 1.7 2.5 1.7 1.2 0 2.2-.4 2.8-1.2"/>',
    chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-7"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  };
  return `<svg aria-hidden="true" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function appShell(content, options = {}) {
  const badge = options.badge || 'Telegram Mode';
  return `
    <div class="app-shell">
      <header class="topbar" aria-label="App header">
        <div class="brand-lockup">
          <img class="avatar" src="/assets/logo-thumbkids.jpg" alt="Logo Thumb Kids" />
          <div>
            <p class="caption">Halo, Juara 👋</p>
            <strong>Thumb Kids</strong>
          </div>
        </div>
        <div class="header-actions">
          <span class="badge badge-soft">${badge}</span>
          <button class="icon-button" type="button" aria-label="Lihat dashboard orang tua" data-nav="parent">${icon('chart')}</button>
        </div>
      </header>
      ${content}
    </div>
  `;
}

function heroIllustration() {
  return `<div class="hero-art" aria-hidden="true"><div class="orb orb-one"></div><div class="orb orb-two"></div><div class="math-card"><span>2 + 3</span><strong>5</strong></div><div class="mini-card">${icon('spark')} +10 coin</div></div>`;
}

function button(label, id, variant = 'primary', type = 'button', extra = '') {
  return `<button id="${id}" class="btn btn-${variant}" type="${type}" ${extra}>${label}${variant === 'primary' ? icon('arrow') : ''}</button>`;
}

function renderLanding() {
  return appShell(`
    <main class="page-grid landing">
      <section class="hero-card surface elevated">
        <span class="badge badge-accent">Healthy learning habits</span>
        <h1>Belajar berhitung terasa ringan, rapi, dan menyenangkan.</h1>
        <p class="lead">Latihan singkat, reward seru, dan laporan yang mudah dibaca orang tua dalam pengalaman mobile-first yang halus.</p>
        <div class="hero-actions">${button('Mulai Belajar', 'start-learning')}</div>
      </section>
      ${heroIllustration()}
    </main>
  `);
}

function renderStudentDashboard() {
  const result = state.latestResult;
  return appShell(`
    <main class="stack">
      <section class="surface dashboard-card">
        <div><span class="badge badge-accent">Student Dashboard</span><h1>Siap menyelesaikan 5 soal hari ini?</h1><p class="lead">Setiap jawaban benar menambah coin dan membuka badge progres.</p></div>
        ${button('Mulai Latihan Hari Ini', 'start-practice')}
      </section>
      <section class="stats-grid" aria-label="Ringkasan progres">
        <article class="stat-card"><span>${icon('book')}</span><p>Soal</p><strong>${questions.length}</strong></article>
        <article class="stat-card"><span>${icon('coin')}</span><p>Coin terakhir</p><strong>${result ? result.coins : 0}</strong></article>
        <article class="stat-card"><span>${icon('spark')}</span><p>Badge</p><strong>${result ? result.badge : 'Belum ada'}</strong></article>
      </section>
    </main>
  `);
}

function renderPractice() {
  const question = questions[state.currentQuestion];
  const progress = ((state.currentQuestion + 1) / questions.length) * 100;
  return appShell(`
    <main class="surface practice-card">
      <div class="progress-label"><span>Soal ${state.currentQuestion + 1} dari ${questions.length}</span><span>${Math.round(progress)}%</span></div>
      <div class="progress"><span style="width:${progress}%"></span></div>
      <section class="question-panel"><p class="caption">Jawab dengan tenang</p><h1>${question.prompt}</h1></section>
      <form id="answer-form" class="answer-form">
        <label for="answer">Jawabanmu</label>
        <input id="answer" name="answer" inputmode="numeric" autocomplete="off" required autofocus placeholder="0" aria-describedby="answer-help" />
        <small id="answer-help">Gunakan angka, lalu ketuk Jawab.</small>
        ${button('Jawab', 'submit-answer', 'primary', 'submit')}
      </form>
    </main>
  `, { badge: 'Practice' });
}

function renderReward() {
  const result = state.latestResult;
  return appShell(`
    <main class="surface reward-card">
      <span class="badge badge-accent">Reward Screen</span>
      <h1>Latihan selesai dengan cantik.</h1>
      <p class="lead">Kamu menjawab ${result.correct} dari ${result.total} soal dengan benar.</p>
      <div class="reward-grid">
        <article><span>${icon('coin')}</span><strong>${result.coins} coin</strong><small>Coin terkumpul</small></article>
        <article><span>${icon('spark')}</span><strong>${result.badge}</strong><small>Badge baru</small></article>
      </div>
      ${button('Dashboard Orang Tua', 'parent-dashboard', 'secondary')}
    </main>
  `);
}

function renderParentDashboard() {
  const result = readResult();
  return appShell(`
    <main class="surface parent-card">
      <span class="badge badge-soft">Parent Dashboard</span>
      <h1>Ringkasan latihan anak</h1>
      ${result ? `
        <dl class="result-list">
          <div><dt>Skor</dt><dd>${result.correct}/${result.total}</dd></div>
          <div><dt>Coin</dt><dd>${result.coins}</dd></div>
          <div><dt>Badge</dt><dd>${result.badge}</dd></div>
          <div><dt>Sumber Data</dt><dd>localStorage</dd></div>
        </dl>
      ` : '<div class="empty-state"><span>'+icon('book')+'</span><strong>Belum ada hasil latihan.</strong><p>Mulai latihan pertama untuk menampilkan progres anak di sini.</p></div>'}
      ${button('Kembali ke Landing Page', 'back-home', 'outline')}
    </main>
  `);
}

function render() {
  const app = document.querySelector('#app');
  const templates = { landing: renderLanding, student: renderStudentDashboard, practice: renderPractice, reward: renderReward, parent: renderParentDashboard };
  app.innerHTML = templates[state.screen]();

  document.querySelector('#start-learning')?.addEventListener('click', () => setScreen('student'));
  document.querySelector('#start-practice')?.addEventListener('click', startPractice);
  document.querySelector('#answer-form')?.addEventListener('submit', submitAnswer);
  document.querySelector('#parent-dashboard')?.addEventListener('click', () => setScreen('parent'));
  document.querySelector('#back-home')?.addEventListener('click', () => setScreen('landing'));
  document.querySelectorAll('[data-nav="parent"]').forEach((element) => element.addEventListener('click', () => setScreen('parent')));
  document.querySelector('#answer')?.focus();
}

render();

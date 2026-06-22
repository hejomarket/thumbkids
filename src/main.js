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

function renderLanding() {
  return `
    <main class="landing card">
      <img class="logo" src="/assets/logo-thumbkids.jpg" alt="Logo Thumb Kids" />
      <p class="eyebrow">Prototype belajar berhitung</p>
      <h1>Thumb Kids</h1>
      <p class="lead">Latihan singkat, reward seru, dan laporan yang mudah dibaca orang tua.</p>
      <button id="start-learning" class="primary">Mulai Belajar</button>
    </main>
  `;
}

function renderStudentDashboard() {
  return `
    <main class="dashboard card">
      <img class="small-logo" src="/assets/logo-thumbkids.jpg" alt="Logo Thumb Kids" />
      <section>
        <p class="eyebrow">Student Dashboard</p>
        <h1>Halo, Juara!</h1>
        <p class="lead">Siap menyelesaikan 5 soal hari ini dan mengumpulkan coin?</p>
        <button id="start-practice" class="primary">Mulai Latihan Hari Ini</button>
      </section>
    </main>
  `;
}

function renderPractice() {
  const question = questions[state.currentQuestion];
  return `
    <main class="card practice">
      <p class="eyebrow">Soal ${state.currentQuestion + 1} dari ${questions.length}</p>
      <h1>${question.prompt}</h1>
      <form id="answer-form">
        <label for="answer">Jawabanmu</label>
        <input id="answer" name="answer" inputmode="numeric" autocomplete="off" required autofocus />
        <button class="primary" type="submit">Jawab</button>
      </form>
    </main>
  `;
}

function renderReward() {
  const result = state.latestResult;
  return `
    <main class="card reward">
      <p class="eyebrow">Reward Screen</p>
      <h1>Hebat! Latihan selesai 🎉</h1>
      <div class="reward-grid">
        <article><span class="icon">🪙</span><strong>${result.coins} coin</strong><small>Coin terkumpul</small></article>
        <article><span class="icon">🏅</span><strong>${result.badge}</strong><small>Badge baru</small></article>
      </div>
      <p>Kamu menjawab ${result.correct} dari ${result.total} soal dengan benar.</p>
      <button id="parent-dashboard" class="secondary">Dashboard Orang Tua</button>
    </main>
  `;
}

function renderParentDashboard() {
  const result = readResult();
  return `
    <main class="card parent">
      <p class="eyebrow">Parent Dashboard</p>
      <h1>Ringkasan Latihan Anak</h1>
      ${result ? `
        <dl>
          <div><dt>Skor</dt><dd>${result.correct}/${result.total}</dd></div>
          <div><dt>Coin</dt><dd>${result.coins}</dd></div>
          <div><dt>Badge</dt><dd>${result.badge}</dd></div>
          <div><dt>Sumber Data</dt><dd>localStorage</dd></div>
        </dl>
      ` : '<p>Belum ada hasil latihan tersimpan di localStorage.</p>'}
      <button id="back-home" class="secondary">Kembali ke Landing Page</button>
    </main>
  `;
}

function render() {
  const app = document.querySelector('#app');
  const templates = {
    landing: renderLanding,
    student: renderStudentDashboard,
    practice: renderPractice,
    reward: renderReward,
    parent: renderParentDashboard,
  };
  app.innerHTML = templates[state.screen]();

  document.querySelector('#start-learning')?.addEventListener('click', () => setScreen('student'));
  document.querySelector('#start-practice')?.addEventListener('click', startPractice);
  document.querySelector('#answer-form')?.addEventListener('submit', submitAnswer);
  document.querySelector('#parent-dashboard')?.addEventListener('click', () => setScreen('parent'));
  document.querySelector('#back-home')?.addEventListener('click', () => setScreen('landing'));
  document.querySelector('#answer')?.focus();
}

render();

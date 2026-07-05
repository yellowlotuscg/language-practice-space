const STORAGE_KEY = 'language_practice_space_v2';

const languages = [
  { id: 'es', label: 'Spanish', short: 'ES', note: 'everyday replies', focus: 'Warm, practical conversation' },
  { id: 'zh', label: 'Mandarin', short: 'ZH', note: 'tones and characters', focus: 'Sound, rhythm, and meaning' },
  { id: 'ko', label: 'Korean', short: 'KO', note: 'Hangul and polite speech', focus: 'Useful phrases with safe tone' }
];

const packs = {
  es: [
    {
      title: 'Check in with someone',
      native: '¿Cómo te va hoy?',
      roman: 'KOH-moh teh vah oy',
      literal: 'How is it going for you today?',
      natural: 'How’s your day going?',
      register: 'Safe and casual. Good with friends, coworkers, or someone you know a little.',
      breakdown: 'cómo = how · te = for you · va = it goes · hoy = today',
      replyPrompt: 'Answer with one sentence about your day.',
      sampleReply: 'Me va bien, pero estoy un poco cansado. I’m doing well, but I’m a little tired.',
      coach: 'Start with Me va, then add one honest detail.'
    },
    {
      title: 'Ask for time',
      native: 'Necesito un minuto para pensarlo.',
      roman: 'neh-seh-SEE-toh oon mee-NOO-toh PAH-rah pen-SAHR-loh',
      literal: 'I need a minute in order to think it.',
      natural: 'I need a minute to think about it.',
      register: 'Polite and useful when you do not want to answer too fast.',
      breakdown: 'necesito = I need · un minuto = one minute · para = in order to · pensarlo = to think it over',
      replyPrompt: 'Write a version that asks for more time politely.',
      sampleReply: '¿Me das un minuto para pensarlo? Can you give me a minute to think about it?',
      coach: 'This is a control phrase. Use it when you need space without sounding cold.'
    }
  ],
  zh: [
    {
      title: 'Natural greeting',
      native: '你今天怎么样？',
      roman: 'nǐ jīntiān zěnme yàng',
      mouth: 'nee jin-tyen dzun-muh yahng',
      literal: 'You today how?',
      natural: 'How are you today?',
      register: 'Normal and conversational.',
      breakdown: '你 = you · 今天 = today · 怎么样 = how is it / how are things',
      replyPrompt: 'Answer with one short sentence about how you feel.',
      sampleReply: '我有点累，但是还好。wǒ yǒudiǎn lèi, dànshì hái hǎo. I’m a little tired, but okay.',
      coach: 'Say the whole phrase slowly once, then let the tones loosen into normal speech.'
    },
    {
      title: 'Ask for slower speech',
      native: '你可以说慢一点吗？',
      roman: 'nǐ kěyǐ shuō màn yìdiǎn ma',
      mouth: 'nee kuh-yee shwoh mahn ee-dyen mah',
      literal: 'You can speak slow a little question?',
      natural: 'Can you speak a little slower?',
      register: 'Safe and practical with a teacher, friend, or stranger.',
      breakdown: '可以 = can · 说 = speak · 慢一点 = a little slower · 吗 = question marker',
      replyPrompt: 'Type the sentence once, then say it out loud three times.',
      sampleReply: '你可以说慢一点吗？ Can you speak a little slower?',
      coach: 'This phrase keeps the conversation alive instead of forcing you to switch to English.'
    }
  ],
  ko: [
    {
      title: 'Friendly check-in',
      native: '오늘 어때요?',
      roman: 'oneul eottaeyo',
      mouth: 'oh-neul uh-ttae-yo',
      literal: 'Today how is it?',
      natural: 'How’s today? / How are you today?',
      register: 'Polite-casual. Safe for most ordinary situations.',
      breakdown: '오늘 = today · 어때요 = how is it?',
      replyPrompt: 'Answer with one sentence about your mood.',
      sampleReply: '오늘 좀 피곤해요. oneul jom pigonhaeyo. I’m a little tired today.',
      coach: 'Keep the ending 요 clear. It makes the phrase safer and more polite.'
    },
    {
      title: 'Say you are practicing',
      native: '한국어 연습하고 있어요.',
      roman: 'hangugeo yeonseup-hago isseoyo',
      mouth: 'hahn-goo-gaw yun-seup-ha-go ee-saw-yo',
      literal: 'Korean practice-doing am.',
      natural: 'I’m practicing Korean.',
      register: 'Polite, simple, and easy to reuse.',
      breakdown: '한국어 = Korean language · 연습 = practice · 하고 있어요 = am doing',
      replyPrompt: 'Swap 한국어 for another language you practice.',
      sampleReply: '스페인어 연습하고 있어요. I’m practicing Spanish.',
      coach: 'A good identity phrase. It tells people why you are speaking slowly.'
    }
  ]
};

let state = loadState();

function loadState() {
  try {
    return { target: 'es', phrase: 0, reveal: false, saved: [], answer: '', coach: null, loadingCoach: false, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch (_) {
    return { target: 'es', phrase: 0, reveal: false, saved: [], answer: '', coach: null, loadingCoach: false };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, saved: state.saved.slice(-20) }));
}

function esc(text) {
  return String(text ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

function currentItem() {
  const pack = packs[state.target] || packs.es;
  state.phrase = Math.max(0, Math.min(Number(state.phrase) || 0, pack.length - 1));
  return pack[state.phrase];
}

function currentLanguage() {
  return languages.find(lang => lang.id === state.target) || languages[0];
}

function progressText() {
  const pack = packs[state.target] || [];
  return `${state.phrase + 1} of ${pack.length}`;
}

function renderSavedList() {
  if (!state.saved.length) {
    return '<p class="empty-note">No saved answers yet. Write one honest sentence and save it.</p>';
  }
  return state.saved.slice(-3).reverse().map(entry => `
    <li>
      <span>${esc((languages.find(lang => lang.id === entry.target) || {}).short || entry.target)}</span>
      <div><b>${esc(entry.phrase)}</b><p>${esc(entry.answer)}</p></div>
    </li>`).join('');
}

function renderCoachCard() {
  if (state.loadingCoach) {
    return '<div class="deepseek-card"><span>DeepSeek coach</span><p>Reading your reply and preparing a cleaner phrase...</p></div>';
  }
  if (!state.coach) return '';
  if (state.coach.error) {
    return `<div class="deepseek-card"><span>DeepSeek coach</span><p class="error">${esc(state.coach.error)}</p></div>`;
  }
  const alternatives = Array.isArray(state.coach.alternatives) ? state.coach.alternatives : [];
  return `
    <div class="deepseek-card">
      <span>DeepSeek coach</span>
      <p><b>Natural version:</b> ${esc(state.coach.natural || '')}</p>
      ${state.coach.note ? `<p><b>Why:</b> ${esc(state.coach.note)}</p>` : ''}
      ${alternatives.length ? `<ul>${alternatives.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
    </div>`;
}

function render() {
  const item = currentItem();
  const lang = currentLanguage();
  const pack = packs[state.target] || [];
  const progress = pack.length ? ((state.phrase + 1) / pack.length) * 100 : 0;

  document.getElementById('app').innerHTML = `
    <section class="practice-layout">
      <aside class="side-card" aria-label="Choose a language">
        <div class="section-heading">
          <span>Step 1</span>
          <h2>Choose your lane</h2>
        </div>
        <div class="language-list">
          ${languages.map(option => `
            <button class="language-option ${option.id === state.target ? 'active' : ''}" onclick="setTarget('${option.id}')" aria-pressed="${option.id === state.target}">
              <span class="language-code">${esc(option.short)}</span>
              <span><b>${esc(option.label)}</b><small>${esc(option.note)}</small></span>
            </button>`).join('')}
        </div>
        <div class="mini-stat">
          <span>${state.saved.length}</span>
          <p>saved answer${state.saved.length === 1 ? '' : 's'} on this device</p>
        </div>
      </aside>

      <article class="lesson-card">
        <div class="lesson-topline">
          <div>
            <span class="step-label">Step 2</span>
            <h2>${esc(lang.label)} practice</h2>
            <p>${esc(lang.focus)}</p>
          </div>
          <div class="progress-pill">${esc(progressText())}</div>
        </div>
        <div class="progress-track" aria-hidden="true"><span style="width:${progress}%"></span></div>

        <div class="phrase-stage">
          <p class="phrase-title">${esc(item.title)}</p>
          <div class="native-line">${esc(item.native)}</div>
          <div class="sound-line">${esc(item.roman || '')}</div>
          ${item.mouth ? `<div class="sound-help">Mouth cue: ${esc(item.mouth)}</div>` : ''}
        </div>

        <div class="meaning-grid">
          <div><span>Means</span><p>${esc(item.natural)}</p></div>
          <div><span>Literally</span><p>${esc(item.literal)}</p></div>
          <div><span>Tone</span><p>${esc(item.register)}</p></div>
          <div><span>Pieces</span><p>${esc(item.breakdown)}</p></div>
        </div>

        <div class="coach-note"><b>Coach note:</b> ${esc(item.coach)}</div>
      </article>

      <section class="answer-card" aria-label="Write your answer">
        <div class="section-heading">
          <span>Step 3</span>
          <h2>Your reply</h2>
        </div>
        <label for="answer">${esc(item.replyPrompt)}</label>
        <textarea id="answer" rows="5" placeholder="Write one useful sentence, not a perfect essay." oninput="rememberAnswer(this.value)">${esc(state.answer || '')}</textarea>
        <div class="action-row">
          <button class="primary-action" onclick="saveAnswer()">Save answer</button>
          <button class="deepseek-action" onclick="coachPhrase()" ${state.loadingCoach ? 'disabled' : ''}>${state.loadingCoach ? 'Coaching...' : 'Improve with DeepSeek'}</button>
          <button onclick="toggleModel()">${state.reveal ? 'Hide model' : 'Show model'}</button>
          <button onclick="nextPhrase()">Next phrase</button>
        </div>
        ${renderCoachCard()}
        ${state.reveal ? `<div class="model-card"><span>Model answer</span><p>${esc(item.sampleReply)}</p></div>` : ''}
      </section>

      <aside class="saved-card" aria-label="Recent saved answers">
        <div class="section-heading">
          <span>Recent</span>
          <h2>Saved practice</h2>
        </div>
        <ul>${renderSavedList()}</ul>
      </aside>
    </section>`;
}

function setTarget(target) {
  if (!packs[target]) return;
  state.target = target;
  state.phrase = 0;
  state.reveal = false;
  state.answer = '';
  state.coach = null;
  saveState();
  render();
}

function rememberAnswer(answer) {
  state.answer = answer;
  state.coach = null;
  saveState();
}

async function coachPhrase() {
  const answer = document.getElementById('answer').value.trim();
  if (!answer) {
    state.coach = { error: 'Write a sentence first, then DeepSeek can improve it.' };
    render();
    return;
  }
  const item = currentItem();
  const lang = currentLanguage();
  state.answer = answer;
  state.loadingCoach = true;
  state.coach = null;
  render();
  try {
    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang.label,
        phrase: item.native,
        natural: item.natural,
        prompt: item.replyPrompt,
        answer
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'DeepSeek coach is unavailable.');
    state.coach = data;
  } catch (error) {
    state.coach = {
      error: 'DeepSeek coach is not reachable yet. I kept your answer locally, so you can still save it and compare with the model reply.'
    };
  } finally {
    state.loadingCoach = false;
    saveState();
    render();
  }
}

function toggleModel() {
  state.reveal = !state.reveal;
  saveState();
  render();
}

function nextPhrase() {
  const pack = packs[state.target] || [];
  state.phrase = pack.length ? (state.phrase + 1) % pack.length : 0;
  state.reveal = false;
  state.answer = '';
  state.coach = null;
  saveState();
  render();
}

function saveAnswer() {
  const answer = document.getElementById('answer').value.trim();
  if (!answer) return;
  const item = currentItem();
  state.saved.push({ target: state.target, phrase: item.native, answer, savedAt: new Date().toISOString() });
  state.saved = state.saved.slice(-20);
  state.answer = '';
  saveState();
  render();
}

render();

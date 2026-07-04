const STORAGE_KEY = 'language_practice_space_v1';

const languages = [
  { id: 'es', label: 'Spanish', note: 'daily speech, pronunciation, useful replies' },
  { id: 'zh', label: 'Mandarin', note: 'characters, pinyin, tones, English-mouth sound cues' },
  { id: 'ko', label: 'Korean', note: 'Hangul, romanization, sound-change notes' }
];

const packs = {
  es: [
    {
      title: 'Check in with someone',
      native: '¿Cómo te va hoy?',
      roman: 'KOH-moh teh vah oy',
      literal: 'How is it going for you today?',
      natural: 'How’s your day going?',
      register: 'Safe, casual, normal with friends or coworkers.',
      breakdown: 'cómo = how · te = for you/to you · va = it goes · hoy = today',
      replyPrompt: 'Answer in Spanish with one sentence about your day.',
      sampleReply: 'Me va bien, pero estoy un poco cansado. - I’m doing well, but I’m a little tired.'
    },
    {
      title: 'Say what you need',
      native: 'Necesito un minuto para pensarlo.',
      roman: 'neh-seh-SEE-toh oon mee-NOO-toh PAH-rah pen-SAHR-loh',
      literal: 'I need a minute in order to think it.',
      natural: 'I need a minute to think about it.',
      register: 'Safe and useful in real conversations.',
      breakdown: 'necesito = I need · un minuto = one minute · para = in order to · pensarlo = to think it over',
      replyPrompt: 'Write a version that asks for more time politely.',
      sampleReply: '¿Me das un minuto para pensarlo? - Can you give me a minute to think about it?'
    }
  ],
  zh: [
    {
      title: 'Natural greeting',
      native: '你今天怎么样？',
      roman: 'nǐ jīntiān zěnme yàng',
      mouth: 'nee↓↗ jin-tyen¯ dzun-muh↓↗ yahng↘',
      literal: 'You today how?',
      natural: 'How are you today?',
      register: 'Safe, normal, conversational.',
      breakdown: '你 = you · 今天 = today · 怎么样 = how is it / how are things',
      replyPrompt: 'Answer in Mandarin with one short sentence about how you feel.',
      sampleReply: '我有点累，但是还好。wǒ yǒudiǎn lèi, dànshì hái hǎo - I’m a little tired, but okay.'
    },
    {
      title: 'Ask for slower speech',
      native: '你可以说慢一点吗？',
      roman: 'nǐ kěyǐ shuō màn yìdiǎn ma',
      mouth: 'nee↓↗ kuh-yee↓↗ shwoh¯ mahn↘ ee-dyen↓↗ mah',
      literal: 'You can speak slow a little question?',
      natural: 'Can you speak a little slower?',
      register: 'Safe and practical.',
      breakdown: '可以 = can · 说 = speak · 慢一点 = a little slower · 吗 = question marker',
      replyPrompt: 'Type the sentence once, then say it out loud three times.',
      sampleReply: '你可以说慢一点吗？ - Can you speak a little slower?'
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
      register: 'Polite-casual; safe for most situations.',
      breakdown: '오늘 = today · 어때요 = how is it?',
      replyPrompt: 'Answer in Korean with one sentence about your mood.',
      sampleReply: '오늘 좀 피곤해요. oneul jom pigonhaeyo - I’m a little tired today.'
    },
    {
      title: 'Say you are practicing',
      native: '한국어 연습하고 있어요.',
      roman: 'hangugeo yeonseup-hago isseoyo',
      mouth: 'hahn-goo-gaw yun-seup-ha-go ee-saw-yo',
      literal: 'Korean practice-doing am.',
      natural: 'I’m practicing Korean.',
      register: 'Polite, simple, safe.',
      breakdown: '한국어 = Korean language · 연습 = practice · 하고 있어요 = am doing',
      replyPrompt: 'Swap 한국어 for another language you practice.',
      sampleReply: '스페인어 연습하고 있어요. - I’m practicing Spanish.'
    }
  ]
};

let state = loadState();

function loadState() {
  try {
    return { target: 'es', phrase: 0, reveal: false, saved: [], ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch (_) {
    return { target: 'es', phrase: 0, reveal: false, saved: [] };
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

function render() {
  const item = currentItem();
  const pack = packs[state.target] || [];
  document.getElementById('app').innerHTML = `
    <div class="language-card">
      <div class="topline">
        <strong>${state.saved.length}</strong><span>saved answers</span>
      </div>
      <div class="pills">
        ${languages.map(lang => `<button class="pill ${lang.id === state.target ? 'active' : ''}" onclick="setTarget('${lang.id}')"><b>${esc(lang.label)}</b><span>${esc(lang.note)}</span></button>`).join('')}
      </div>
      <article class="phrase-card">
        <div class="meta">Phrase ${state.phrase + 1} of ${pack.length} · ${esc(item.title)}</div>
        <div class="native">${esc(item.native)}</div>
        <div class="roman">${esc(item.roman || '')}</div>
        ${item.mouth ? `<div class="mouth">English-mouth: ${esc(item.mouth)}</div>` : ''}
        <div class="grid">
          <p><b>Literal:</b> ${esc(item.literal)}</p>
          <p><b>Natural:</b> ${esc(item.natural)}</p>
          <p><b>Register:</b> ${esc(item.register)}</p>
          <p><b>Pieces:</b> ${esc(item.breakdown)}</p>
        </div>
        <label for="answer">Your turn</label>
        <p class="prompt">${esc(item.replyPrompt)}</p>
        <textarea id="answer" rows="4" placeholder="Type your answer here."></textarea>
        <div class="actions">
          <button onclick="saveAnswer()">Save answer</button>
          <button onclick="toggleModel()">${state.reveal ? 'Hide model reply' : 'Show model reply'}</button>
          <button onclick="nextPhrase()">Next phrase</button>
        </div>
        ${state.reveal ? `<div class="model"><b>Model reply:</b> ${esc(item.sampleReply)}</div>` : ''}
      </article>
    </div>`;
}

function setTarget(target) {
  if (!packs[target]) return;
  state.target = target;
  state.phrase = 0;
  state.reveal = false;
  saveState();
  render();
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
  saveState();
  render();
}

function saveAnswer() {
  const answer = document.getElementById('answer').value.trim();
  if (!answer) return;
  const item = currentItem();
  state.saved.push({ target: state.target, phrase: item.native, answer, savedAt: new Date().toISOString() });
  state.saved = state.saved.slice(-20);
  saveState();
  render();
}

render();
